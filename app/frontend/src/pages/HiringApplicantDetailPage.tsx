import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import {
  candidateSubtitle,
  getApplicant,
  getJobPosting,
  type ApplicantDocument,
  type ApplicantDocKind,
} from "../lib/hiringDirectory";

const PIPELINE_STAGES = ["Screening", "Interviewing", "Offer Letter", "Hired"] as const;

const DOC_TABS: { id: "all" | ApplicantDocKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "resume", label: "Resume" },
  { id: "cover", label: "Cover Letter" },
  { id: "portfolio", label: "Portfolio" },
];

function formatDocDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

export function HiringApplicantDetailPage() {
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>();
  const [docTab, setDocTab] = useState<"all" | ApplicantDocKind>("all");
  const [docSearch, setDocSearch] = useState("");
  const [docSort, setDocSort] = useState<"name" | "date">("name");

  const job = jobId ? getJobPosting(jobId) : undefined;
  const applicant = jobId && applicantId ? getApplicant(jobId, applicantId) : undefined;

  const crumbs = useMemo(() => {
    if (!job) return null;
    return (
      <nav className="wb-hire-detail__crumbs" aria-label="Breadcrumb">
        <Link to="/hiring" className="wb-hire-detail__crumb-link">
          Hiring
        </Link>
        <span className="wb-hire-detail__crumb-sep" aria-hidden>
          &gt;
        </span>
        <Link to={`/hiring/jobs/${job.id}`} className="wb-hire-detail__crumb-link">
          {job.title}
        </Link>
      </nav>
    );
  }, [job]);

  const filteredDocs = useMemo(() => {
    if (!applicant) return [];
    let list = [...applicant.documents];
    if (docTab !== "all") {
      list = list.filter((d) => d.kind === docTab);
    }
    const t = docSearch.trim().toLowerCase();
    if (t) {
      list = list.filter((d) => d.name.toLowerCase().includes(t));
    }
    if (docSort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    }
    return list;
  }, [applicant, docTab, docSearch, docSort]);

  if (!jobId || !applicantId || !job || !applicant) {
    return <Navigate to="/hiring" replace />;
  }

  const furthest = Math.max(0, Math.min(3, applicant.pipelineStep));

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-hire-detail">
        <PipelineStepper furthestIndex={furthest} />

        <section className="wb-hire-detail__profile" aria-labelledby="hire-applicant-name">
          <Link to={`/hiring/jobs/${job.id}`} className="wb-hire-detail__back-floating" aria-label="Back to applicants">
            <span aria-hidden>←</span>
          </Link>

          <img className="wb-hire-detail__photo" src={applicant.photo} width={120} height={120} alt="" />

          <div className="wb-hire-detail__identity">
            <h1 id="hire-applicant-name" className="wb-hire-detail__name">
              {applicant.name}
            </h1>
            <p className="wb-hire-detail__role">{candidateSubtitle(job.title)}</p>
          </div>

          <div className="wb-hire-detail__match-card">
            <div className="wb-hire-detail__match-card-head">
              <span className="wb-hire-detail__match-score-lg">{applicant.matchScore}%</span>
              <span className="wb-hire-detail__match-score-label">Match Score</span>
            </div>
            <p className="wb-hire-detail__ai-label">AI Summary</p>
            <blockquote className="wb-hire-detail__ai-quote">&ldquo;{applicant.aiMatchSummary}&rdquo;</blockquote>
          </div>

          <button type="button" className="wb-hire-detail__profile-menu" aria-label="More candidate actions">
            ⋯
          </button>
        </section>

        <details className="wb-hire-detail__docs" open>
          <summary className="wb-hire-detail__docs-summary">
            <span className="wb-hire-detail__docs-summary-text">Documents</span>
            <span className="wb-hire-detail__docs-chevron" aria-hidden />
          </summary>

          <div className="wb-hire-detail__docs-inner">
            <div className="wb-hire-detail__doc-tabs" role="tablist" aria-label="Document categories">
              {DOC_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={docTab === tab.id}
                  className={`wb-hire-detail__doc-tab${docTab === tab.id ? " wb-hire-detail__doc-tab--active" : ""}`}
                  onClick={() => setDocTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="wb-hire-detail__doc-toolbar">
              <label className="wb-hiring__search wb-hire-detail__doc-search">
                <span className="wb-hiring__search-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      fill="currentColor"
                      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                      opacity="0.55"
                    />
                  </svg>
                </span>
                <input
                  type="search"
                  className="wb-hiring__search-input"
                  placeholder="Search documents…"
                  aria-label="Search documents"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                />
              </label>

              <div className="wb-hiring__toolbar-mid wb-hire-detail__doc-sort">
                <span className="wb-hiring__sort-label">Sort by</span>
                <div className="wb-hiring__sort-pills" role="group" aria-label="Sort documents">
                  <button
                    type="button"
                    className={`wb-hiring__sort-pill wb-hire-detail__sort-pill${docSort === "name" ? " wb-hiring__sort-pill--active wb-hire-detail__sort-pill--active" : ""}`}
                    aria-pressed={docSort === "name"}
                    onClick={() => setDocSort("name")}
                  >
                    {docSort === "name" ? <span className="wb-hire-detail__sort-dot" aria-hidden /> : null}
                    Name A-Z
                  </button>
                  <button
                    type="button"
                    className={`wb-hiring__sort-pill wb-hire-detail__sort-pill${docSort === "date" ? " wb-hiring__sort-pill--active wb-hire-detail__sort-pill--active" : ""}`}
                    aria-pressed={docSort === "date"}
                    onClick={() => setDocSort("date")}
                  >
                    {docSort === "date" ? <span className="wb-hire-detail__sort-dot" aria-hidden /> : null}
                    Date Added
                  </button>
                </div>
              </div>
            </div>

            <div className="wb-hire-detail__doc-list-wrap">
              {filteredDocs.length === 0 ? (
                <p className="wb-hire-detail__doc-empty">No documents match this filter.</p>
              ) : (
                <ul className="wb-hire-detail__doc-list">
                  {filteredDocs.map((d) => (
                    <DocRow key={d.id} doc={d} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </details>
      </div>
    </>
  );
}

function PipelineStepper({ furthestIndex }: { furthestIndex: number }) {
  const last = PIPELINE_STAGES.length - 1;
  const progressPct = last <= 0 ? 100 : (furthestIndex / last) * 100;
  const stageLabel = PIPELINE_STAGES[furthestIndex] ?? PIPELINE_STAGES[0];

  return (
    <div
      className="wb-hire-detail__stepper"
      role="group"
      aria-label={`Hiring pipeline: ${stageLabel}`}
    >
      <div className="wb-hire-detail__stepper-rail">
        <div className="wb-hire-detail__stepper-track-bg" aria-hidden />
        <div
          className="wb-hire-detail__stepper-track-fill"
          style={{ width: `${progressPct}%` }}
          aria-hidden
        />
        <div className="wb-hire-detail__stepper-nodes" aria-hidden>
          {PIPELINE_STAGES.map((label, i) => {
            const reached = i <= furthestIndex;
            const leftPct = last <= 0 ? 0 : (i / last) * 100;
            return (
              <span
                key={label}
                className={`wb-hire-detail__step-node-dot${reached ? " wb-hire-detail__step-node-dot--reached" : ""}`}
                style={{ left: `${leftPct}%` }}
              />
            );
          })}
        </div>
      </div>
      <ol className="wb-hire-detail__stepper-labels">
        {PIPELINE_STAGES.map((label, i) => (
          <li
            key={label}
            className={`wb-hire-detail__step-label${i <= furthestIndex ? " wb-hire-detail__step-label--done" : ""}`}
          >
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function DocRow({ doc }: { doc: ApplicantDocument }) {
  return (
    <li className="wb-hire-detail__doc-row">
      <span className="wb-hire-detail__doc-icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"
            opacity="0.75"
          />
        </svg>
      </span>
      <div className="wb-hire-detail__doc-row-main">
        <span className="wb-hire-detail__doc-name" title={doc.name}>
          {doc.name}
        </span>
        <span className="wb-hire-detail__doc-meta">
          {doc.kind === "resume"
            ? "Resume"
            : doc.kind === "cover"
              ? "Cover letter"
              : doc.kind === "portfolio"
                ? "Portfolio"
                : "Other"}{" "}
          · Added {formatDocDate(doc.dateAdded)}
        </span>
      </div>
      <button type="button" className="wb-hire-detail__doc-row-more" aria-label={`Actions for ${doc.name}`}>
        ⋯
      </button>
    </li>
  );
}
