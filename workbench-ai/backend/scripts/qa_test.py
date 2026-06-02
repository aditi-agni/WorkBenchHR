import json
import re
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000"

employees = [
    {
        "id": "emp_001",
        "employee_name": "Jane Smith",
        "employee_address": "456 Oak Ave, Pittsburgh, PA 15202",
        "job_title": "Marketing Manager",
        "department": "Marketing",
        "manager_name": "Robert Chen",
        "manager_title": "VP of Marketing",
        "company_name": "Acme Corp",
        "location": "Pittsburgh, PA (Hybrid)",
        "employment_type": "Full-Time",
        "salary": "75,000",
        "pay_frequency": "bi-weekly",
        "benefits": "Health, Dental, Vision, 401k, 15 days PTO",
        "offer_expiry_date": "2026-04-10",
        "termination_date": "2026-04-15",
        "final_pay_date": "2026-04-21",
        "benefits_end_date": "2026-05-31",
        "return_date": "2026-04-15",
        "hr_contact": "HR Department",
        "hr_email": "hr@acmecorp.com",
        "company_property": "laptop, ID badge, parking pass",
        "termination_reason": "repeated policy violations",
        "misconduct_issues": "attendance and conduct",
        "counseling_dates": "January 10 and February 3, 2026",
        "warning_date": "March 1, 2026",
        "misconduct_detail": "insubordination",
        "warning_dates": "January 15 and February 20, 2026",
        "performance_issue_1": "Missed 4 consecutive project deadlines",
        "performance_issue_2": "Incomplete deliverables on Q1 campaign",
        "performance_issue_3": "Failed to meet KPIs set in January review",
        "layoff_reason": "recent market changes requiring cost reduction",
        "severance_amount": "$7,500",
        "severance_details": "one month salary and extended health coverage",
        "current_date": "April 4, 2026",
    },
    {
        "id": "emp_002",
        "employee_name": "Marcus Lee",
        "employee_address": "789 Elm St, Pittsburgh, PA 15203",
        "job_title": "Software Engineer",
        "department": "Engineering",
        "manager_name": "Priya Patel",
        "manager_title": "Engineering Manager",
        "company_name": "Acme Corp",
        "location": "Pittsburgh, PA (Remote)",
        "employment_type": "Full-Time",
        "salary": "110,000",
        "pay_frequency": "bi-weekly",
        "benefits": "Health, Dental, Vision, 401k, 20 days PTO, Stock Options",
        "offer_expiry_date": "2026-04-12",
        "termination_date": "2026-03-31",
        "final_pay_date": "2026-04-07",
        "benefits_end_date": "2026-04-30",
        "return_date": "2026-04-03",
        "hr_contact": "HR Department",
        "hr_email": "hr@acmecorp.com",
        "company_property": "MacBook Pro, monitor, security key",
        "termination_reason": "position elimination due to restructuring",
        "misconduct_issues": "conduct and safety policy",
        "counseling_dates": "December 5 and January 8, 2026",
        "warning_date": "February 1, 2026",
        "misconduct_detail": "violation of remote work policy",
        "warning_dates": "December 10, 2025 and January 20, 2026",
        "performance_issue_1": "Sprint velocity consistently below team average",
        "performance_issue_2": "Critical bug introduced in v2.3 release",
        "performance_issue_3": "Failure to complete onboarding documentation",
        "layoff_reason": "company-wide engineering restructuring",
        "severance_amount": "$18,333",
        "severance_details": "two months salary and COBRA coverage",
        "current_date": "April 4, 2026",
    },
]

doc_types = [
    "offer_letter",
    "termination_misconduct",
    "termination_poor_performance",
    "termination_layoff",
]

def post_json(url, payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())

def check_health():
    with urllib.request.urlopen(f"{BASE_URL}/health", timeout=5) as resp:
        return json.loads(resp.read())

def check_types():
    with urllib.request.urlopen(f"{BASE_URL}/documents/types", timeout=5) as resp:
        return json.loads(resp.read())

def run_qa():
    print("=" * 60)
    print("PIPELINE QA TEST")
    print("=" * 60)

    # Health
    health = check_health()
    print(f"\n[health]  {health}")

    # Types
    types_resp = check_types()
    type_values = [t["value"] for t in types_resp["types"]]
    print(f"[types]   {type_values}")
    assert len(type_values) == 4, "Expected 4 document types"

    results = []
    print()

    for doc_type in doc_types:
        for emp in employees:
            label = f"{doc_type} | {emp['employee_name']}"
            try:
                resp = post_json(
                    f"{BASE_URL}/documents/generate",
                    {"document_type": doc_type, "employee": emp},
                )
                doc = resp.get("document", "")
                unfilled = re.findall(r"\{\{[^}]+\}\}", doc)
                missing = re.findall(r"\[MISSING:[^\]]+\]", doc)
                lines = doc.strip().splitlines()
                status = "PASS" if not unfilled and not missing else "FAIL"
                results.append((label, status, unfilled, missing))

                print(f"[{status}] {label}")
                print(f"       Lines: {len(lines)}")
                if unfilled:
                    print(f"       UNFILLED: {unfilled}")
                if missing:
                    print(f"       MISSING:  {missing}")
                print(f"       Preview: {lines[0][:80] if lines else '(empty)'}")
                print()

            except Exception as e:
                results.append((label, "ERROR", [], []))
                print(f"[ERROR] {label}")
                print(f"        {e}")
                print()

    passed = sum(1 for _, s, _, _ in results if s == "PASS")
    total = len(results)
    print("=" * 60)
    print(f"RESULT: {passed}/{total} passed")
    print("=" * 60)

if __name__ == "__main__":
    run_qa()
