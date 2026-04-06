from __future__ import annotations

from openai import OpenAI

from app.services.config import get_settings

# Using OpenAI text-embedding-3-small (1536-dim).
# Requires OPENAI_API_KEY in .env.
_EMBEDDING_MODEL = "text-embedding-3-small"


def _get_client() -> OpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise NotImplementedError(
            "OPENAI_API_KEY is not set. Add it to your .env file to enable embeddings."
        )
    return OpenAI(api_key=settings.openai_api_key)


def embed_text(text: str) -> list[float]:
    client = _get_client()
    response = client.embeddings.create(input=text, model=_EMBEDDING_MODEL)
    return response.data[0].embedding


def embed_texts(texts: list[str]) -> list[list[float]]:
    client = _get_client()
    response = client.embeddings.create(input=texts, model=_EMBEDDING_MODEL)
    # Results are returned in order
    return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]
