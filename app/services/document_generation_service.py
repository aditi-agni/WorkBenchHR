from __future__ import annotations

import anthropic

from app.models.document_generation import DocumentGenerationRequest, DocumentGenerationResponse
from app.prompts.offer_letter_prompt import build_offer_letter_prompt
from app.services.config import get_settings
from app.services.supabase_client import get_supabase_client


def _retrieve_rag_context(document_type: str) -> str:
    """
    Attempt to pull relevant RAG chunks for the given document type.
    Returns a formatted context string, or empty string if retrieval fails.
    """
    try:
        from app.models.rag import RagQueryRequest
        from app.services.rag_service import query_documents

        result = query_documents(RagQueryRequest(query=document_type, document_type=document_type, top_k=3))
        if not result.matches:
            return ""
        context_parts = [m.text for m in result.matches]
        return "\n\n---\nReference context from internal templates:\n" + "\n\n".join(context_parts)
    except Exception:
        # RAG is non-critical — generation proceeds without it if anything fails
        return ""


async def generate_document(request: DocumentGenerationRequest) -> DocumentGenerationResponse:
    if request.document_type != "offer_letter":
        raise ValueError(f"Unsupported document type: {request.document_type}")

    rag_context = _retrieve_rag_context(request.document_type)
    prompt = build_offer_letter_prompt(request.model_dump()) + rag_context

    settings = get_settings()
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    document_text = message.content[0].text

    _save_to_supabase(request.document_type, document_text)

    return DocumentGenerationResponse(document_text=document_text, status="generated")


def _save_to_supabase(document_type: str, content: str) -> None:
    try:
        supabase = get_supabase_client()
        supabase.table("generated_documents").insert(
            {"document_type": document_type, "content": content, "status": "generated"}
        ).execute()
    except Exception:
        pass  # non-fatal
