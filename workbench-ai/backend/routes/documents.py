import json
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pinecone import Pinecone
from services.rag import retrieve_template
from services.llm import generate_document
from services.embedder import get_embedding

router = APIRouter()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
_index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))
NAMESPACE = os.getenv("PINECONE_NAMESPACE", "workbench-hr")

DOC_TYPE_LABELS = {
    "offer_letter":                 "Offer Letter",
    "termination_misconduct":       "Termination \u2014 Misconduct",
    "termination_poor_performance": "Termination \u2014 Poor Performance",
    "termination_layoff":           "Termination \u2014 Layoff",
}

class GenerateRequest(BaseModel):
    document_type: str
    employee: dict

@router.post("/generate")
async def generate(request: GenerateRequest):
    try:
        template = await retrieve_template(request.document_type)
        document = await generate_document(template, request.employee)
        return {"document": document, "doc_type": request.document_type}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.get("/config")
def get_config():
    try:
        doc_types = []
        for doc_type, label in DOC_TYPE_LABELS.items():
            vec = get_embedding(doc_type)
            results = _index.query(
                vector=vec,
                top_k=10,
                include_metadata=True,
                namespace=NAMESPACE,
                filter={"doc_type": {"$eq": doc_type}, "chunk_index": {"$eq": 0}}
            )
            fields = []
            if results.matches:
                meta = results.matches[0].metadata
                fields = json.loads(meta.get("fields", "[]"))
            doc_types.append({"value": doc_type, "label": label, "fields": fields})
        return {"doc_types": doc_types}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Config fetch failed: {str(e)}")
