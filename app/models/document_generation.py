from __future__ import annotations

from pydantic import BaseModel


class DocumentGenerationRequest(BaseModel):
    employee_name: str
    role_title: str
    salary: str
    start_date: str
    manager_name: str
    company_name: str
    document_type: str  # only "offer_letter" supported


class DocumentGenerationResponse(BaseModel):
    document_text: str
    status: str
