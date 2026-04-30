import { useCallback, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { getCreateDocCategoryTitle, isCreateDocCategoryId } from "../data/createDocumentCategories";

function humanizeFileName(file: string): string {
  return file.replace(/\.pdf$/i, "").replace(/_/g, " ");
}

type Source = "ai" | "manual";

function parseSource(raw: string | null): Source | null {
  if (raw === "ai" || raw === "manual") return raw;
  return null;
}

function hasAiEditState(s: unknown): s is { brief?: string; documentBody: string } {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return typeof o.documentBody === "string";
}

type ManualFields = { manualRole: string; manualStart: string; manualComp: string };

function hasManualEditState(s: unknown): s is ManualFields & { documentBody: string } {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.manualRole === "string" &&
    typeof o.manualStart === "string" &&
    typeof o.manualComp === "string" &&
    typeof o.documentBody === "string"
  );
}

export function CreateDocumentDocumentEditPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: unknown };
  const file = params.get("file") ?? "";
  const category = params.get("category") ?? "";
  const source = parseSource(params.get("source"));

  const valid = file.length > 0 && isCreateDocCategoryId(category) && source !== null;

  const categoryTitle = useMemo(
    () => (isCreateDocCategoryId(category) ? getCreateDocCategoryTitle(category) : ""),
    [category],
  );
  const templateLabel = useMemo(() => humanizeFileName(file), [file]);

  const initialBody = useMemo(() => {
    if (hasAiEditState(state)) return state.documentBody;
    if (hasManualEditState(state)) return state.documentBody;
    return "";
  }, [state]);

  const [body, setBody] = useState(initialBody);

  const previewAiHref = useMemo(
    () => `/create-document/ai-preview?${new URLSearchParams({ file, category }).toString()}`,
    [file, category],
  );
  const previewManualHref = useMemo(
    () => `/create-document/manual-preview?${new URLSearchParams({ file, category }).toString()}`,
    [file, category],
  );

  const draftAiHref = useMemo(
    () => `/create-document/draft?${new URLSearchParams({ file, category, method: "ai" }).toString()}`,
    [file, category],
  );
  const draftManualHref = useMemo(
    () => `/create-document/draft?${new URLSearchParams({ file, category, method: "manual" }).toString()}`,
    [file, category],
  );

  const methodHref = useMemo(
    () => `/create-document/method?${new URLSearchParams({ file, category }).toString()}`,
    [file, category],
  );

  const save = useCallback(() => {
    if (source === "ai" && hasAiEditState(state)) {
      navigate(previewAiHref, {
        state: { brief: state.brief ?? "", documentBody: body },
      });
      return;
    }
    if (source === "manual" && hasManualEditState(state)) {
      navigate(previewManualHref, {
        state: {
          manualRole: state.manualRole,
          manualStart: state.manualStart,
          manualComp: state.manualComp,
          documentBody: body,
        },
      });
    }
  }, [source, state, body, navigate, previewAiHref, previewManualHref]);

  if (!valid) {
    return <Navigate to="/create-document/template" replace />;
  }

  if (source === "ai" && !hasAiEditState(state)) {
    return <Navigate to={draftAiHref} replace />;
  }

  if (source === "manual" && !hasManualEditState(state)) {
    return <Navigate to={draftManualHref} replace />;
  }

  const crumbs =
    source === "ai" ? (
      <nav className="wb-create-doc__crumbs" aria-label="Breadcrumb">
        <Link to="/create-document/template" className="wb-create-doc__crumb-link">
          Create Document
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={`/create-document/templates/${category}`} className="wb-create-doc__crumb-link">
          {categoryTitle}
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={methodHref} className="wb-create-doc__crumb-link">
          How to create
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={draftAiHref} className="wb-create-doc__crumb-link">
          Describe for AI
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={previewAiHref} className="wb-create-doc__crumb-link" state={state}>
          AI preview
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <span className="wb-create-doc__crumb-current">Edit document</span>
      </nav>
    ) : (
      <nav className="wb-create-doc__crumbs" aria-label="Breadcrumb">
        <Link to="/create-document/template" className="wb-create-doc__crumb-link">
          Create Document
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={`/create-document/templates/${category}`} className="wb-create-doc__crumb-link">
          {categoryTitle}
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={methodHref} className="wb-create-doc__crumb-link">
          How to create
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={draftManualHref} className="wb-create-doc__crumb-link" state={state}>
          Fill template
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <Link to={previewManualHref} className="wb-create-doc__crumb-link" state={state}>
          Review draft
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <span className="wb-create-doc__crumb-current">Edit document</span>
      </nav>
    );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-create-draft-page wb-create-draft-page--ai-preview">
        <header className="wb-create-draft__intro">
          <span className="wb-create-draft__intro-accent" aria-hidden />
          <div className="wb-create-draft__intro-body">
            <p className="wb-create-draft__eyebrow">{source === "ai" ? "AI draft" : "Manual"} · {templateLabel}</p>
            <h1 className="wb-create-draft__title">Edit document text</h1>
            <p className="wb-create-draft__lede">
              Change any wording below. Blank lines create space between paragraphs in the preview and PDF
              download. When you&apos;re done, save to return to the preview.
            </p>
          </div>
        </header>

        <div className="wb-create-draft__sheet">
          <label className="wb-create-draft__label" htmlFor="document-edit-body">
            Full document
          </label>
          <textarea
            id="document-edit-body"
            className="wb-create-draft__textarea wb-create-draft__textarea--in-sheet"
            rows={22}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck
          />
          <div className="wb-create-draft__actions">
            <button type="button" className="wb-btn wb-btn--muted wb-create-draft__back" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="button" className="wb-btn wb-btn--primary" onClick={save}>
              Save preview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
