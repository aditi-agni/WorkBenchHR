from __future__ import annotations

from functools import lru_cache
from typing import Any

from pinecone import Pinecone

from app.services.config import get_settings


@lru_cache(maxsize=1)
def get_pinecone_index() -> Any:
    """
    Returns a Pinecone Index object, lazily initialised and cached.
    Requires PINECONE_API_KEY and PINECONE_INDEX_NAME in .env.
    Optionally uses PINECONE_INDEX_HOST for direct host access (faster).
    """
    settings = get_settings()
    pc = Pinecone(api_key=settings.pinecone_api_key)

    if settings.pinecone_index_host:
        return pc.Index(host=settings.pinecone_index_host)

    return pc.Index(name=settings.pinecone_index_name)
