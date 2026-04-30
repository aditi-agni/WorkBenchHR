import { useCallback, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { getCreateDocCategoryTitle, isCreateDocCategoryId } from "../data/createDocumentCategories";

function humanizeFileName(file: string): string {
  return file.replace(/\.pdf$/i, "").replace(/_/g, " ");
}

export function CreateDocumentDraftPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state: routeState } = useLocation() as {
    state?: {
      brief?: string;
      manualRole?: string;
      manualStart?: string;
      manualComp?: string;
    };
  };
  const file = params.get("file") ?? "";
  const category = params.get("category") ?? "";
  const methodParam = params.get("method") ?? "";
  const method = methodParam === "ai" || methodParam === "manual" ? methodParam : null;

  const [aiBrief, setAiBrief] = useState(() =>
    typeof routeState?.brief === "string" ? routeState.brief : "",
  );
  const [manualRole, setManualRole] = useState(() =>
    typeof routeState?.manualRole === "string" ? routeState.manualRole : "",
  );
  const [manualStart, setManualStart] = useState(() =>
    typeof routeState?.manualStart === "string" ? routeState.manualStart : "",
  );
  const [manualComp, setManualComp] = useState(() =>
    typeof routeState?.manualComp === "string" ? routeState.manualComp : "",
  );

  const validBase = file.length > 0 && isCreateDocCategoryId(category);
  const valid = validBase && method !== null;

  const categoryTitle = useMemo(
    () => (isCreateDocCategoryId(category) ? getCreateDocCategoryTitle(category) : ""),
    [category],
  );
  const templateLabel = useMemo(() => humanizeFileName(file), [file]);

  const methodHref = useMemo(
    () => `/create-document/method?${new URLSearchParams({ file, category }).toString()}`,
    [file, category],
  );

  const goAiPreview = useCallback(() => {
    navigate(`/create-document/ai-preview?${new URLSearchParams({ file, category }).toString()}`, {
      state: { brief: aiBrief },
    });
  }, [navigate, file, category, aiBrief]);

  const goManualPreview = useCallback(() => {
    navigate(`/create-document/manual-preview?${new URLSearchParams({ file, category }).toString()}`, {
      state: { manualRole, manualStart, manualComp },
    });
  }, [navigate, file, category, manualRole, manualStart, manualComp]);

  if (!validBase) {
    return <Navigate to="/create-document/template" replace />;
  }

  if (!method) {
    return <Navigate to={`/create-document/method?${new URLSearchParams({ file, category }).toString()}`} replace />;
  }

  const stepTitle = method === "ai" ? "Describe for AI" : "Fill template";
  const crumbs = (
    <nav className="wb-create-doc__crumbs" aria-label="Breadcrumb">
      <Link to="/create-document/template" className="wb-create-doc__crumb-link">
        Create Document
      </Link>
      <span className="wb-create-doc__crumb-sep" aria-hidden>
        {" "}
        &gt;{" "}
      </span>
      <Link to="/create-document/template" className="wb-create-doc__crumb-link">
        Select template
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
      <span className="wb-create-doc__crumb-current">{stepTitle}</span>
    </nav>
  );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-create-draft-page">
        <header className="wb-create-draft__intro">
          <span className="wb-create-draft__intro-accent" aria-hidden />
          <div className="wb-create-draft__intro-body">
            <p className="wb-create-draft__eyebrow">
              {method === "ai" ? "AI draft" : "Manual"}
              <span className="wb-create-draft__eyebrow-sep" aria-hidden>
                ·
              </span>
              <span className="wb-create-draft__file">{templateLabel}</span>
            </p>
            {method === "ai" ? (
              <>
                <h1 className="wb-create-draft__title">Describe the role and situation</h1>
                <p className="wb-create-draft__lede">
                  We&apos;ll use this to draft <strong>{templateLabel}</strong> for you. Add titles, dates,
                  compensation notes, or anything else that should appear in the letter.
                </p>
              </>
            ) : (
              <>
                <h1 className="wb-create-draft__title">Fill in the template</h1>
                <p className="wb-create-draft__lede">
                  Enter the key details for <strong>{templateLabel}</strong>. You can refine wording later in
                  your library.
                </p>
              </>
            )}
          </div>
        </header>

        {method === "ai" ? (
          <div className="wb-create-draft__sheet">
            <label className="wb-create-draft__label" htmlFor="create-draft-ai-brief">
              Your brief
            </label>
            <textarea
              id="create-draft-ai-brief"
              className="wb-create-draft__textarea wb-create-draft__textarea--in-sheet"
              rows={8}
              value={aiBrief}
              onChange={(e) => setAiBrief(e.target.value)}
              placeholder="Example: Summer intern offer for our Chicago location, $22/hr, start June 9, reports to Head Chef…"
            />
            <div className="wb-create-draft__actions">
              <Link to={methodHref} className="wb-btn wb-btn--muted wb-create-draft__back">
                ← Back
              </Link>
              <button type="button" className="wb-btn wb-btn--primary" onClick={goAiPreview}>
                Generate draft
              </button>
            </div>
          </div>
        ) : (
          <div className="wb-create-draft__sheet">
            <div className="wb-create-draft__fields">
              <label className="wb-create-draft__label" htmlFor="create-draft-role">
                Role / program title
              </label>
              <input
                id="create-draft-role"
                className="wb-create-draft__input"
                value={manualRole}
                onChange={(e) => setManualRole(e.target.value)}
                placeholder="e.g. Summer intern — culinary"
              />
              <label className="wb-create-draft__label" htmlFor="create-draft-start">
                Start date
              </label>
              <input
                id="create-draft-start"
                className="wb-create-draft__input"
                type="date"
                value={manualStart}
                onChange={(e) => setManualStart(e.target.value)}
              />
              <label className="wb-create-draft__label" htmlFor="create-draft-comp">
                Compensation (summary)
              </label>
              <input
                id="create-draft-comp"
                className="wb-create-draft__input"
                value={manualComp}
                onChange={(e) => setManualComp(e.target.value)}
                placeholder="e.g. $22/hr, paid biweekly"
              />
            </div>
            <div className="wb-create-draft__actions">
              <Link to={methodHref} className="wb-btn wb-btn--muted wb-create-draft__back">
                ← Back
              </Link>
              <button type="button" className="wb-btn wb-btn--primary" onClick={goManualPreview}>
                Review final draft
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
