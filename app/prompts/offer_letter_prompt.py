from __future__ import annotations


def build_offer_letter_prompt(data: dict) -> str:
    return f"""You are an HR specialist. Write a formal, professional offer letter using the details below.
The letter should be ready to send — no placeholders, no commentary, just the letter itself.

Details:
- Candidate Name: {data["employee_name"]}
- Role Title: {data["role_title"]}
- Compensation: {data["salary"]}
- Start Date: {data["start_date"]}
- Reporting Manager: {data["manager_name"]}
- Company Name: {data["company_name"]}

The letter should include:
1. A warm but professional opening congratulating the candidate
2. The role title and start date
3. Compensation details
4. Reporting structure (who they report to)
5. A brief note about next steps (e.g., signing and returning the letter)
6. A professional closing from the company

Use a formal business letter format."""
