from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.document_generation import DocumentGenerationRequest, DocumentGenerationResponse
from app.services.document_generation_service import generate_document

router = APIRouter()


@router.post("/generate", response_model=DocumentGenerationResponse)
async def generate_document_route(request: DocumentGenerationRequest) -> DocumentGenerationResponse:
    if request.document_type != "offer_letter":
        raise HTTPException(status_code=400, detail=f"Unsupported document type: {request.document_type}")
    return await generate_document(request)
