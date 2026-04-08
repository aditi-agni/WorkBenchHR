import os, sys, re, json
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
load_dotenv(Path(__file__).parent.parent.parent / ".env")

from openai import OpenAI
from pinecone import Pinecone

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
INDEX_NAME    = os.getenv("PINECONE_INDEX_NAME")
NAMESPACE     = os.getenv("PINECONE_NAMESPACE", "workbench-hr")
CHUNK_SIZE    = 500
CHUNK_OVERLAP = 50

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc    = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(INDEX_NAME)

DOC_TYPE_MAP = {
    "offer_letter":                 "offer_letter",
    "termination_misconduct":       "termination_misconduct",
    "termination_poor_performance": "termination_poor_performance",
    "termination_layoff":           "termination_layoff",
}

REQUIRED_KEYWORDS = ["name", "date", "title", "company", "reason", "type"]

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def split_text(text: str) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start = end - CHUNK_OVERLAP
        if start >= len(text):
            break
    return chunks

def is_required(key: str) -> bool:
    return any(kw in key.lower() for kw in REQUIRED_KEYWORDS)

def make_label(key: str) -> str:
    return key.replace("_", " ").title()

def extract_fields(text: str) -> list[dict]:
    raw_keys    = re.findall(r'\{\{(\w+)\}\}', text)
    unique_keys = list(dict.fromkeys(raw_keys))
    unique_keys = [k for k in unique_keys if k != "current_date"]
    return [
        {"key": k, "label": make_label(k), "required": is_required(k)}
        for k in unique_keys
    ]

def make_doc_label(stem: str) -> str:
    return stem.replace("_", " ").title()

def index_templates():
    print(f"\nIndexing -> {INDEX_NAME} / {NAMESPACE}\n")

    for md_file in sorted(TEMPLATES_DIR.glob("*.md")):
        doc_type = DOC_TYPE_MAP.get(md_file.stem)
        if not doc_type:
            continue

        print(f"  {md_file.name}...")
        full_text = md_file.read_text(encoding="utf-8")
        fields    = extract_fields(full_text)
        chunks    = split_text(full_text)

        vectors = []
        for i, chunk in enumerate(chunks):
            embedding = get_embedding(chunk)
            vectors.append({
                "id": f"{doc_type}_chunk_{i}",
                "values": embedding,
                "metadata": {
                    "doc_type":    doc_type,
                    "doc_label":   make_doc_label(md_file.stem),
                    "chunk_index": i,
                    "text":        chunk,
                    "fields":      json.dumps(fields) if i == 0 else "",
                }
            })

        index.upsert(vectors=vectors, namespace=NAMESPACE)
        print(f"     {len(chunks)} chunks, {len(fields)} fields OK")
        print(f"     required: {[f['key'] for f in fields if f['required']]}")
        print(f"     optional: {[f['key'] for f in fields if not f['required']]}\n")

    print("Done.\n")


def test_config():
    print("Config test (simulating /documents/config):\n")
    for doc_type in DOC_TYPE_MAP:
        vec = get_embedding(doc_type)
        results = index.query(
            vector=vec, top_k=10, include_metadata=True,
            namespace=NAMESPACE,
            filter={"doc_type": {"$eq": doc_type}, "chunk_index": {"$eq": 0}}
        )
        if results.matches:
            meta   = results.matches[0].metadata
            fields = json.loads(meta.get("fields", "[]"))
            print(f"  {doc_type}: {len(fields)} fields found")
            print(f"    required: {[f['key'] for f in fields if f['required']]}")
            print(f"    optional: {[f['key'] for f in fields if not f['required']]}\n")
        else:
            print(f"  {doc_type}: NO MATCH — re-run indexing\n")


if __name__ == "__main__":
    index_templates()
    test_config()
