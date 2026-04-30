import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import {
  CREATE_DOC_CATEGORIES,
  CREATE_DOC_FILTER_CHIPS,
  type CreateDocCategoryId,
  type CreateDocFilter,
} from "../data/createDocumentCategories";

export function CreateDocumentSelectTemplatePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CreateDocCategoryId>("company");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CreateDocFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CREATE_DOC_CATEGORIES.filter((c) => {
      const catOk = filter === "All" || (filter !== "All" && c.tags.includes(filter));
      const qOk =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [query, filter]);

  useEffect(() => {
    if (filtered.length === 0) return;
    if (filtered.some((c) => c.id === selected)) return;
    setSelected(filtered[0].id);
  }, [filtered, selected]);

  const crumbs = (
    <nav className="wb-create-doc__crumbs" aria-label="Breadcrumb">
      <Link to="/create-document/template" className="wb-create-doc__crumb-link">
        Create Document
      </Link>
      <span className="wb-create-doc__crumb-sep" aria-hidden>
        {" "}
        &gt;{" "}
      </span>
      <span className="wb-create-doc__crumb-current">Select template</span>
    </nav>
  );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-create-doc">
        <div className="wb-create-doc__section-head">
          <span className="wb-create-doc__section-dot" aria-hidden />
          <h2 className="wb-create-doc__section-title">Browse by Category</h2>
        </div>

        <div className="wb-create-doc__toolbar wb-docs-toolbar">
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
              aria-label="Search template categories"
            />
          </label>
          <div className="wb-docs-filters" role="group" aria-label="Filter by document type">
            {CREATE_DOC_FILTER_CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                className={`wb-docs-filter${filter === c ? " wb-docs-filter--active" : ""}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="wb-docs-empty">
            <p className="wb-docs-empty__title">No matches</p>
            <p className="wb-docs-empty__body">Try another search or clear filters.</p>
            <button
              type="button"
              className="wb-btn wb-btn--muted"
              onClick={() => {
                setQuery("");
                setFilter("All");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="wb-create-doc__grid" role="listbox" aria-label="Template categories">
            {filtered.map(({ id, title, description, iconSrc }) => {
              const isSelected = selected === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`wb-create-doc__card${isSelected ? " wb-create-doc__card--selected" : ""}`}
                  onClick={() => setSelected(id)}
                >
                  <span className="wb-create-doc__card-icon" aria-hidden>
                    <img
                      src={iconSrc}
                      alt=""
                      width={24}
                      height={24}
                      className="wb-create-doc__card-img"
                      decoding="async"
                    />
                  </span>
                  <span className="wb-create-doc__card-text">
                    <span className="wb-create-doc__card-title">{title}</span>
                    <span className="wb-create-doc__card-desc">{description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="wb-create-doc__footer">
          <button
            type="button"
            className="wb-btn wb-btn--primary wb-create-doc__next"
            disabled={filtered.length === 0}
            onClick={() => navigate(`/create-document/templates/${selected}`)}
          >
            Next <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </>
  );
}
