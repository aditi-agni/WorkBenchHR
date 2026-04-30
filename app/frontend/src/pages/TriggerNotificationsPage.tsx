import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SkipForNow } from "../components/SkipForNow";

const rows = [
  {
    id: "review",
    title: "Upcoming Review",
    desc: "Notify me one week before employee review is due.",
    options: ["Weekly Summary", "Instant", "Off"],
  },
  {
    id: "compliance",
    title: "Employee Compliance Reminders",
    desc: "Automated alerts for expiring certifications, mandatory training, and policy signatures.",
    options: ["Instant Notification", "Weekly Summary", "Off"],
  },
  {
    id: "docs",
    title: "Document Management Triggers",
    desc: "Send a nudge to an employee until their form is completed, and notify HR when a new hire has successfully uploaded all documents.",
    options: ["Instant Notification", "Weekly Summary", "Off"],
  },
] as const;

export function TriggerNotificationsPage() {
  const [masterOn, setMasterOn] = useState(true);
  const [mode, setMode] = useState<Record<string, string>>({
    review: "Weekly Summary",
    compliance: "Instant Notification",
    docs: "Instant Notification",
  });
  const navigate = useNavigate();

  return (
    <div className="wb-page wb-onboarding wb-notify">
      <div className="wb-privacy__top">
        <SkipForNow to="/dashboard" />
      </div>
      <h1 className="wb-onboarding__title">Set Up Trigger Notifications</h1>
      <p className="wb-notify__sub">
        Receive notifications for key HR actions so you can stay on top of
        important tasks automatically.
      </p>

      <div className={`wb-notify-feature${masterOn ? " wb-notify-feature--on" : ""}`}>
        <div className="wb-notify-feature__icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2h16l-2-2z"
              fill="white"
            />
          </svg>
        </div>
        <div className="wb-notify-feature__text">
          <h2 className="wb-notify-feature__title">Trigger Notifications</h2>
          <p className="wb-notify-feature__desc">
            Create custom notifications for HR actions you&apos;ll be alerted.
          </p>
        </div>
        <button
          type="button"
          className={`wb-toggle${masterOn ? " wb-toggle--on" : ""}`}
          onClick={() => setMasterOn((v) => !v)}
          aria-pressed={masterOn}
          aria-label="Trigger notifications"
        >
          <span className="wb-toggle__knob" />
        </button>
      </div>

      <ul className="wb-notify-list">
        {rows.map((row) => (
          <li key={row.id} className="wb-notify-row">
            <div className="wb-notify-row__icon" aria-hidden>
              {row.id === "review" && <MiniIconCal />}
              {row.id === "compliance" && <MiniIconClock />}
              {row.id === "docs" && <MiniIconDoc />}
            </div>
            <div className="wb-notify-row__body">
              <h3 className="wb-notify-row__title">{row.title}</h3>
              <p className="wb-notify-row__desc">{row.desc}</p>
            </div>
            <label className="wb-select-wrap">
              <span className="visually-hidden">Frequency for {row.title}</span>
              <select
                className="wb-select"
                value={mode[row.id]}
                onChange={(e) =>
                  setMode((m) => ({ ...m, [row.id]: e.target.value }))
                }
              >
                {row.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>

      <div className="wb-privacy__footer wb-notify__footer">
        <span />
        <div className="wb-privacy__buttons">
          <button type="button" className="wb-btn wb-btn--muted" onClick={() => navigate("/dashboard")}>
            Opt Out
          </button>
          <button
            type="button"
            className="wb-btn wb-btn--primary"
            onClick={() =>
              navigate("/settings/trigger-notifications", {
                state: { fromOnboarding: true },
              })
            }
          >
            Let&apos;s Get Started! <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniIconCal() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden>
      <path d="M7 2v2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm12 8H5v8h14v-8z" />
    </svg>
  );
}

function MiniIconClock() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
    </svg>
  );
}

function MiniIconDoc() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
    </svg>
  );
}
