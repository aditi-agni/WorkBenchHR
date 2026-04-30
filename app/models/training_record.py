from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import Field, UUID4

from .base import OrganizationScopedModel, TimestampedModel


class TrainingRecordCreate(OrganizationScopedModel):
    employee_id: UUID4
    training_name: str = Field(..., min_length=1, max_length=250)
    provider: Optional[str] = Field(default=None, max_length=250)
    completed_at: Optional[datetime] = None
    expires_at: Optional[date] = None
    notes: Optional[str] = Field(default=None, max_length=4000)


class TrainingRecord(TrainingRecordCreate, TimestampedModel):
    id: UUID4

