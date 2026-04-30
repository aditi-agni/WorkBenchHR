import { Link } from "react-router-dom";

const SESSIONS = [
  {
    id: "1",
    label: "Chrome on macOS",
    detail: "Pittsburgh, PA · This device",
    active: true,
  },
  {
    id: "2",
    label: "Safari on iPhone",
    detail: "Last active 3 days ago · Mobile",
    active: false,
  },
] as const;

export function SettingsSecurityPage() {
  return (
    <div className="wb-security-page">
      <div className="wb-security-page__intro">
        <h1 className="wb-security-page__title">Password &amp; security</h1>
        <p className="wb-security-page__sub">
          Placeholder layout for account protection—actions below are disabled until real auth and
          session APIs are wired in.
        </p>
      </div>

      <section className="wb-security-status" aria-label="Security overview">
        <div className="wb-security-status__main">
          <span className="wb-security-status__label">At a glance</span>
          <p className="wb-security-status__line">
            <strong>Password</strong> last updated about 3 months ago (sample).
            <span className="wb-security-status__sep"> </span>
            <strong>Two-factor</strong> is not enabled.
          </p>
          <p className="wb-security-status__meta">
            Last sign-in: today · Chrome on macOS — Pittsburgh, PA region
          </p>
        </div>
        <Link to="/settings/help" className="wb-btn wb-btn--outline wb-security-status__link">
          Security help
        </Link>
      </section>

      <section className="wb-security-panel" aria-labelledby="sec-password-heading">
        <div className="wb-security-panel__row">
          <div className="wb-security-panel__text">
            <h2 className="wb-security-panel__title" id="sec-password-heading">
              Sign-in password
            </h2>
            <p className="wb-security-panel__lede">
              Use a strong password you don&apos;t reuse on other sites. When this ships, you&apos;ll
              confirm your current password before choosing a new one.
            </p>
          </div>
          <button type="button" className="wb-btn wb-btn--outline wb-security-panel__cta" disabled>
            Change password
          </button>
        </div>
      </section>

      <section className="wb-security-panel" aria-labelledby="sec-2fa-heading">
        <div className="wb-security-panel__row">
          <div className="wb-security-panel__text">
            <h2 className="wb-security-panel__title" id="sec-2fa-heading">
              Two-factor authentication
            </h2>
            <p className="wb-security-panel__lede">
              Require a code from an authenticator app when you sign in. Recommended for anyone who
              can change roles, billing, or employee data.
            </p>
            <p className="wb-security-panel__pill" role="status">
              Status: <span className="wb-security-panel__pill-off">Off</span> (demo)
            </p>
          </div>
          <button type="button" className="wb-btn wb-btn--primary wb-security-panel__cta" disabled>
            Set up 2FA
          </button>
        </div>
      </section>

      <section className="wb-security-panel" aria-labelledby="sec-sessions-heading">
        <header className="wb-security-panel__toolbar">
          <h2 className="wb-security-panel__title" id="sec-sessions-heading">
            Active sessions
          </h2>
          <button type="button" className="wb-btn wb-btn--muted wb-security-panel__toolbar-btn" disabled>
            Sign out everywhere
          </button>
        </header>
        <ul className="wb-security-sessions">
          {SESSIONS.map((s) => (
            <li key={s.id} className="wb-security-session">
              <span className="wb-security-session__icon" aria-hidden>
                {s.active ? "●" : "○"}
              </span>
              <div className="wb-security-session__body">
                <span className="wb-security-session__label">{s.label}</span>
                <span className="wb-security-session__detail">{s.detail}</span>
              </div>
              <button type="button" className="wb-btn wb-btn--outline wb-security-session__out" disabled>
                Sign out
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="wb-security-panel wb-security-panel--danger"
        aria-labelledby="sec-danger-heading"
      >
        <h2 className="wb-security-panel__title" id="sec-danger-heading">
          Danger zone
        </h2>
        <p className="wb-security-panel__lede">
          Deleting the workspace removes access for your organization.
        </p>
        <button type="button" className="wb-btn wb-btn--danger-outline wb-security-panel__danger-btn" disabled>
          Delete workspace (demo)
        </button>
      </section>

      <p className="wb-security-page__footnote">
        No passwords, OTPs, or session tokens are sent anywhere from this screen yet.
      </p>
    </div>
  );
}
