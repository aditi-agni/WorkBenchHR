import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import {
  CREATE_DOC_TEMPLATE_SECTIONS,
  type CreateDocTemplateFile,
  getCreateDocCategoryTitle,
  isCreateDocCategoryId,
} from "../data/createDocumentCategories";
import { docPagePreviewDataUri } from "../lib/pdfPreviewPlaceholder";

function PreviewLightbox({
  open,
  fileName,
  pageCount,
  onClose,
}: {
  open: boolean;
  fileName: string | null;
  pageCount: number;
  onClose: () => void;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const total = Math.max(1, pageCount);

  useEffect(() => {
    if (open && fileName) setPageIndex(0);
  }, [open, fileName]);

  const src = useMemo(() => {
    if (!fileName) return null;
    return docPagePreviewDataUri(fileName, pageIndex, total);
  }, [fileName, pageIndex, total]);

  const goPrev = useCallback(() => {
    setPageIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setPageIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  useEffect(() => {
    setPageIndex((i) => Math.min(i, total - 1));
  }, [total]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !fileName || !src || typeof document === "undefined") return null;

  const canPrev = pageIndex > 0;
  const canNext = pageIndex < total - 1;

  return createPortal(
    <div
      className="wb-doc-preview-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${fileName}`}
    >
      <button type="button" className="wb-doc-preview-lightbox__backdrop" onClick={onClose} aria-label="Close" />
      <div className="wb-doc-preview-lightbox__panel">
        <button type="button" className="wb-doc-preview-lightbox__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="wb-doc-preview-lightbox__meta" aria-live="polite">
          <span className="wb-doc-preview-lightbox__pages">{total} pages</span>
          <span className="wb-doc-preview-lightbox__sep" aria-hidden>
            ·
          </span>
          <span className="wb-doc-preview-lightbox__position">
            Page {pageIndex + 1} of {total}
          </span>
        </p>
        <div className="wb-doc-preview-lightbox__img-wrap">
          <img src={src} alt="" className="wb-doc-preview-lightbox__img" />
        </div>
        <div className="wb-doc-preview-lightbox__pager">
          <button
            type="button"
            className="wb-doc-preview-lightbox__nav wb-doc-preview-lightbox__nav--prev"
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          {total <= 10 ? (
            <span className="wb-doc-preview-lightbox__pager-dots" role="tablist" aria-label="Jump to page">
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={`wb-doc-preview-lightbox__dot${i === pageIndex ? " wb-doc-preview-lightbox__dot--active" : ""}`}
                  onClick={() => setPageIndex(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-selected={i === pageIndex}
                />
              ))}
            </span>
          ) : (
            <div className="wb-doc-preview-lightbox__scrub">
              <label className="wb-doc-preview-lightbox__scrub-label">
                <span className="visually-hidden">Jump to page</span>
                <input
                  type="range"
                  className="wb-doc-preview-lightbox__range"
                  min={0}
                  max={total - 1}
                  value={pageIndex}
                  onChange={(e) => setPageIndex(Number(e.target.value))}
                  aria-valuemin={1}
                  aria-valuemax={total}
                  aria-valuenow={pageIndex + 1}
                  aria-valuetext={`Page ${pageIndex + 1} of ${total}`}
                />
              </label>
            </div>
          )}
          <button
            type="button"
            className="wb-doc-preview-lightbox__nav wb-doc-preview-lightbox__nav--next"
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
        <p className="wb-doc-preview-lightbox__caption">{fileName}</p>
      </div>
    </div>,
    document.body,
  );
}

function TemplatePreviewCard({
  file,
  onOpen,
  onUseTemplate,
}: {
  file: CreateDocTemplateFile;
  onOpen: (file: CreateDocTemplateFile) => void;
  onUseTemplate: (file: CreateDocTemplateFile) => void;
}) {
  const src = docPagePreviewDataUri(file.name, 0, file.pageCount);
  return (
    <li className="wb-create-templates__preview-item">
      <div className="wb-create-templates__preview-card">
        <button
          type="button"
          className="wb-create-templates__preview"
          onClick={() => onOpen(file)}
          aria-label={`View preview of ${file.name}, ${file.pageCount} pages`}
        >
          <span className="wb-create-templates__thumb-wrap">
            <img src={src} alt="" className="wb-create-templates__thumb" width={200} height={262} decoding="async" />
          </span>
          <span className="wb-create-templates__preview-meta">
            <span className="wb-create-templates__preview-name" title={file.name}>
              {file.name}
            </span>
            <span className="wb-create-templates__preview-row">
              <span className="wb-create-templates__preview-type">PDF</span>
              <span className="wb-create-templates__preview-pages">{file.pageCount} pages</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          className="wb-btn wb-btn--primary wb-create-templates__use"
          onClick={() => onUseTemplate(file)}
        >
          Use this Template
        </button>
      </div>
    </li>
  );
}

export function CreateDocumentBrowseTemplatesPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<CreateDocTemplateFile | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const useTemplate = useCallback(
    (file: CreateDocTemplateFile) => {
      if (!categoryId || !isCreateDocCategoryId(categoryId)) return;
      const q = new URLSearchParams({ file: file.name, category: categoryId });
      navigate(`/create-document/method?${q.toString()}`);
    },
    [navigate, categoryId],
  );

  if (!categoryId || !isCreateDocCategoryId(categoryId)) {
    return <Navigate to="/create-document/template" replace />;
  }

  const sections = CREATE_DOC_TEMPLATE_SECTIONS[categoryId];
  const categoryTitle = getCreateDocCategoryTitle(categoryId);

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
      <span className="wb-create-doc__crumb-current">{categoryTitle}</span>
    </nav>
  );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-create-templates">
        <div className="wb-create-templates__top">
          <Link to="/create-document/template" className="wb-create-templates__back">
            ← Back to categories
          </Link>
        </div>

        <header className="wb-create-templates__intro">
          <span className="wb-create-templates__intro-accent" aria-hidden />
          <div className="wb-create-templates__intro-body">
            <p className="wb-create-templates__eyebrow">{categoryTitle}</p>
            <h1 className="wb-create-templates__title">Sample templates</h1>
            <p className="wb-create-templates__lede">
              Browse starter PDFs below. Click a preview to enlarge. Use <strong>Previous</strong> /{" "}
              <strong>Next</strong> or the <strong>arrow keys</strong> to flip pages.
            </p>
          </div>
        </header>

        <div className="wb-create-templates__sections">
          {sections.map((section) => (
            <section key={section.sectionTitle} className="wb-create-templates__section">
              <h2 className="wb-create-templates__section-title">{section.sectionTitle}</h2>
              <ul className="wb-create-templates__preview-grid">
                {section.files.map((file) => (
                  <TemplatePreviewCard
                    key={file.name}
                    file={file}
                    onOpen={setLightbox}
                    onUseTemplate={useTemplate}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <PreviewLightbox
        open={lightbox !== null}
        fileName={lightbox?.name ?? null}
        pageCount={lightbox?.pageCount ?? 1}
        onClose={closeLightbox}
      />
    </>
  );
}
