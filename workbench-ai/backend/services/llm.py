import os
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_document(template: str, employee: dict) -> str:
    employee_str = "\n".join(
        f"- {k}: {v}" for k, v in employee.items() if v
    )

    prompt = f"""You are a professional HR document writer.
Fill in the template using ONLY the employee data provided.
Do not invent any values. If a placeholder has no matching data,
write [MISSING: field_name].
Return the completed document only. No commentary.

TEMPLATE:
{template}

EMPLOYEE DATA:
{employee_str}

COMPLETED DOCUMENT:"""

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert HR document writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=2000
    )
    return response.choices[0].message.content
