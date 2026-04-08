import { useState } from "react";

export function useDocumentGeneration() {
  const [document, setDocument] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const generate = async (documentType, employee) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_type: documentType, employee }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Generation failed");
      }
      const data = await res.json();
      setDocument(data.document);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const reset = () => { setDocument(""); setStatus("idle"); setError(null); };
  return { document, setDocument, status, error, generate, reset };
}
