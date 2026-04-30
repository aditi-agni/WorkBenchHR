from __future__ import annotations

from pydantic import BaseModel


class DocumentGenerationRequest(BaseModel):
    employee_name: str
    role_title: str
    salary: str
    start_date: str
    manager_name: str
    company_name: str
    document_type: str  # "offer_letter" or "termination_letter"
    # termination_letter fields
    termination_date: str | None = None
    termination_reason: str | None = None
    final_pay_date: str | None = None
    return_deadline: str | None = None


class DocumentGenerationResponse(BaseModel):
    document_text: str
    status: str
