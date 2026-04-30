from __future__ import annotations

from typing import Any, Optional

from pydantic import Field, UUID4

from .base import OrganizationScopedModel, TimestampedModel
from .enums import TriggerType


class TriggerCreate(OrganizationScopedModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    trigger_type: TriggerType = TriggerType.manual
    payload: dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True


class Trigger(TriggerCreate, TimestampedModel):
    id: UUID4

