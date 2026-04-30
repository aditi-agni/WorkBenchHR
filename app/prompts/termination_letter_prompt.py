from __future__ import annotations


def build_termination_letter_prompt(data: dict, rag_context: str = "") -> str:
    termination_date = data.get("termination_date") or "[Termination Date]"
    termination_reason = data.get("termination_reason") or "reasons discussed with the employee"
    final_pay_date = data.get("final_pay_date") or "[Final Pay Date]"
    return_deadline = data.get("return_deadline") or "[Return Deadline]"

    rag_section = ""
    if rag_context:
        rag_section = f"""

Use the following internal template as style and structure guidance:
{rag_context}
"""

    return f"""You are an HR specialist. Write a formal, professional termination letter using the details below.
The letter should be complete and ready to send — no placeholders left unfilled, no commentary, just the letter itself.
Do not invent facts that are not provided. Use neutral, professional language throughout.
{rag_section}
Details:
- Employee Name: {data["employee_name"]}
- Role Title: {data["role_title"]}
- Company Name: {data["company_name"]}
- Manager Name: {data["manager_name"]}
- Termination Date: {termination_date}
- Reason for Termination: {termination_reason}
- Final Pay Date: {final_pay_date}
- Company Property Return Deadline: {return_deadline}

The letter should include:
1. A formal opening notifying the employee of their termination and effective date
2. The stated reason for termination (use neutral wording if reason is general)
3. Final pay information and date
4. Instructions for returning company property by the return deadline
5. A brief note on benefits continuation and ongoing confidentiality obligations
6. A professional closing from the manager

Use a formal business letter format."""
