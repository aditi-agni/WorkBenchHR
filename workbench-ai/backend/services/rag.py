import os
from pinecone import Pinecone
from services.embedder import get_embedding

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))
NAMESPACE = os.getenv("PINECONE_NAMESPACE", "workbench-hr")

async def retrieve_template(doc_type: str) -> str:
    query_vector = get_embedding(doc_type)

    results = index.query(
        vector=query_vector,
        top_k=5,
        include_metadata=True,
        namespace=NAMESPACE,
        filter={"doc_type": {"$eq": doc_type}}
    )

    if not results.matches:
        raise ValueError(f"No template found for: {doc_type}")

    if results.matches[0].score < 0.3:
        raise ValueError(f"Low confidence match for {doc_type} "
                         f"(score: {results.matches[0].score:.2f})")

    matches = sorted(results.matches,
                     key=lambda m: m.metadata.get("chunk_index", 0))
    return "\n".join(m.metadata.get("text", "") for m in matches)
