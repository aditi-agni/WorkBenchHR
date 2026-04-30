import { useCallback, useMemo } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { getCreateDocCategoryTitle, isCreateDocCategoryId } from "../data/createDocumentCategories";

const HOW_TO_CREATE_ICON_AI = `/create-document/${encodeURIComponent("HT 1.png")}`;
const HOW_TO_CREATE_ICON_MANUAL = `/create-document/${encodeURIComponent("HT 2.png")}`;

function humanizeFileName(file: string): string {
  return file.replace(/\.pdf$/i, "").replace(/_/g, " ");
}

function MethodCardIcon({ src, variant }: { src: string; variant: "ai" | "manual" }) {
  return (
    <span className={`wb-create-method__card-icon wb-create-method__card-icon--${variant}`} aria-hidden>
      <img src={src} alt="" width={28} height={28} decoding="async" className="wb-create-method__card-icon-img" />
    </span>
  );
}

export function CreateDocumentMethodPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const file = params.get("file") ?? "";
  const category = params.get("category") ?? "";

  const valid = file.length > 0 && isCreateDocCategoryId(category);
  const categoryTitle = useMemo(
    () => (isCreateDocCategoryId(category) ? getCreateDocCategoryTitle(category) : ""),
    [category],
  );
  const templateLabel = useMemo(() => humanizeFileName(file), [file]);

  const chooseAi = useCallback(() => {
    const q = new URLSearchParams({ file, category, method: "ai" });
    navigate(`/create-document/draft?${q.toString()}`);
  }, [navigate, file, category]);

  const chooseManual = useCallback(() => {
    const q = new URLSearchParams({ file, category, method: "manual" });
    navigate(`/create-document/draft?${q.toString()}`);
  }, [navigate, file, category]);

  if (!valid) {
    return <Navigate to="/create-document/template" replace />;
  }

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
      <span className="wb-create-doc__crumb-current">How to create</span>
    </nav>
  );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-create-method">
        <h1 className="wb-create-method__title">How would you like to create this?</h1>
        <p className="wb-create-method__sub">
          You chose <strong>{templateLabel}</strong> ({categoryTitle}). Pick how you want to fill it in.
        </p>

        <div className="wb-create-method__options" role="group" aria-label="Creation method">
          <button type="button" className="wb-create-method__card wb-create-method__card--ai" onClick={chooseAi}>
            <div className="wb-create-method__card-top">
              <MethodCardIcon src={HOW_TO_CREATE_ICON_AI} variant="ai" />
              <div className="wb-create-method__card-head">
                <span className="wb-create-method__card-title">Use AI to Generate Content</span>
                <span className="wb-create-method__badge">Recommended</span>
              </div>
              <span className="wb-create-method__chevron" aria-hidden>
                ›
              </span>
            </div>
            <p className="wb-create-method__card-desc">
              Describe the role and situation. AI drafts the full document — you review and tweak before sending.
            </p>
          </button>

          <button type="button" className="wb-create-method__card wb-create-method__card--manual" onClick={chooseManual}>
            <div className="wb-create-method__card-top">
              <MethodCardIcon src={HOW_TO_CREATE_ICON_MANUAL} variant="manual" />
              <div className="wb-create-method__card-head">
                <span className="wb-create-method__card-title">Fill Template Manually</span>
              </div>
              <span className="wb-create-method__chevron" aria-hidden>
                ›
              </span>
            </div>
            <p className="wb-create-method__card-desc">
              Use the standard template and fill in each field yourself. Best if you already know exactly what to say.
            </p>
          </button>
        </div>

        <div className="wb-create-method__footer">
          <Link
            to={`/create-document/templates/${category}`}
            className="wb-btn wb-btn--muted wb-create-method__back"
          >
            ← Back
          </Link>
        </div>
      </div>
    </>
  );
}
