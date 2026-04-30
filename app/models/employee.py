from __future__ import annotations

from typing import Optional

from pydantic import Field, UUID4

from .base import OrganizationScopedModel, TimestampedModel


class EmployeeCreate(OrganizationScopedModel):
    full_name: str = Field(..., min_length=1, max_length=200)
    email: Optional[str] = Field(default=None, max_length=320)
    role_title: Optional[str] = Field(default=None, max_length=200)


class Employee(EmployeeCreate, TimestampedModel):
    id: UUID4

