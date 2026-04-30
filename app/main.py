from fastapi import FastAPI

from app.routes.documents import router as documents_router
from app.routes.rag import router as rag_router

app = FastAPI()

app.include_router(documents_router, prefix="/documents")
app.include_router(rag_router, prefix="/rag")


@app.get("/health")
def health():
    return {"status": "ok"}
