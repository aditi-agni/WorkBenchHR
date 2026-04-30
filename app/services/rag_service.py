from __future__ import annotations

from pathlib import Path

from app.models.rag import (
    RagIngestRequest,
    RagIngestResponse,
    RagMatch,
    RagQueryRequest,
    RagQueryResponse,
)
from app.services.chunking_service import chunk_text
from app.services.embedding_service import embed_text, embed_texts
from app.services.pinecone_client import get_pinecone_index

_SEED_DIR = Path(__file__).parent.parent / "rag_seed_data"
_SEED_FILE = _SEED_DIR / "offer_letter.txt"


def ingest_document(request: RagIngestRequest) -> RagIngestResponse:
    chunks = chunk_text(request.text)
    texts = [c["text"] for c in chunks]
    vectors = embed_texts(texts)

    records = [
        {
            "id": f"{request.document_id}-{chunk['chunk_index']}",
            "values": vector,
            "metadata": {
                "document_id": request.document_id,
                "document_name": request.document_name,
                "document_type": request.document_type,
                "chunk_index": chunk["chunk_index"],
                "text": chunk["text"],
            },
        }
        for chunk, vector in zip(chunks, vectors)
    ]

    index = get_pinecone_index()
    index.upsert(vectors=records)

    return RagIngestResponse(status="success", chunks_ingested=len(records))


def query_documents(request: RagQueryRequest) -> RagQueryResponse:
    query_vector = embed_text(request.query)
    index = get_pinecone_index()

    filter_dict = None
    if request.document_type:
        filter_dict = {"document_type": {"$eq": request.document_type}}

    result = index.query(
        vector=query_vector,
        top_k=request.top_k,
        filter=filter_dict,
        include_metadata=True,
    )

    matches = [
        RagMatch(
            id=match["id"],
            score=match["score"],
            text=match["metadata"].get("text", ""),
            metadata=match["metadata"],
        )
        for match in result["matches"]
    ]

    return RagQueryResponse(matches=matches)


def ingest_seed_offer_letter() -> RagIngestResponse:
    text = _SEED_FILE.read_text(encoding="utf-8")
    request = RagIngestRequest(
        document_id="offer_letter_seed_001",
        document_name="Offer Letter Template",
        document_type="offer_letter",
        text=text,
    )
    return ingest_document(request)


def ingest_seed_termination_letter() -> RagIngestResponse:
    text = (_SEED_DIR / "termination_letter.txt").read_text(encoding="utf-8")
    request = RagIngestRequest(
        document_id="termination_letter_seed_001",
        document_name="Termination Letter Template",
        document_type="termination_letter",
        text=text,
    )
    return ingest_document(request)
