import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import {
  candidateSubtitle,
  getApplicantsForJob,
  getJobPosting,
  type Applicant,
} from "../lib/hiringDirectory";

export function HiringApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [view, setView] = useState<"list" | "grid">("list");

  const job = jobId ? getJobPosting(jobId) : undefined;

  const applicants = useMemo(() => {
    if (!job) return [];
    let list = getApplicantsForJob(job.id);
    const t = q.trim().toLowerCase();
    if (t) {
      list = list.filter((a) => a.name.toLowerCase().includes(t) || a.statusLabel.toLowerCase().includes(t));
    }
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [job, q, sortBy]);

  if (!jobId || !job) {
    return <Navigate to="/hiring" replace />;
  }

  const crumbs = (
    <nav className="wb-hire-apps__crumbs" aria-label="Breadcrumb">
      <Link to="/hiring" className="wb-hire-apps__crumb-link">
        Hiring
      </Link>
      <span className="wb-hire-apps__crumb-sep" aria-hidden>
        &gt;
      </span>
      <span className="wb-hire-apps__crumb-current">{job.title}</span>
    </nav>
  );

  const searchPh = `Search '${job.title}' applicants…`;

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-hiring wb-hire-apps">
        <div className="wb-hiring__toolbar">
          <label className="wb-hiring__search">
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
              placeholder={searchPh}
              className="wb-hiring__search-input"
              aria-label="Search applicants"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <div className="wb-hiring__toolbar-mid">
            <span className="wb-hiring__sort-label">Sort by</span>
            <div className="wb-hiring__sort-pills" role="group" aria-label="Sort by">
              <button
                type="button"
                className={`wb-hiring__sort-pill${sortBy === "name" ? " wb-hiring__sort-pill--active" : ""}`}
                aria-pressed={sortBy === "name"}
                onClick={() => setSortBy("name")}
              >
                Name A-Z
              </button>
              <button
                type="button"
                className={`wb-hiring__sort-pill${sortBy === "date" ? " wb-hiring__sort-pill--active" : ""}`}
                aria-pressed={sortBy === "date"}
                onClick={() => setSortBy("date")}
              >
                Date Joined
              </button>
            </div>
          </div>

          <div className="wb-hiring__view-toggles" role="group" aria-label="View layout">
            <button
              type="button"
              className={`wb-hiring__view-btn${view === "list" ? " wb-hiring__view-btn--active" : ""}`}
              aria-pressed={view === "list"}
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </button>
            <button
              type="button"
              className={`wb-hiring__view-btn${view === "grid" ? " wb-hiring__view-btn--active" : ""}`}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="wb-hire-apps__count">
          Showing <strong>{applicants.length}</strong> &apos;{job.title}&apos; candidates.
        </p>

        <div className={`wb-hire-apps__list wb-hire-apps__list--${view}`}>
          {applicants.map((a) => (
            <ApplicantCard key={a.id} applicant={a} jobId={job.id} jobTitle={job.title} />
          ))}
        </div>
      </div>
    </>
  );
}

function ApplicantCard({ applicant, jobId, jobTitle }: { applicant: Applicant; jobId: string; jobTitle: string }) {
  return (
    <article className="wb-hire-app-card">
      <div className="wb-hire-app-card__top">
        <img className="wb-hire-app-card__photo" src={applicant.photo} width={72} height={72} alt="" />
        <div className="wb-hire-app-card__intro">
          <h2 className="wb-hire-app-card__name">{applicant.name}</h2>
          <p className="wb-hire-app-card__role">{candidateSubtitle(jobTitle)}</p>
          <p className="wb-hire-app-card__status-pill">Status: {applicant.statusLabel}</p>
        </div>
      </div>

      <div className="wb-hire-app-card__match">
        <div className="wb-hire-app-card__match-head">
          <span className="wb-hire-app-card__match-score">{applicant.matchScore}%</span>
          <span className="wb-hire-app-card__match-label">Match Score</span>
        </div>
        <p className="wb-hire-app-card__match-text">{applicant.matchBlurb}</p>
      </div>

      <Link to={`/hiring/jobs/${jobId}/applicants/${applicant.id}`} className="wb-btn wb-btn--primary wb-hire-app-card__cta">
        View Applicant <span aria-hidden>→</span>
      </Link>

      <div className="wb-hire-app-card__foot">
        <span className="wb-hire-app-card__meta">
          <span aria-hidden>📝</span> Notes {applicant.notes}
        </span>
        <span className="wb-hire-app-card__meta">
          <span aria-hidden>💬</span> Comments {applicant.comments}
        </span>
        <button type="button" className="wb-hire-app-card__more" aria-label="More options">
          ⋯
        </button>
      </div>
    </article>
  );
}
