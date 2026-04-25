import { useMemo, useState } from "react";
import { WorkspaceHeader } from "../components/WorkspaceHeader";

const defaultRoles = {
  headChef: true,
  cashier: false,
  kitchen: false,
  cleaning: false,
};

const defaultContract = { intern: false, fullTime: true, partTime: false };

type Member = { id: string; name: string; role: string; swatch: string };

type Team = { id: string; name: string; memberLabel: string; members: Member[] };

const TEAMS: Team[] = [
  {
    id: "chefs",
    name: "Chefs",
    memberLabel: "4 members",
    members: [
      { id: "1", name: "Rosa Mendez", role: "Head chef", swatch: "#22c55e" },
      { id: "2", name: "James Okoye", role: "Sous Chef", swatch: "#f97316" },
      { id: "3", name: "Priya Shah", role: "Prep Chef", swatch: "#a855f7" },
      { id: "4", name: "Morgan Ellis", role: "Line Cook", swatch: "#14b8a6" },
    ],
  },
  {
    id: "cashiers",
    name: "Cashiers",
    memberLabel: "6 members",
    members: [
      { id: "c1", name: "Carlos Rivera", role: "Lead cashier", swatch: "#3b82f6" },
      { id: "c2", name: "Maria Lopez", role: "Cashier", swatch: "#ec4899" },
      { id: "c3", name: "Tom Kim", role: "Cashier", swatch: "#92400e" },
    ],
  },
];

export function EmployeePortalPage() {
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [view, setView] = useState<"list" | "grid">("grid");
  const [roleSearch, setRoleSearch] = useState("");
  const [roles, setRoles] = useState(defaultRoles);
  const [contract, setContract] = useState(defaultContract);

  const visibleTeams = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    return TEAMS.map((team) => {
      let members = [...team.members];
      if (q) {
        members = members.filter(
          (m) =>
            m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q),
        );
      }
      if (sortBy === "name") {
        members.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        members.sort((a, b) => a.id.localeCompare(b.id));
      }
      return { ...team, members };
    }).filter((t) => t.members.length > 0);
  }, [roleSearch, sortBy]);

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
            <div className="wb-emp-teams__toolbar">
              <p className="wb-hiring__count wb-emp-teams__count">
                Showing <strong>{TEAMS.length}</strong> teams
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
                    <span className="wb-emp-team__pill">{team.memberLabel}</span>
                  </header>
                  <ul
                    className={`wb-emp-team__members${view === "grid" ? " wb-emp-team__members--grid" : ""}`}
                  >
                    {team.members.map((m) => (
                      <li key={m.id} className="wb-emp-member">
                        <span
                          className="wb-emp-member__swatch"
                          style={{ background: m.swatch }}
                          aria-hidden
                        />
                        <div className="wb-emp-member__text">
                          <span className="wb-emp-member__name">{m.name}</span>
                          <span className="wb-emp-member__role">{m.role}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="wb-emp-team__add">
                    + Add member
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
