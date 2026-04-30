import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SkipForNow } from "../components/SkipForNow";
import { saveUploadedDocuments } from "../lib/documentLibrary";

const MAX_FILES = 10;

const ACCEPT_EXT = new Set(["pdf", "doc", "docx"]);

const INITIAL_FILES = [
  "Employee_Handbook.pdf",
  "Offer_Letter.pdf",
  "Employee_Contract.pdf",
  "Code_of_Conduct.pdf",
  "Mission_Statement.pdf",
];

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function isAcceptedFile(name: string) {
  return ACCEPT_EXT.has(extOf(name));
}

export function OnboardingLearningPage() {
  const navigate = useNavigate();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>(() => [...INITIAL_FILES]);
  const [dragOver, setDragOver] = useState(false);

  const uploadComplete = files.length >= MAX_FILES;

  useEffect(() => {
    if (uploadComplete && files.length > 0) {
      saveUploadedDocuments(files);
    }
  }, [uploadComplete, files]);

  const addNames = useCallback((names: string[]) => {
    const next = names.filter(isAcceptedFile);
    if (next.length === 0) return;
    setFiles((prev) => {
      const merged = [...prev];
      for (const n of next) {
        if (merged.length >= MAX_FILES) break;
        if (!merged.includes(n)) merged.push(n);
      }
      return merged;
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const list = Array.from(e.dataTransfer.files).map((f) => f.name);
      addNames(list);
    },
    [addNames],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files).map((f) => f.name) : [];
    addNames(list);
    e.target.value = "";
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f !== name));
  };

  return (
    <div className="wb-page wb-onboarding wb-sync">
      <div className="wb-sync__top">
        <SkipForNow to="/settings/profile" />
      </div>

      <h1 className="wb-onboarding__title wb-sync__title">Sync Your Company DNA</h1>
      <p className="wb-onboarding__sub wb-sync__lede">
        To begin generating documentation tailored to your business, please upload a few initial
        files.
      </p>

      <div
        className={`wb-sync__drop${dragOver ? " wb-sync__drop--active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="presentation"
      >
        <div className="wb-sync__drop-icon" aria-hidden>
          <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
            <rect
              x="12"
              y="8"
              width="32"
              height="40"
              rx="4"
              stroke="var(--wb-green)"
              strokeWidth="2.5"
            />
            <path
              d="M28 36V18M20 26l8-8 8 8"
              stroke="var(--wb-green)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="wb-sync__drop-title">Drag and Drop your Files Here!</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="wb-sync__file-input"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={onInputChange}
        />
        <button
          type="button"
          className="wb-btn wb-btn--primary wb-sync__upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          or Upload Files <span aria-hidden>›</span>
        </button>
        <p className="wb-sync__hint">(PDF, DOC, up to {MAX_FILES} Files)</p>
      </div>

      <div className="wb-sync__files-block">
        <div className="wb-sync__chips-wrap">
          <ul className="wb-sync__chips" aria-label="Uploaded files">
            {files.map((name) => (
              <li key={name} className="wb-sync__chip">
                <span className="wb-sync__chip-icon" aria-hidden>
                  <svg viewBox="0 0 20 24" width="16" height="18" fill="none">
                    <path
                      d="M12 2H6a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V8l-6-6z"
                      fill="var(--wb-green)"
                      opacity="0.85"
                    />
                    <path d="M12 2v6h6" stroke="#fff" strokeWidth="1" strokeOpacity="0.35" />
                  </svg>
                </span>
                <span className="wb-sync__chip-name">{name}</span>
                <button
                  type="button"
                  className="wb-sync__chip-remove"
                  aria-label={`Remove ${name}`}
                  onClick={() => removeFile(name)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wb-sync__status">
        <span className="wb-sync__status-icon" aria-hidden>
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
            <circle cx="10" cy="10" r="9" stroke="var(--wb-green)" strokeWidth="2" />
            <path
              d="M6 10l3 3 5-6"
              stroke="var(--wb-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>
          {files.length} Document{files.length === 1 ? "" : "s"} Uploaded
        </span>
      </div>

      {uploadComplete ? (
        <div className="wb-sync__complete" role="status">
          <div className="wb-sync__complete-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 12l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="wb-sync__complete-body">
            <p className="wb-sync__complete-title">Upload complete</p>
            <p className="wb-sync__complete-text">
              Your {files.length} file{files.length === 1 ? "" : "s"} {files.length === 1 ? "is" : "are"}{" "}
              saved to your document library. You can open them anytime from{" "}
              <strong>Documents</strong> in the sidebar.
            </p>
            <Link to="/documents" className="wb-btn wb-btn--primary wb-sync__complete-cta">
              View uploaded documents <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="wb-privacy__footer wb-sync__actions-footer">
        <div className="wb-privacy__buttons">
          <button
            type="button"
            className="wb-btn wb-btn--primary"
            disabled={files.length === 0}
            onClick={() => {
              if (files.length > 0) saveUploadedDocuments(files);
              navigate("/onboarding/training");
            }}
          >
            Train my WorkBench <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
