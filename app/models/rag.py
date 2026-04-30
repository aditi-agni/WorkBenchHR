from __future__ import annotations

from pydantic import BaseModel


class RagIngestRequest(BaseModel):
    document_id: str
    document_name: str
    document_type: str
    text: str


class RagIngestResponse(BaseModel):
    status: str
    chunks_ingested: int


class RagQueryRequest(BaseModel):
    query: str
    document_type: str | None = None
    top_k: int = 3


class RagMatch(BaseModel):
    id: str
    score: float
    text: str
    metadata: dict


class RagQueryResponse(BaseModel):
    matches: list[RagMatch]
