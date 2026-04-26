import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import {
  CONTRACT_LABEL,
  getEmployeeById,
  getEmployeeEmail,
  getEmployeePhone,
  getEmployeePortrait,
  type Employee,
} from "../lib/employeeDirectory";

const DOC_ROWS = [
  {
    id: "d1",
    title: "Sign Offer Letter",
    meta: "Completed Oct 12, 2026",
    status: "complete" as const,
  },
  {
    id: "d2",
    title: "Complete W-4",
    meta: "Due Oct 30, 2026",
    status: "pending" as const,
  },
  {
    id: "d3",
    title: "Upload ID for I-9",
    meta: "No Deadline",
    status: "overdue" as const,
  },
];

const PENDING_ROWS = [
  { id: "p1", title: "Sign Offer Letter", meta: "Due in 5 days" },
  { id: "p2", title: "Complete W-4", meta: "Due in one month" },
  { id: "p3", title: "Upload ID for I-9", meta: "No Deadline" },
];

function DocIcon() {
  return (
    <span className="wb-emp-profile__doc-icon" aria-hidden>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M14 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V8l-6-6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function statusClass(status: (typeof DOC_ROWS)[number]["status"]) {
  if (status === "complete") return "wb-emp-profile__status wb-emp-profile__status--complete";
  if (status === "pending") return "wb-emp-profile__status wb-emp-profile__status--pending";
  return "wb-emp-profile__status wb-emp-profile__status--overdue";
}

function statusLabel(status: (typeof DOC_ROWS)[number]["status"]) {
  if (status === "complete") return "Complete";
  if (status === "pending") return "Pending";
  return "Overdue";
}

function splitDisplayName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { first: "there", last: "" };
  if (parts.length === 1) return { first: parts[0] ?? "there", last: "" };
  return { first: parts[0] ?? "there", last: parts.slice(1).join(" ") };
}

/** April 2024 starts on Monday; 30 days. */
const APRIL_2024 = { year: 2024, month: 4, days: 30, startWeekday: 1 } as const;

function MiniCalendarApril2024({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: number;
  onSelectDay: (d: number) => void;
}) {
  const labels = ["M", "T", "W", "T", "F", "S", "S"] as const;
  const cells: (number | null)[] = [];
  let d = 1;
  for (let i = 0; i < APRIL_2024.startWeekday - 1; i++) cells.push(null);
  while (d <= APRIL_2024.days) {
    cells.push(d);
    d += 1;
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="wb-emp-schedule__cal" aria-label="April 2024">
      <div className="wb-emp-schedule__cal-head">April 2024</div>
      <div className="wb-emp-schedule__cal-weekdays" role="row">
        {labels.map((L, i) => (
          <span key={`${L}-${i}`} className="wb-emp-schedule__cal-wd" role="columnheader">
            {L}
          </span>
        ))}
      </div>
      <div className="wb-emp-schedule__cal-grid" role="grid">
        {cells.map((day, idx) =>
          day == null ? (
            <span key={`e-${idx}`} className="wb-emp-schedule__cal-cell wb-emp-schedule__cal-cell--empty" />
          ) : (
            <button
              key={day}
              type="button"
              role="gridcell"
              className={`wb-emp-schedule__cal-cell${day === selectedDay ? " wb-emp-schedule__cal-cell--selected" : ""}`}
              onClick={() => onSelectDay(day)}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function ProfileReminderFold({ emp }: { emp: Employee }) {
  const { first, last } = splitDisplayName(emp.name);
  const [sendVia, setSendVia] = useState<"email" | "sms" | "app">("email");
  const [calDay, setCalDay] = useState(6);

  const message = `Hi ${first}, just a reminder to complete your W-4 form. Please make sure to fill it out and upload it as soon as possible. Let me know if you have any questions. Thank you!`;

  return (
    <section className="wb-emp-profile-fold" aria-labelledby="emp-fold-remind-heading">
      <h2 id="emp-fold-remind-heading" className="visually-hidden">
        Reminders and scheduling
      </h2>
      <div className="wb-emp-profile-fold__grid">
        <div className="wb-emp-remind">
          <header className="wb-emp-remind__head">
            <h3 className="wb-emp-remind__title">Complete Your W-4</h3>
            <p className="wb-emp-remind__sub">Reminder message preview</p>
          </header>
          <div className="wb-emp-remind__message">
            <p className="wb-emp-remind__message-text">{message}</p>
          </div>
          <div className="wb-emp-remind__w4" aria-label="W-4 form preview">
            <p className="wb-emp-remind__w4-label">W-4 Form</p>
            <dl className="wb-emp-remind__w4-fields">
              <div>
                <dt>First name</dt>
                <dd>{first}</dd>
              </div>
              <div>
                <dt>Last name</dt>
                <dd>{last || "—"}</dd>
              </div>
              <div>
                <dt>SSN (last 4)</dt>
                <dd>••••</dd>
              </div>
              <div>
                <dt>Filing status</dt>
                <dd>Single or married…</dd>
              </div>
            </dl>
          </div>
          <footer className="wb-emp-remind__via">
            <span className="wb-emp-remind__via-label">Send via</span>
            <div className="wb-emp-remind__via-pills" role="group" aria-label="Delivery method">
              {(
                [
                  { id: "email" as const, label: "Email" },
                  { id: "sms" as const, label: "SMS" },
                  { id: "app" as const, label: "App" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`wb-emp-remind__via-pill${sendVia === opt.id ? " wb-emp-remind__via-pill--active" : ""}`}
                  aria-pressed={sendVia === opt.id}
                  onClick={() => setSendVia(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </footer>
        </div>

        <div className="wb-emp-schedule">
          <div className="wb-emp-schedule__head">
            <span className="wb-emp-schedule__cal-ic" aria-hidden>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <rect
                  x="3.5"
                  y="5"
                  width="17"
                  height="15"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h3 className="wb-emp-schedule__title">Schedule Send</h3>
              <p className="wb-emp-schedule__lede">Pick date &amp; time</p>
            </div>
          </div>
          <MiniCalendarApril2024 selectedDay={calDay} onSelectDay={setCalDay} />
          <div className="wb-emp-schedule__fields">
            <label className="wb-emp-schedule__field">
              <span className="wb-emp-schedule__field-label">Date</span>
              <input
                type="text"
                readOnly
                className="wb-emp-schedule__input"
                value={`Apr ${calDay}, 2024`}
                aria-label="Selected date"
              />
            </label>
            <label className="wb-emp-schedule__field">
              <span className="wb-emp-schedule__field-label">Time</span>
              <input type="text" readOnly className="wb-emp-schedule__input" value="2:17 PM" aria-label="Time" />
            </label>
          </div>
          <div className="wb-emp-schedule__actions">
            <button type="button" className="wb-btn wb-btn--muted wb-emp-schedule__cancel">
              Cancel
            </button>
            <button type="button" className="wb-btn wb-emp-schedule__confirm">
              Schedule send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileHero({ emp }: { emp: Employee }) {
  const photo = getEmployeePortrait(emp);
  const email = getEmployeeEmail(emp);
  const phone = getEmployeePhone(emp);

  return (
    <section className="wb-emp-profile__hero" aria-labelledby="emp-profile-name">
      <img className="wb-emp-profile__photo" src={photo} width={120} height={120} alt="" />
      <div className="wb-emp-profile__hero-main">
        <h1 id="emp-profile-name" className="wb-emp-profile__name">
          {emp.name}
        </h1>
        <p className="wb-emp-profile__title">{emp.title}</p>
        <ul className="wb-emp-profile__contact">
          <li>
            <span className="wb-emp-profile__contact-ic" aria-hidden>
              ✉
            </span>
            <a href={`mailto:${email}`} className="wb-emp-profile__contact-link">
              {email}
            </a>
          </li>
          <li>
            <span className="wb-emp-profile__contact-ic" aria-hidden>
              ☎
            </span>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="wb-emp-profile__contact-link">
              {phone}
            </a>
          </li>
        </ul>
        <div className="wb-emp-profile__tags">
          <span
            className={`wb-emp-card__tag wb-emp-card__tag--dept${emp.departmentLabel === "Cashier" ? " wb-emp-card__tag--dept-cashier" : ""}`}
          >
            {emp.departmentLabel === "Kitchen" ? "Kitchen" : "Cashier"}
          </span>
          <span className="wb-emp-card__tag wb-emp-card__tag--contract">
            {CONTRACT_LABEL[emp.contract]}
          </span>
        </div>
      </div>
      <div className="wb-emp-profile__hero-actions">
        <button type="button" className="wb-btn wb-btn--primary wb-emp-profile__btn-remind">
          <span className="wb-emp-profile__btn-ic" aria-hidden>
            ➤
          </span>
          Send Reminder
        </button>
        <button type="button" className="wb-btn wb-btn--outline wb-emp-profile__btn-edit">
          <span className="wb-emp-profile__btn-ic" aria-hidden>
            ✎
          </span>
          Edit profile
        </button>
      </div>
    </section>
  );
}

export function EmployeeProfilePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [q, setQ] = useState("");

  const emp = useMemo(() => (employeeId ? getEmployeeById(employeeId) : undefined), [employeeId]);

  if (!employeeId || !emp) {
    return <Navigate to="/dashboard/employees" replace />;
  }

  const crumbs = (
    <nav className="wb-emp-profile__crumbs" aria-label="Breadcrumb">
      <Link to="/dashboard/employees" className="wb-emp-profile__crumb-link">
        Employee Portal
      </Link>
      <span className="wb-emp-profile__crumb-sep" aria-hidden>
        &gt;
      </span>
      <span className="wb-emp-profile__crumb-current">{emp.name}</span>
    </nav>
  );

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-emp-profile">
        <div className="wb-emp-profile__subbar">
          <Link
            to="/dashboard/employees"
            className="wb-emp-profile__back"
            aria-label="Back to Employee Portal"
          >
            <span aria-hidden>←</span>
          </Link>
          <label className="wb-emp-profile__search wb-hiring__search">
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
              placeholder="Search employee…"
              aria-label="Search employees"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>

        <ProfileHero emp={emp} />

        <div className="wb-emp-profile__split">
          <section className="wb-emp-profile__panel" aria-labelledby="emp-docs-heading">
            <header className="wb-emp-profile__panel-head">
              <h2 id="emp-docs-heading" className="wb-emp-profile__panel-title">
                Employee&apos;s Documents
              </h2>
              <button type="button" className="wb-emp-profile__panel-link">
                View all <span aria-hidden>→</span>
              </button>
            </header>
            <ul className="wb-emp-profile__doc-list">
              {DOC_ROWS.map((row) => (
                <li key={row.id} className="wb-emp-profile__doc-row">
                  <DocIcon />
                  <div className="wb-emp-profile__doc-body">
                    <span className="wb-emp-profile__doc-title">{row.title}</span>
                    <span className="wb-emp-profile__doc-meta">{row.meta}</span>
                  </div>
                  <span className={statusClass(row.status)}>{statusLabel(row.status)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="wb-emp-profile__panel" aria-labelledby="emp-pending-heading">
            <header className="wb-emp-profile__panel-head">
              <h2 id="emp-pending-heading" className="wb-emp-profile__panel-title">
                Pending Items
              </h2>
              <span className="wb-emp-profile__urgent">2 urgent</span>
            </header>
            <ul className="wb-emp-profile__pending-list">
              {PENDING_ROWS.map((row) => (
                <li key={row.id} className="wb-emp-profile__pending-row">
                  <div className="wb-emp-profile__pending-body">
                    <span className="wb-emp-profile__pending-title">{row.title}</span>
                    <span className="wb-emp-profile__pending-meta">{row.meta}</span>
                  </div>
                  <button type="button" className="wb-emp-profile__nudge" aria-label={`Send reminder for ${row.title}`}>
                    <span aria-hidden>➤</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <ProfileReminderFold emp={emp} />
      </div>
    </>
  );
}
