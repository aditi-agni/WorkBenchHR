import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { JOB_POSTINGS } from "../lib/hiringDirectory";

const defaultRoles = {
  headChef: true,
  cashier: false,
  kitchen: false,
  cleaning: false,
};

const defaultContract = { intern: false, fullTime: true, partTime: false };
const defaultStatus = { active: true, inactive: false, archived: false };

export function HiringPage() {
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [view, setView] = useState<"list" | "grid">("list");
  const [roleSearch, setRoleSearch] = useState("");
  const [roles, setRoles] = useState(defaultRoles);
  const [contract, setContract] = useState(defaultContract);
  const [roleStatus, setRoleStatus] = useState(defaultStatus);

  const visiblePostings = useMemo(() => {
    if (!roleStatus.active) return [];
    const list = [...JOB_POSTINGS];
    if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => b.datePosted.localeCompare(a.datePosted));
    }
    return list;
  }, [roleStatus.active, sortBy]);

  return (
    <>
      <WorkspaceHeader title="Hiring" />

      <div className="wb-hiring">
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
            <input type="search" placeholder="Search roles…" className="wb-hiring__search-input" />
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
                Date joined
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
                <path
                  fill="currentColor"
                  d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                />
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
                <path
                  fill="currentColor"
                  d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="wb-hiring__body">
          <aside className="wb-hiring__filters" aria-label="Filters">
            <div className="wb-hiring__filter-block">
              <div className="wb-hiring__filter-head">
                <h2 className="wb-hiring__filter-title">Role</h2>
                <button
                  type="button"
                  className="wb-hiring__filter-clear"
                  onClick={() => {
                    setRoles({ ...defaultRoles });
                    setRoleSearch("");
                  }}
                >
                  Clear
                </button>
              </div>
              <input
                type="search"
                className="wb-hiring__filter-search"
                placeholder="Search roles…"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />
              <ul className="wb-hiring__checks">
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roles.headChef}
                      onChange={(e) => setRoles((r) => ({ ...r, headChef: e.target.checked }))}
                    />
                    <span>Head Chef</span>
                    <span className="wb-hiring__check-count">3</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roles.cashier}
                      onChange={(e) => setRoles((r) => ({ ...r, cashier: e.target.checked }))}
                    />
                    <span>Cashier</span>
                    <span className="wb-hiring__check-count">6</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roles.kitchen}
                      onChange={(e) => setRoles((r) => ({ ...r, kitchen: e.target.checked }))}
                    />
                    <span>Kitchen Staff</span>
                    <span className="wb-hiring__check-count">8</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roles.cleaning}
                      onChange={(e) => setRoles((r) => ({ ...r, cleaning: e.target.checked }))}
                    />
                    <span>Cleaning</span>
                    <span className="wb-hiring__check-count">4</span>
                  </label>
                </li>
              </ul>
            </div>

            <div className="wb-hiring__filter-block">
              <div className="wb-hiring__filter-head">
                <h2 className="wb-hiring__filter-title">Contract type</h2>
                <button
                  type="button"
                  className="wb-hiring__filter-clear"
                  onClick={() => setContract({ ...defaultContract })}
                >
                  Clear
                </button>
              </div>
              <ul className="wb-hiring__checks">
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={contract.intern}
                      onChange={(e) => setContract((c) => ({ ...c, intern: e.target.checked }))}
                    />
                    <span>Intern</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={contract.fullTime}
                      onChange={(e) => setContract((c) => ({ ...c, fullTime: e.target.checked }))}
                    />
                    <span>Full-time</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={contract.partTime}
                      onChange={(e) => setContract((c) => ({ ...c, partTime: e.target.checked }))}
                    />
                    <span>Part-time</span>
                  </label>
                </li>
              </ul>
            </div>

            <div className="wb-hiring__filter-block">
              <div className="wb-hiring__filter-head">
                <h2 className="wb-hiring__filter-title">Role status</h2>
                <button
                  type="button"
                  className="wb-hiring__filter-clear"
                  onClick={() => setRoleStatus({ ...defaultStatus })}
                >
                  Clear
                </button>
              </div>
              <ul className="wb-hiring__checks">
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roleStatus.active}
                      onChange={(e) =>
                        setRoleStatus((s) => ({ ...s, active: e.target.checked }))
                      }
                    />
                    <span>Active</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roleStatus.inactive}
                      onChange={(e) =>
                        setRoleStatus((s) => ({ ...s, inactive: e.target.checked }))
                      }
                    />
                    <span>Inactive</span>
                  </label>
                </li>
                <li>
                  <label className="wb-hiring__check">
                    <input
                      type="checkbox"
                      checked={roleStatus.archived}
                      onChange={(e) =>
                        setRoleStatus((s) => ({ ...s, archived: e.target.checked }))
                      }
                    />
                    <span>Archived</span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          <div className="wb-hiring__results">
            <p className="wb-hiring__count">
              Showing <strong>{visiblePostings.length}</strong>{" "}
              {visiblePostings.length === 1 ? "posting" : "postings"}
            </p>

            <div className={`wb-hiring__cards wb-hiring__cards--${view}`}>
              {visiblePostings.map((p) => (
                <article key={p.id} className="wb-hiring-card">
                  <div className="wb-hiring-card__top">
                    <span className="wb-hiring-card__status-pill">Status: Role open</span>
                  </div>
                  <h3 className="wb-hiring-card__title">{p.title}</h3>
                  <dl className="wb-hiring-card__meta">
                    <div>
                      <dt>Date posted</dt>
                      <dd>{p.datePosted}</dd>
                    </div>
                    <div>
                      <dt>Timeline</dt>
                      <dd className={p.risk ? "wb-hiring-card__dd--risk" : undefined}>{p.timeline}</dd>
                    </div>
                    <div>
                      <dt>Applicants</dt>
                      <dd>{p.applicants}</dd>
                    </div>
                  </dl>
                  <div
                    className="wb-hiring-card__bar-track"
                    role="progressbar"
                    aria-valuenow={Math.round(p.progress * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span
                      className={`wb-hiring-card__bar-fill${p.risk ? " wb-hiring-card__bar-fill--risk" : ""}`}
                      style={{ width: `${Math.round(p.progress * 100)}%` }}
                    />
                  </div>
                  <Link to={`/hiring/jobs/${p.id}`} className="wb-hiring-card__cta">
                    View all applicants <span aria-hidden>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
