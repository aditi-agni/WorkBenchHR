import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { CREATE_DOC_CATEGORIES } from "../data/createDocumentCategories";
import { getUploadedDocuments, saveUploadedDocuments } from "../lib/documentLibrary";

type DocCategory = "All" | "Policy" | "Template" | "Form" | "Compliance" | "General";
type DocStatus = "Indexed" | "Synced" | "Draft";

type DocRow = {
  id: string;
  name: string;
  fileType: string;
  category: Exclude<DocCategory, "All">;
  updated: string;
  status: DocStatus;
  fromUpload: boolean;
};

const SAMPLE_DOCS: Omit<DocRow, "id" | "fromUpload">[] = [
  {
    name: "Employee_Handbook_2025.pdf",
    fileType: "PDF",
    category: "Policy",
    updated: "Apr 2, 2026",
    status: "Indexed",
  },
  {
    name: "Offer_Letter_Template.docx",
    fileType: "Word",
    category: "Template",
    updated: "Mar 28, 2026",
    status: "Indexed",
  },
  {
    name: "I-9_Verification_Checklist.pdf",
    fileType: "PDF",
    category: "Compliance",
    updated: "Mar 22, 2026",
    status: "Indexed",
  },
  {
    name: "PTO_and_Leave_Policy.pdf",
    fileType: "PDF",
    category: "Policy",
    updated: "Mar 18, 2026",
    status: "Indexed",
  },
  {
    name: "Incident_Report_Form.docx",
    fileType: "Word",
    category: "Form",
    updated: "Mar 10, 2026",
    status: "Indexed",
  },
  {
    name: "Anti-Harassment_Training_Deck.pptx",
    fileType: "Slides",
    category: "Compliance",
    updated: "Mar 4, 2026",
    status: "Indexed",
  },
  {
    name: "Workplace_Safety_Brief.pdf",
    fileType: "PDF",
    category: "General",
    updated: "Feb 26, 2026",
    status: "Indexed",
  },
];

const SUGGESTIONS = [
  {
    id: "sg1",
    title: "Generate a 90-day review packet",
    body: "You have role descriptions and PTO rules indexed — Workbench can draft manager talking points and a checklist.",
    action: "Generate draft",
    tone: "mint",
  },
  {
    id: "sg2",
    title: "Upload your state labor poster (2026)",
    body: "Compliance scans show no current poster on file for your primary location.",
    action: "Mark as needed",
    tone: "mint",
  },
  {
    id: "sg3",
    title: "Create an onboarding day-one agenda",
    body: "Handbook and workplace safety brief are indexed; we can assemble a day-one schedule template.",
    action: "Start template",
    tone: "mint",
  },
] as const;

function uid() {
  return `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function fileTypeFromName(name: string): string {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
  if (ext === "pdf") return "PDF";
  if (ext === "doc" || ext === "docx") return "Word";
  if (ext === "pptx") return "Slides";
  return ext ? ext.toUpperCase() : "File";
}

function buildInitialRows(): DocRow[] {
  const uploads = getUploadedDocuments();
  const uploadNames = new Set(uploads);
  const rows: DocRow[] = [];

  for (const s of SAMPLE_DOCS) {
    if (uploadNames.has(s.name)) continue;
    rows.push({ ...s, id: uid(), fromUpload: false });
  }
  for (const name of uploads) {
    rows.push({
      id: uid(),
      name,
      fileType: fileTypeFromName(name),
      category: "General",
      updated: "Recently",
      status: "Synced",
      fromUpload: true,
    });
  }
  return rows;
}

function persistUploads(rows: DocRow[]) {
  saveUploadedDocuments(rows.filter((r) => r.fromUpload).map((r) => r.name));
}

type DocumentsLocationState = {
  justAddedToLibrary?: boolean;
  templateFile?: string;
  templateCategory?: string;
};

function libraryCategoryFromCreateId(createId: string): Exclude<DocCategory, "All"> {
  const row = CREATE_DOC_CATEGORIES.find((c) => c.id === createId);
  const tag = row?.tags[0];
  if (tag === "Policy" || tag === "Template" || tag === "Form" || tag === "Compliance" || tag === "General") {
    return tag;
  }
  return "General";
}

export function DocumentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rows, setRows] = useState<DocRow[]>(() => buildInitialRows());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DocCategory>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [addBanner, setAddBanner] = useState<string | null>(null);
  const lastLibraryAddKey = useRef<string>("");

  useEffect(() => {
    const raw = location.state as DocumentsLocationState | null | undefined;
    if (!raw?.justAddedToLibrary || typeof raw.templateFile !== "string") return;

    const templateFile = raw.templateFile;
    const templateCategory = typeof raw.templateCategory === "string" ? raw.templateCategory : "";
    const dedupeKey = `${templateFile}|${templateCategory}|add`;
    if (lastLibraryAddKey.current === dedupeKey) return;
    lastLibraryAddKey.current = dedupeKey;

    navigate(location.pathname, { replace: true, state: {} });

    let nextHighlightId: string | null = null;
    setRows((prev) => {
      const existing = prev.find((r) => r.name === templateFile);
      if (existing) {
        nextHighlightId = existing.id;
        return prev;
      }
      const id = uid();
      nextHighlightId = id;
      const newRow: DocRow = {
        id,
        name: templateFile,
        fileType: fileTypeFromName(templateFile),
        category: libraryCategoryFromCreateId(templateCategory),
        updated: "Just now",
        status: "Draft",
        fromUpload: false,
      };
      return [newRow, ...prev];
    });

    setHighlightedRowId(nextHighlightId);
    setAddBanner(`${templateFile} was added to your library.`);
    setQuery("");
    setCategory("All");
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!highlightedRowId) return;
    const t = window.setTimeout(() => {
      setHighlightedRowId(null);
      lastLibraryAddKey.current = "";
    }, 8000);
    return () => window.clearTimeout(t);
  }, [highlightedRowId]);

  useEffect(() => {
    if (!highlightedRowId) return;
    const el = document.querySelector<HTMLElement>(`[data-doc-row="${highlightedRowId}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlightedRowId, rows]);

  useEffect(() => {
    if (!addBanner) return;
    const t = window.setTimeout(() => {
      setAddBanner(null);
      lastLibraryAddKey.current = "";
    }, 10000);
    return () => window.clearTimeout(t);
  }, [addBanner]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const catOk = category === "All" || r.category === category;
      const qOk = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [rows, query, category]);

  const metrics = useMemo(() => {
    const n = rows.length;
    const policies = rows.filter((r) => r.category === "Policy").length;
    return { n, policies };
  }, [rows]);

  const startEdit = useCallback((r: DocRow) => {
    setEditingId(r.id);
    setEditValue(r.name);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingId) return;
    const name = editValue.trim();
    if (!name) return;
    setRows((prev) => {
      const next = prev.map((r) => (r.id === editingId ? { ...r, name } : r));
      persistUploads(next);
      return next;
    });
    cancelEdit();
  }, [editingId, editValue, cancelEdit]);

  const removeRow = useCallback((id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (!window.confirm(`Remove “${row.name}” from your library?`)) return;
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistUploads(next);
      return next;
    });
  }, [rows]);

  const addDraftFromSuggestion = useCallback((title: string) => {
    const base = title.replace(/\s+/g, "_").slice(0, 40);
    const draft: DocRow = {
      id: uid(),
      name: `${base}_DRAFT.docx`,
      fileType: "Word",
      category: "Template",
      updated: "Just now",
      status: "Draft",
      fromUpload: false,
    };
    setRows((prev) => [draft, ...prev]);
  }, []);

  const categories: DocCategory[] = ["All", "Policy", "Template", "Form", "Compliance", "General"];

  return (
    <>
      <WorkspaceHeader title="Documents" />

      <div className="wb-docs-page">
        <section className="wb-docs-pulse" aria-labelledby="docs-pulse-heading">
          <div className="wb-docs-pulse__grid">
            <div className="wb-docs-pulse__main">
              <p className="wb-docs-pulse__eyebrow">Company intelligence</p>
              <h2 className="wb-docs-pulse__title" id="docs-pulse-heading">
                eatunique
              </h2>
              <p className="wb-docs-pulse__lede">
                Workbench has indexed <strong>{metrics.n} documents</strong> and extracted themes around{" "}
                <strong>people policies</strong>, <strong>time away</strong>, <strong>workplace conduct</strong>,
                and <strong>hiring compliance</strong>. Tone reads clear and practical — useful for offer
                letters, manager notes, and onboarding.
              </p>
              <ul className="wb-docs-pulse__tags" aria-label="Detected themes">
                <li>Handbook &amp; policies</li>
                <li>PTO &amp; leave</li>
                <li>Harassment prevention</li>
                <li>I-9 &amp; work authorization</li>
              </ul>
            </div>
            <aside className="wb-docs-pulse__stats" aria-label="Summary stats">
              <div className="wb-docs-pulse__stat">
                <span className="wb-docs-pulse__stat-value">{metrics.n}</span>
                <span className="wb-docs-pulse__stat-label">In library</span>
              </div>
              <div className="wb-docs-pulse__stat">
                <span className="wb-docs-pulse__stat-value">{metrics.policies}</span>
                <span className="wb-docs-pulse__stat-label">Policy PDFs</span>
              </div>
              <div className="wb-docs-pulse__stat">
                <span className="wb-docs-pulse__stat-value">94%</span>
                <span className="wb-docs-pulse__stat-label">Parse confidence</span>
              </div>
            </aside>
          </div>
        </section>

        <div className="wb-docs-toolbar">
          <label className="wb-docs-search">
            <span className="wb-docs-search__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  opacity="0.45"
                />
              </svg>
            </span>
            <input
              type="search"
              className="wb-docs-search__input"
              placeholder="Search by name or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search documents"
            />
          </label>
          <div className="wb-docs-filters" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`wb-docs-filter${category === c ? " wb-docs-filter--active" : ""}`}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <section className="wb-docs-library" aria-labelledby="docs-library-heading">
          <div className="wb-docs-library__head">
            <h2 className="wb-docs-library__title" id="docs-library-heading">
              Document library
            </h2>
            <Link to="/onboarding/learning" className="wb-docs-library__link">
              + Add from DNA sync
            </Link>
          </div>

          {addBanner ? (
            <div className="wb-docs-add-banner" role="status" aria-live="polite">
              <span className="wb-docs-add-banner__text">{addBanner}</span>
              <button
                type="button"
                className="wb-docs-add-banner__dismiss"
                aria-label="Dismiss notification"
                onClick={() => {
                  setAddBanner(null);
                  lastLibraryAddKey.current = "";
                }}
              >
                ×
              </button>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="wb-docs-empty">
              <p className="wb-docs-empty__title">No matches</p>
              <p className="wb-docs-empty__body">Try another search or clear filters.</p>
              <button type="button" className="wb-btn wb-btn--muted" onClick={() => { setQuery(""); setCategory("All"); }}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="wb-docs-table-wrap">
              <table className="wb-docs-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Category</th>
                    <th scope="col">Updated</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="wb-docs-table__th-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      data-doc-row={r.id}
                      className={highlightedRowId === r.id ? "wb-docs-table__tr--added" : undefined}
                    >
                      <td className="wb-docs-table__cell-name">
                        <div className="wb-docs-table__name-inner">
                          <span className="wb-docs-table__file-ic" aria-hidden>
                            <svg viewBox="0 0 24 28" width="20" height="22" fill="none">
                              <path
                                d="M14 2H8a2 2 0 00-2 2v18a2 2 0 002 2h10a2 2 0 002-2V8l-6-6z"
                                fill="var(--wb-green)"
                                opacity="0.88"
                              />
                              <path d="M14 2v6h6" stroke="#fff" strokeWidth="1" strokeOpacity="0.35" />
                            </svg>
                          </span>
                          {editingId === r.id ? (
                            <span className="wb-docs-table__edit-wrap">
                              <input
                                className="wb-docs-table__edit-input"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                aria-label="Edit file name"
                              />
                              <button type="button" className="wb-docs-table__icon-btn" onClick={saveEdit} aria-label="Save name">
                                ✓
                              </button>
                              <button type="button" className="wb-docs-table__icon-btn" onClick={cancelEdit} aria-label="Cancel edit">
                                ✕
                              </button>
                            </span>
                          ) : (
                            <span className="wb-docs-table__name" title={r.name}>
                              {r.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{r.fileType}</td>
                      <td>
                        <span className="wb-docs-table__pill">{r.category}</span>
                      </td>
                      <td>{r.updated}</td>
                      <td>
                        <span
                          className={`wb-docs-table__status wb-docs-table__status--${r.status === "Draft" ? "draft" : r.status === "Synced" ? "synced" : "indexed"}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="wb-docs-table__actions">
                        {editingId === r.id ? null : (
                          <>
                            <button type="button" className="wb-docs-table__action" onClick={() => startEdit(r)}>
                              Edit
                            </button>
                            <button type="button" className="wb-docs-table__action wb-docs-table__action--danger" onClick={() => removeRow(r.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="wb-docs-suggest" aria-labelledby="docs-suggest-heading">
          <div className="wb-docs-suggest__head">
            <h2 className="wb-docs-suggest__title" id="docs-suggest-heading">
              Suggested next steps
            </h2>
            <p className="wb-docs-suggest__sub">
              Based on what&apos;s already in your library — actions are placeholders for this proof of
              concept.
            </p>
          </div>
          <ul className="wb-docs-suggest__grid">
            {SUGGESTIONS.map((s) => (
              <li key={s.id} className={`wb-docs-suggest-card wb-docs-suggest-card--${s.tone}`}>
                <h3 className="wb-docs-suggest-card__title">{s.title}</h3>
                <p className="wb-docs-suggest-card__body">{s.body}</p>
                <button
                  type="button"
                  className="wb-docs-suggest-card__btn"
                  onClick={() => addDraftFromSuggestion(s.title)}
                >
                  {s.action}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
