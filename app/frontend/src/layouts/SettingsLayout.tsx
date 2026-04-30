import { Link, NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/settings/profile", label: "Profile", end: true, badge: 2 },
  {
    to: "/settings/company",
    label: "Company Information",
    end: false,
  },
  { to: "/settings/roles", label: "Roles & Permissions", end: false },
  { to: "/settings/billing", label: "Plan & Billing", end: false },
  {
    to: "/settings/data",
    label: "Data Management & Sync",
    end: false,
    badge: 11,
  },
  {
    to: "/settings/trigger-notifications",
    label: "Manage Trigger Notifications",
    end: false,
  },
  { to: "/settings/employees", label: "Manage Employees", end: false },
  { to: "/settings/security", label: "Password & Security", end: false },
] as const;

export function SettingsLayout() {
  return (
    <div className="wb-settings-shell">
      <aside className="wb-settings-nav">
        <div className="wb-settings-nav__head">
          <Link to="/dashboard" className="wb-settings-back-dashboard">
            <span className="wb-settings-back-dashboard__arrow" aria-hidden>
              ←
            </span>
            <span>Back to dashboard</span>
          </Link>
        </div>
        <p className="wb-settings-nav__section-label">Settings</p>
        <nav className="wb-settings-nav__list" aria-label="Settings">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `wb-settings-link${isActive ? " wb-settings-link--active" : ""}`
              }
            >
              <span className="wb-settings-link__label">{item.label}</span>
              {"badge" in item && item.badge != null ? (
                <span className="wb-settings-link__badge">{item.badge}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="wb-settings-nav__foot">
          <NavLink
            to="/settings/help"
            className={({ isActive }) =>
              `wb-settings-link wb-settings-link--ghost${isActive ? " wb-settings-link--active" : ""}`
            }
          >
            Help &amp; Support
          </NavLink>
        </div>
      </aside>
      <div className="wb-settings-main">
        <Outlet />
      </div>
    </div>
  );
}
