from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import Field, UUID4

from .base import OrganizationScopedModel, TimestampedModel
from .enums import OnboardingTaskStatus


class OnboardingTaskCreate(OrganizationScopedModel):
    employee_id: UUID4
    title: str = Field(..., min_length=1, max_length=250)
    description: Optional[str] = Field(default=None, max_length=2000)
    due_date: Optional[date] = None
    status: OnboardingTaskStatus = OnboardingTaskStatus.todo
    assigned_to: Optional[str] = Field(default=None, max_length=200)
    completed_at: Optional[datetime] = None


class OnboardingTask(OnboardingTaskCreate, TimestampedModel):
    id: UUID4

