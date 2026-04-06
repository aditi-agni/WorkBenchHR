from __future__ import annotations

from fastapi import APIRouter

from app.models.rag import RagIngestRequest, RagIngestResponse, RagQueryRequest, RagQueryResponse
from app.services.rag_service import ingest_document, ingest_seed_offer_letter, query_documents

router = APIRouter()


@router.post("/ingest", response_model=RagIngestResponse)
def ingest(request: RagIngestRequest) -> RagIngestResponse:
    return ingest_document(request)


@router.post("/query", response_model=RagQueryResponse)
def query(request: RagQueryRequest) -> RagQueryResponse:
    return query_documents(request)


@router.post("/ingest-seed-offer-letter", response_model=RagIngestResponse)
def ingest_seed() -> RagIngestResponse:
    return ingest_seed_offer_letter()
