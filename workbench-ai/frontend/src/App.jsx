import { useState, useEffect } from "react";
import DocumentForm from "./components/DocumentForm";
import DocumentPreview from "./components/DocumentPreview";
import LoadingState from "./components/LoadingState";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";
import "./styles/index.css";

export default function App() {
  const { document, setDocument, status, error, generate, reset } = useDocumentGeneration();
  const [docTypes, setDocTypes] = useState([]);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    fetch("/api/documents/config")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load document configuration");
        return res.json();
      })
      .then((data) => {
        setDocTypes(data.doc_types);
        setConfigLoading(false);
      })
      .catch((err) => {
        setConfigError(err.message);
        setConfigLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header>
        <h1>WorkBench<span>AI</span></h1>
        <p>HR Document Generation</p>
      </header>
      <main>
        {configLoading && <p className="loading-config">Loading configuration...</p>}
        {configError && <p className="error">{configError}</p>}
        {!configLoading && !configError && (
          <>
            {(status === "idle" || status === "error") && (
              <>
                <DocumentForm onGenerate={generate} isLoading={status === "loading"} docTypes={docTypes} />
                {error && <p className="error">{error}</p>}
              </>
            )}
            {status === "loading" && <LoadingState />}
            {status === "success" && (
              <DocumentPreview document={document} setDocument={setDocument} onReset={reset} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
