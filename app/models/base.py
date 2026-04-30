from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, UUID4


class WghBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class OrganizationScopedModel(WghBaseModel):
    organization_id: UUID4


class TimestampedModel(WghBaseModel):
    created_at: datetime
    updated_at: datetime

