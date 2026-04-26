import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import {
  CONTRACT_LABEL,
  EMPLOYEES,
  TEAM_META,
  type Employee,
  type TeamId,
} from "../lib/employeeDirectory";

const defaultRoles = {
  headChef: true,
  cashier: true,
  kitchen: true,
  cleaning: true,
};

const defaultContract = { intern: false, fullTime: true, partTime: false };

function roleFilterActive(r: typeof defaultRoles) {
  return (Object.keys(r) as (keyof typeof r)[]).some((k) => r[k]);
}

function contractFilterActive(c: typeof defaultContract) {
  return (Object.keys(c) as (keyof typeof c)[]).some((k) => c[k]);
}

function employeeMatchesFilters(
  emp: Employee,
  roles: typeof defaultRoles,
  contract: typeof defaultContract,
  q: string,
) {
  const t = q.trim().toLowerCase();
  if (t && !emp.name.toLowerCase().includes(t) && !emp.title.toLowerCase().includes(t)) {
    return false;
  }
  if (roleFilterActive(roles)) {
    const ok = emp.roleTags.some((tag) => roles[tag]);
    if (!ok) return false;
  }
  if (contractFilterActive(contract)) {
    const ok =
      (contract.intern && emp.contract === "intern") ||
      (contract.fullTime && emp.contract === "fullTime") ||
      (contract.partTime && emp.contract === "partTime");
    if (!ok) return false;
  }
  return true;
}

export function EmployeePortalPage() {
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  /** `list` = teams (primary). `grid` = all employees as cards (secondary). */
  const [pageView, setPageView] = useState<"list" | "grid">("list");
  const [roleSearch, setRoleSearch] = useState("");
  const [roles, setRoles] = useState(defaultRoles);
  const [contract, setContract] = useState(defaultContract);
  const [empSearch, setEmpSearch] = useState("");

  const visibleEmployees = useMemo(() => {
    let list = EMPLOYEES.filter((e) => employeeMatchesFilters(e, roles, contract, empSearch));
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => b.joined.localeCompare(a.joined));
    }
    return list;
  }, [roles, contract, empSearch, sortBy]);

  const visibleTeams = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    const teamIds: TeamId[] = ["chefs", "cashiers"];
    return teamIds
      .map((tid) => {
        let members = visibleEmployees.filter((e) => e.teamId === tid);
        if (q) {
          members = members.filter(
            (m) => m.title.toLowerCase().includes(q) || m.name.toLowerCase().includes(q),
          );
        }
        return {
          id: tid,
          name: TEAM_META[tid].name,
          pill: TEAM_META[tid].pill(members.length),
          members,
        };
      })
      .filter((t) => t.members.length > 0);
  }, [visibleEmployees, roleSearch]);

  const totalEmployees = EMPLOYEES.length;

  return (
    <>
      <WorkspaceHeader title="Employee Portal" />

      <div className="wb-hiring wb-emp-portal">
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
              placeholder="Search employee…"
              className="wb-hiring__search-input"
              aria-label="Search employees"
              value={empSearch}
              onChange={(e) => setEmpSearch(e.target.value)}
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

          <div className="wb-hiring__view-toggles" role="group" aria-label="Page view">
            <button
              type="button"
              className={`wb-hiring__view-btn${pageView === "list" ? " wb-hiring__view-btn--active" : ""}`}
              aria-pressed={pageView === "list"}
              aria-label="Team view"
              title="Teams"
              onClick={() => setPageView("list")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </button>
            <button
              type="button"
              className={`wb-hiring__view-btn${pageView === "grid" ? " wb-hiring__view-btn--active" : ""}`}
              aria-pressed={pageView === "grid"}
              aria-label="All employees grid"
              title="All employees"
              onClick={() => setPageView("grid")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
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
                placeholder="Chef"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                aria-label="Filter roles by keyword"
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
                    <span className="wb-hiring__check-count">3</span>
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
                    <span className="wb-hiring__check-count">2</span>
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
                    <span className="wb-hiring__check-count">14</span>
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
                    <span className="wb-hiring__check-count">5</span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          <div className="wb-hiring__results">
            {pageView === "grid" ? (
              <>
                <p className="wb-emp-people__count">
                  Showing <strong>{visibleEmployees.length}</strong> of <strong>{totalEmployees}</strong>{" "}
                  employees
                </p>
                <ul className="wb-emp-people-grid">
                  {visibleEmployees.map((emp) => (
                    <li key={emp.id} className="wb-emp-people-grid__cell">
                      <Link to={`/dashboard/employees/${emp.id}`} className="wb-emp-card wb-emp-card--link">
                      <div
                        className="wb-emp-card__avatar"
                        style={{ background: emp.swatch }}
                        aria-hidden
                      />
                      <h2 className="wb-emp-card__name">{emp.name}</h2>
                      <p className="wb-emp-card__title">{emp.title}</p>
                      <div className="wb-emp-card__tags">
                        <span
                          className={`wb-emp-card__tag wb-emp-card__tag--dept${emp.departmentLabel === "Cashier" ? " wb-emp-card__tag--dept-cashier" : ""}`}
                        >
                          {emp.departmentLabel === "Kitchen" ? "Kitchen" : "Cashier"}
                        </span>
                        <span className="wb-emp-card__tag wb-emp-card__tag--contract">
                          {CONTRACT_LABEL[emp.contract]}
                        </span>
                      </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="wb-emp-teams__toolbar">
                  <p className="wb-hiring__count wb-emp-teams__count">
                    Showing <strong>{visibleTeams.length}</strong> teams
                  </p>
                  <button type="button" className="wb-btn wb-btn--dark wb-emp-teams__create">
                    + Create team
                  </button>
                </div>

                <div className="wb-emp-teams">
                  {visibleTeams.map((team) => (
                    <article key={team.id} className="wb-emp-team">
                      <header className="wb-emp-team__head">
                        <h2 className="wb-emp-team__title">{team.name}</h2>
                        <span className="wb-emp-team__pill">{team.pill}</span>
                      </header>
                      <ul className="wb-emp-team__members">
                        {team.members.map((m) => (
                          <li key={m.id}>
                            <Link to={`/dashboard/employees/${m.id}`} className="wb-emp-member wb-emp-member--link">
                              <span
                                className="wb-emp-member__swatch"
                                style={{ background: m.swatch }}
                                aria-hidden
                              />
                              <div className="wb-emp-member__text">
                                <span className="wb-emp-member__name">{m.name}</span>
                                <span className="wb-emp-member__role">{m.title}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <button type="button" className="wb-emp-team__add">
                        + Add member
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
