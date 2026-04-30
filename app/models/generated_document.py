from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import Field, UUID4

from .base import OrganizationScopedModel, TimestampedModel
from .enums import GeneratedDocumentStatus


class GeneratedDocumentCreate(OrganizationScopedModel):
    employee_id: UUID4
    trigger_id: Optional[UUID4] = None
    document_type: str = Field(..., min_length=1, max_length=200)
    status: GeneratedDocumentStatus = GeneratedDocumentStatus.queued
    content: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = Field(default=None, max_length=4000)


class GeneratedDocument(GeneratedDocumentCreate, TimestampedModel):
    id: UUID4


class GeneratedDocumentGenerationResult(GeneratedDocumentCreate):
    """
    Convenience schema for when we later add background document generation.
    """

    generated_at: Optional[datetime] = None

