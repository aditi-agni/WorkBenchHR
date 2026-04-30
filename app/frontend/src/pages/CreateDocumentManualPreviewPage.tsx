import { useCallback, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IconDownload, IconEditFile, IconShare } from "../components/DocumentPreviewDocToolIcons";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { getCreateDocCategoryTitle, isCreateDocCategoryId } from "../data/createDocumentCategories";
import { downloadTextAsPdf } from "../lib/downloadDraftPdf";

function humanizeFileName(file: string): string {
  return file.replace(/\.pdf$/i, "").replace(/_/g, " ");
}

function formatStartDate(iso: string): string {
  const t = iso.trim();
  if (!t) return "—";
  const d = new Date(t.length === 10 ? `${t}T12:00:00` : t);
  if (Number.isNaN(d.getTime())) return t;
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

type ManualPreviewLocationState = {
  manualRole: string;
  manualStart: string;
  manualComp: string;
  /** Full letter text when user edited the document in document-edit */
  documentBody?: string;
};

function isManualPreviewState(s: unknown): s is ManualPreviewLocationState {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.manualRole === "string" &&
    typeof o.manualStart === "string" &&
    typeof o.manualComp === "string"
  );
}

export function CreateDocumentManualPreviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [shareHint, setShareHint] = useState<string | null>(null);
  const { state } = useLocation() as { state?: unknown };
  const file = params.get("file") ?? "";
  const category = params.get("category") ?? "";

  const valid = file.length > 0 && isCreateDocCategoryId(category);
  const previewState = isManualPreviewState(state) ? state : null;

  const categoryTitle = useMemo(
    () => (isCreateDocCategoryId(category) ? getCreateDocCategoryTitle(category) : ""),
    [category],
  );
  const templateLabel = useMemo(() => humanizeFileName(file), [file]);

  const methodHref = useMemo(
    () => `/create-document/method?${new URLSearchParams({ file, category }).toString()}`,
    [file, category],
  );

  const draftManualHref = useMemo(
    () => `/create-document/draft?${new URLSearchParams({ file, category, method: "manual" }).toString()}`,
    [file, category],
  );

  const documentEditManualHref = useMemo(
    () => `/create-document/document-edit?${new URLSearchParams({ file, category, source: "manual" }).toString()}`,
    [file, category],
  );

  const backFormState = useMemo(
    () =>
      previewState
        ? {
            manualRole: previewState.manualRole,
            manualStart: previewState.manualStart,
            manualComp: previewState.manualComp,
          }
        : { manualRole: "", manualStart: "", manualComp: "" },
    [previewState],
  );

  const displayRole = previewState?.manualRole.trim() || "—";
  const displayStart = formatStartDate(previewState?.manualStart ?? "");
  const displayComp = previewState?.manualComp.trim() || "—";

  const addToLibrary = useCallback(() => {
    if (!previewState) return;
    navigate("/documents", {
      state: {
        createMethod: "manual",
        templateFile: file,
        templateCategory: category,
        manualRole: previewState.manualRole.trim() || undefined,
        manualStart: previewState.manualStart.trim() || undefined,
        manualComp: previewState.manualComp.trim() || undefined,
        manualPreviewAcknowledged: true,
        justAddedToLibrary: true,
      },
    });
  }, [navigate, file, category, previewState]);

  const plainTextDraft = useMemo(() => {
    if (previewState?.documentBody != null && previewState.documentBody.trim().length > 0) {
      return previewState.documentBody;
    }
    const meta = `PDF preview · ${categoryTitle}${file.toLowerCase().endsWith(".pdf") ? ` · ${file}` : ""}`;
    return [
      templateLabel,
      meta,
      "",
      "— Your template fields —",
      `Role / program: ${displayRole}`,
      `Start date: ${displayStart}`,
      `Compensation: ${displayComp}`,
      "",
      "Dear Candidate,",
      "",
      `We are pleased to extend an offer for the position of ${displayRole}, as outlined in your packet for ${templateLabel}. This letter summarizes role scope, schedule expectations, and compensation for your program.`,
      "",
      `Your anticipated start date is ${displayStart}, subject to successful completion of onboarding, background screening, and work authorization verification. Your primary work location will be our flagship site unless otherwise assigned with advance notice.`,
      "",
      `Compensation and pay practices: ${displayComp}. Additional benefits and policies are described in the employee handbook attached to this offer.`,
      "",
      "This offer is contingent upon satisfactory reference checks and your agreement to the confidentiality and intellectual property terms in the enclosed documents.",
      "",
      "Please sign and return this letter to confirm your acceptance. We are excited about the perspective you would bring to the team.",
      "",
      "Sincerely,",
      "People Operations — eatunique",
    ].join("\n");
  }, [previewState?.documentBody, templateLabel, categoryTitle, file, displayRole, displayStart, displayComp]);

  const editFileNavState = useMemo(() => {
    if (!previewState) {
      return { manualRole: "", manualStart: "", manualComp: "", documentBody: "" };
    }
    return {
      manualRole: previewState.manualRole,
      manualStart: previewState.manualStart,
      manualComp: previewState.manualComp,
      documentBody: plainTextDraft,
    };
  }, [previewState, plainTextDraft]);

  const useCustomDocumentBody = Boolean(previewState?.documentBody?.trim());

  const downloadDraftFile = useCallback(() => {
    void downloadTextAsPdf({
      file,
      templateLabel,
      titleLine: templateLabel,
      body: plainTextDraft,
    });
  }, [plainTextDraft, file, templateLabel]);

  const shareDraft = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${templateLabel} — manual draft preview`;
    let message = "Link copied.";
    try {
      if (navigator.share) {
        await navigator.share({ title, text: "Manual draft preview", url });
        message = "Shared.";
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        return;
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
        else return;
      } catch {
        return;
      }
    }
    setShareHint(message);
    window.setTimeout(() => setShareHint(null), 2200);
  }, [templateLabel]);

  if (!valid) {
    return <Navigate to="/create-document/template" replace />;
  }

  if (!previewState) {
    return <Navigate to={draftManualHref} replace />;
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
      <Link to={methodHref} className="wb-create-doc__crumb-link">
        How to create
      </Link>
      <span className="wb-create-doc__crumb-sep" aria-hidden>
        {" "}
        &gt;{" "}
      </span>
      <Link to={draftManualHref} className="wb-create-doc__crumb-link" state={backFormState}>
        Fill template
      </Link>
      <span className="wb-create-doc__crumb-sep" aria-hidden>
        {" "}
        &gt;{" "}
      </span>
      <span className="wb-create-doc__crumb-current">Review draft</span>
    </nav>
  );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-create-draft-page wb-create-draft-page--ai-preview">
        <header className="wb-create-draft__intro">
          <span className="wb-create-draft__intro-accent" aria-hidden />
          <div className="wb-create-draft__intro-body">
            <p className="wb-create-draft__eyebrow">Manual · {templateLabel}</p>
            <h1 className="wb-create-draft__title">Review your document</h1>
            <p className="wb-create-draft__lede">
              {useCustomDocumentBody
                ? "You&apos;re viewing your edited letter text. Download or share this version, or return to the form to change the structured fields."
                : "Highlights show the details you entered. Go back to adjust fields, or add this version to your library when you&apos;re satisfied."}
            </p>
          </div>
        </header>

        <div className="wb-ai-preview__doc-wrap wb-manual-preview__doc-wrap">
          <article className="wb-ai-preview__doc" aria-labelledby="manual-preview-doc-title">
            <div className="wb-ai-preview__doc-head">
              <h2 className="wb-ai-preview__doc-title" id="manual-preview-doc-title">
                {templateLabel}
              </h2>
              <p className="wb-ai-preview__doc-meta">
                PDF preview · {categoryTitle}
                {file.toLowerCase().endsWith(".pdf") ? ` · ${file}` : null}
              </p>
            </div>
            {!useCustomDocumentBody ? (
              <p className="wb-manual-preview__legend" role="note">
                <span className="wb-manual-preview__legend-swatch" aria-hidden />
                Green highlights match your template fields.
              </p>
            ) : (
              <p className="wb-manual-preview__legend wb-manual-preview__legend--plain" role="note">
                Edited letter — highlights are hidden while you use custom text.
              </p>
            )}
            {useCustomDocumentBody ? (
              <div className="wb-ai-preview__body wb-manual-preview__body">
                {(previewState?.documentBody ?? "").split("\n").map((line, i) =>
                  line === "" ? (
                    <div key={i} className="wb-ai-preview__spacer" aria-hidden />
                  ) : (
                    <p key={i} className="wb-ai-preview__para">
                      {line}
                    </p>
                  ),
                )}
              </div>
            ) : (
              <div className="wb-ai-preview__body wb-manual-preview__body">
                <p className="wb-ai-preview__para">Dear Candidate,</p>
                <div className="wb-ai-preview__spacer" aria-hidden />
                <p className="wb-ai-preview__para">
                  We are pleased to extend an offer for the position of{" "}
                  <mark className="wb-manual-preview__hl">{displayRole}</mark>, as outlined in your packet for{" "}
                  <strong>{templateLabel}</strong>. This letter summarizes role scope, schedule expectations, and
                  compensation for your program.
                </p>
                <div className="wb-ai-preview__spacer" aria-hidden />
                <p className="wb-ai-preview__para">
                  Your anticipated start date is <mark className="wb-manual-preview__hl">{displayStart}</mark>,
                  subject to successful completion of onboarding, background screening, and work authorization
                  verification. Your primary work location will be our flagship site unless otherwise assigned
                  with advance notice.
                </p>
                <div className="wb-ai-preview__spacer" aria-hidden />
                <p className="wb-ai-preview__para">
                  Compensation and pay practices: <mark className="wb-manual-preview__hl">{displayComp}</mark>.
                  Additional benefits and policies are described in the employee handbook attached to this
                  offer.
                </p>
                <div className="wb-ai-preview__spacer" aria-hidden />
                <p className="wb-ai-preview__para">
                  This offer is contingent upon satisfactory reference checks and your agreement to the
                  confidentiality and intellectual property terms in the enclosed documents.
                </p>
                <div className="wb-ai-preview__spacer" aria-hidden />
                <p className="wb-ai-preview__para">
                  Please sign and return this letter to confirm your acceptance. We are excited about the
                  perspective you would bring to the team.
                </p>
                <div className="wb-ai-preview__spacer" aria-hidden />
                <p className="wb-ai-preview__para">Sincerely,</p>
                <p className="wb-ai-preview__para">People Operations — eatunique</p>
              </div>
            )}
          </article>

          <aside className="wb-ai-preview__doc-tools" aria-label="Document actions">
            <p className="wb-ai-preview__tools-label">Before adding to library</p>
            <button type="button" className="wb-ai-preview__tool" onClick={downloadDraftFile}>
              <IconDownload />
              <span className="wb-ai-preview__tool-text">Download file</span>
            </button>
            <Link to={documentEditManualHref} className="wb-ai-preview__tool" state={editFileNavState}>
              <IconEditFile />
              <span className="wb-ai-preview__tool-text">Edit file</span>
            </Link>
            <button type="button" className="wb-ai-preview__tool" onClick={shareDraft}>
              <IconShare />
              <span className="wb-ai-preview__tool-text">Share file</span>
            </button>
            {shareHint ? (
              <p className="wb-ai-preview__tools-hint" role="status" aria-live="polite">
                {shareHint}
              </p>
            ) : null}
          </aside>
        </div>

        <div className="wb-create-draft__actions wb-ai-preview__actions">
          <Link to={draftManualHref} className="wb-btn wb-btn--muted wb-create-draft__back" state={backFormState}>
            ← Back to form
          </Link>
          <button type="button" className="wb-btn wb-btn--primary" onClick={addToLibrary}>
            Add to library
          </button>
        </div>
      </div>
    </>
  );
}
