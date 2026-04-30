import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { assetPath } from "../lib/assetPath";

const DOC_REMINDER_OPTIONS = [
  { id: "1h", label: "In 1 hour" },
  { id: "tomorrow", label: "Tomorrow, 9:00 AM" },
  { id: "3d", label: "In 3 days" },
  { id: "nextweek", label: "Next Monday, 9:00 AM" },
] as const;

function RemindLaterModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="wb-dash-reminder" role="presentation">
      <button type="button" className="wb-dash-reminder__backdrop" onClick={onClose} aria-label="Close" />
      <div
        className="wb-dash-reminder__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dash-doc-reminder-title"
      >
        <div className="wb-dash-reminder__head">
          <h2 className="wb-dash-reminder__title" id="dash-doc-reminder-title">
            Remind me later
          </h2>
          <button type="button" className="wb-dash-reminder__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <p className="wb-dash-reminder__lede">
          Choose when you&apos;d like a nudge about signing these documents.
        </p>
        <ul className="wb-dash-reminder__options">
          {DOC_REMINDER_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                className="wb-dash-reminder__option"
                onClick={() => {
                  onSelect(opt.label);
                  onClose();
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="wb-dash-reminder__cancel wb-btn wb-btn--muted" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

const ONBOARDING_MORE_ACTIONS = [
  { id: "checklist", label: "View onboarding checklist", message: "Checklist would open in a full view." },
  { id: "assign", label: "Assign to another manager", message: "Reassignment picker would open here." },
  { id: "note", label: "Log follow-up note", message: "Note composer would open here." },
  { id: "snooze", label: "Snooze reminder 1 week", message: "Onboarding reminder snoozed for 7 days." },
] as const;

const NUDGE_EMPLOYEES = [
  { id: "jc", name: "Jessica Christie", hint: "Onboarding — missing tax & direct deposit" },
  { id: "ml", name: "Marcus Lee", hint: "Offer letter pending" },
  { id: "pp", name: "Priya Patel", hint: "NDA pending" },
] as const;

type NudgeWhen = "now" | "1h" | "tomorrow" | "custom";

function SendNudgeModal({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: (message: string) => void;
}) {
  const [employeeId, setEmployeeId] = useState<(typeof NUDGE_EMPLOYEES)[number]["id"]>("jc");
  const [when, setWhen] = useState<NudgeWhen>("now");
  const [customDt, setCustomDt] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setEmployeeId("jc");
    setWhen("now");
    setCustomDt("");
    setNote("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (when === "custom" && !customDt.trim()) return;
    const emp = NUDGE_EMPLOYEES.find((x) => x.id === employeeId)?.name ?? "Employee";
    let whenPhrase = "right away";
    if (when === "1h") whenPhrase = "in about 1 hour";
    else if (when === "tomorrow") whenPhrase = "tomorrow at 9:00 AM";
    else if (when === "custom" && customDt.trim()) {
      try {
        whenPhrase = `on ${new Date(customDt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`;
      } catch {
        whenPhrase = "at your chosen time";
      }
    }
    const tail = note.trim() ? ` Note: “${note.trim().slice(0, 120)}${note.trim().length > 120 ? "…" : ""}”.` : "";
    onSent(`Nudge for ${emp} is scheduled ${whenPhrase}.${tail}`);
    onClose();
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="wb-dash-reminder" role="presentation">
      <button type="button" className="wb-dash-reminder__backdrop" onClick={onClose} aria-label="Close" />
      <div
        className="wb-dash-reminder__panel wb-dash-nudge"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dash-nudge-title"
      >
        <div className="wb-dash-reminder__head">
          <h2 className="wb-dash-reminder__title" id="dash-nudge-title">
            Send nudge
          </h2>
          <button type="button" className="wb-dash-reminder__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <p className="wb-dash-reminder__lede">
          Pick who should get the reminder and when it should go out. This is a preview — nothing is sent
          for real yet.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="wb-dash-nudge__field">
            <label className="wb-dash-nudge__label" htmlFor="dash-nudge-employee">
              Employee
            </label>
            <select
              id="dash-nudge-employee"
              className="wb-dash-nudge__select"
              value={employeeId}
              onChange={(ev) => setEmployeeId(ev.target.value as (typeof NUDGE_EMPLOYEES)[number]["id"])}
            >
              {NUDGE_EMPLOYEES.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.hint}
                </option>
              ))}
            </select>
          </div>

          <div className="wb-dash-nudge__field">
            <span className="wb-dash-nudge__label" id="dash-nudge-when-label">
              When to send
            </span>
            <div className="wb-dash-nudge__radios" role="group" aria-labelledby="dash-nudge-when-label">
              {(
                [
                  ["now", "Send now"],
                  ["1h", "In 1 hour"],
                  ["tomorrow", "Tomorrow, 9:00 AM"],
                  ["custom", "Pick date & time"],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className="wb-dash-nudge__radio">
                  <input
                    type="radio"
                    name="dash-nudge-when"
                    value={id}
                    checked={when === id}
                    onChange={() => setWhen(id)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {when === "custom" ? (
              <input
                id="dash-nudge-custom-dt"
                type="datetime-local"
                className="wb-dash-nudge__input"
                value={customDt}
                onChange={(ev) => setCustomDt(ev.target.value)}
                required
                aria-label="Custom date and time"
              />
            ) : null}
          </div>

          <div className="wb-dash-nudge__field">
            <label className="wb-dash-nudge__label" htmlFor="dash-nudge-note">
              Optional note <span className="wb-dash-nudge__optional">(included in the nudge)</span>
            </label>
            <textarea
              id="dash-nudge-note"
              className="wb-dash-nudge__textarea"
              rows={3}
              maxLength={500}
              placeholder="e.g. Please finish Section 2 of onboarding by Friday."
              value={note}
              onChange={(ev) => setNote(ev.target.value)}
            />
          </div>

          <div className="wb-dash-nudge__actions">
            <button type="button" className="wb-btn wb-btn--muted wb-dash-nudge__btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="wb-dash-home__btn-dark wb-dash-nudge__btn-primary">
              Schedule nudge
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

type HireSeg = "full" | "ring" | "empty";
type PipelineTab = "active" | "paused" | "closed";
type UpcomingRange = "7" | "30";

type UpcomingTag = {
  label: string;
  tone: "onboarding" | "review" | "birthday" | "anniversary" | "heads-up";
};

const HIRING_ACTIVE: {
  title: string;
  meta: string;
  status: string;
  segments: HireSeg[];
}[] = [
  {
    title: "Head Chef",
    meta: "12 applicants · Posted 9 days ago",
    status: "Interviews · 3 scheduled",
    segments: ["full", "full", "full", "ring", "empty"],
  },
  {
    title: "Cashier · Morning shift",
    meta: "28 applicants · Posted 14 days ago",
    status: "Offer sent · Awaiting reply",
    segments: ["full", "full", "full", "full", "ring"],
  },
  {
    title: "Cashier · Evening shift",
    meta: "19 applicants · Posted 11 days ago",
    status: "Screening · 7 to review",
    segments: ["full", "ring", "empty", "empty", "empty"],
  },
  {
    title: "Kitchen Staff",
    meta: "6 applicants · Posted 3 days ago",
    status: "Posted · Collecting apps",
    segments: ["full", "empty", "empty", "empty", "empty"],
  },
];

const UPCOMING_7: {
  mo: string;
  day: string;
  title: string;
  tags: UpcomingTag[];
  sub: string;
}[] = [
  {
    mo: "Apr",
    day: "22",
    title: "Marcus Lee starts",
    tags: [{ label: "Onboarding", tone: "onboarding" }],
    sub: "First day — checklist ready",
  },
  {
    mo: "Apr",
    day: "24",
    title: "Andre Silva's review",
    tags: [{ label: "90-day", tone: "review" }],
    sub: "Friday, 2:00 PM",
  },
  {
    mo: "Apr",
    day: "26",
    title: "Carlos Rivera's birthday",
    tags: [{ label: "Birthday", tone: "birthday" }],
    sub: "Sunday",
  },
  {
    mo: "Apr",
    day: "27",
    title: "Maria Lopez — 2 years",
    tags: [{ label: "Anniversary", tone: "anniversary" }],
    sub: "Send a note?",
  },
  {
    mo: "Apr",
    day: "28",
    title: "Coverage gap — Kitchen",
    tags: [{ label: "Heads up", tone: "heads-up" }],
    sub: "2 people out same day",
  },
];

const UPCOMING_EXTRA_30: typeof UPCOMING_7 = [
  {
    mo: "May",
    day: "02",
    title: "PTO requests due",
    tags: [{ label: "Heads up", tone: "heads-up" }],
    sub: "3 drafts waiting on you",
  },
  {
    mo: "May",
    day: "05",
    title: "Spring job fair follow-up",
    tags: [{ label: "Recruiting", tone: "review" }],
    sub: "12 leads from Saturday booth",
  },
];

function segmentClass(seg: HireSeg): string {
  if (seg === "full") return "wb-dash-hire-progress__seg wb-dash-hire-progress__seg--full";
  if (seg === "ring") return "wb-dash-hire-progress__seg wb-dash-hire-progress__seg--ring";
  return "wb-dash-hire-progress__seg";
}

export function DashboardPage() {
  const [pipelineTab, setPipelineTab] = useState<PipelineTab>("active");
  const [upcomingRange, setUpcomingRange] = useState<UpcomingRange>("7");
  const [docReminderOpen, setDocReminderOpen] = useState(false);
  const [docReminderFeedback, setDocReminderFeedback] = useState<string | null>(null);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [nudgeFeedback, setNudgeFeedback] = useState<string | null>(null);
  const [onboardingMenuOpen, setOnboardingMenuOpen] = useState(false);
  const [moreMenuFeedback, setMoreMenuFeedback] = useState<string | null>(null);
  const onboardingMenuRef = useRef<HTMLDivElement>(null);

  const onDocReminderSelect = useCallback((label: string) => {
    setDocReminderFeedback(`Reminder set: we’ll nudge you ${label.toLowerCase()}.`);
    window.setTimeout(() => setDocReminderFeedback(null), 5000);
  }, []);

  const onNudgeSent = useCallback((message: string) => {
    setNudgeFeedback(message);
    window.setTimeout(() => setNudgeFeedback(null), 6000);
  }, []);

  const onMoreMenuAction = useCallback((message: string) => {
    setOnboardingMenuOpen(false);
    setMoreMenuFeedback(message);
    window.setTimeout(() => setMoreMenuFeedback(null), 5500);
  }, []);

  useEffect(() => {
    if (!onboardingMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = onboardingMenuRef.current;
      if (!root || root.contains(e.target as Node)) return;
      setOnboardingMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOnboardingMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [onboardingMenuOpen]);

  const upcomingRows =
    upcomingRange === "7" ? UPCOMING_7 : [...UPCOMING_7, ...UPCOMING_EXTRA_30];

  return (
    <>
      <WorkspaceHeader title="Dashboard" />

      <section className="wb-dash-home" aria-labelledby="dash-needs-heading">
          <div className="wb-dash-home__needs-head">
            <span className="wb-dash-home__needs-count" aria-hidden>
              3
            </span>
            <h2 className="wb-dash-home__needs-title" id="dash-needs-heading">
              Needs Attention
            </h2>
          </div>

          <div className="wb-dash-home__needs-grid">
            <article className="wb-dash-card wb-dash-card--attention">
              <div className="wb-dash-card__icon wb-dash-card__icon--doc" aria-hidden>
                <img
                  src={assetPath("/dashboard/D1.png")}
                  alt=""
                  width={22}
                  height={22}
                  className="wb-dash-card__icon-img"
                  decoding="async"
                />
              </div>
              <div className="wb-dash-card__body">
                <div className="wb-dash-card__row-title">
                  <h3 className="wb-dash-card__headline">2 documents pending signature</h3>
                  <span className="wb-dash-card__tag wb-dash-card__tag--urgent">Due today</span>
                </div>
                <p className="wb-dash-card__sub">
                  Marcus Lee&apos;s offer letter and Priya Patel&apos;s NDA need your signature before
                  EOD.
                </p>
                <div className="wb-dash-card__actions">
                  <Link to="/dashboard/sign-documents" className="wb-dash-home__btn-dark wb-dash-home__btn-dark--link">
                    Sign now <span aria-hidden>→</span>
                  </Link>
                  <button
                    type="button"
                    className="wb-dash-card__icon-btn wb-dash-card__icon-btn--clock"
                    aria-label="Set reminder for later"
                    aria-expanded={docReminderOpen}
                    aria-haspopup="dialog"
                    onClick={() => setDocReminderOpen(true)}
                  >
                    <img
                      src={assetPath("/dashboard/clock.PNG")}
                      alt=""
                      width={18}
                      height={18}
                      className="wb-dash-card__clock-img"
                      decoding="async"
                    />
                  </button>
                </div>
                {docReminderFeedback ? (
                  <p className="wb-dash-card__feedback" role="status">
                    {docReminderFeedback}
                  </p>
                ) : null}
              </div>
            </article>

            <RemindLaterModal
              open={docReminderOpen}
              onClose={() => setDocReminderOpen(false)}
              onSelect={onDocReminderSelect}
            />

            <article className="wb-dash-card wb-dash-card--attention">
              <div className="wb-dash-card__icon wb-dash-card__icon--user" aria-hidden>
                <img
                  src={assetPath("/dashboard/d2.png")}
                  alt=""
                  width={22}
                  height={22}
                  className="wb-dash-card__icon-img"
                  decoding="async"
                />
              </div>
              <div className="wb-dash-card__body">
                <h3 className="wb-dash-card__headline">1 onboarding incomplete</h3>
                <p className="wb-dash-card__sub">
                  Jessica Christie started 4 days ago, still missing tax forms and direct deposit info.
                </p>
                <div className="wb-dash-card__actions">
                  <button
                    type="button"
                    className="wb-dash-home__btn-dark"
                    aria-expanded={nudgeOpen}
                    aria-haspopup="dialog"
                    onClick={() => setNudgeOpen(true)}
                  >
                    Send nudge
                  </button>
                  <div className="wb-dash-card__menu-anchor" ref={onboardingMenuRef}>
                    <button
                      type="button"
                      className="wb-dash-card__icon-btn"
                      id="dash-onboarding-more-btn"
                      aria-label="More options"
                      aria-expanded={onboardingMenuOpen}
                      aria-haspopup="true"
                      aria-controls="dash-onboarding-more-menu"
                      onClick={() => setOnboardingMenuOpen((o) => !o)}
                    >
                      <span aria-hidden>⋯</span>
                    </button>
                    {onboardingMenuOpen ? (
                      <div
                        className="wb-dash-card__menu"
                        id="dash-onboarding-more-menu"
                        role="menu"
                        aria-labelledby="dash-onboarding-more-btn"
                      >
                        {ONBOARDING_MORE_ACTIONS.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            role="menuitem"
                            className="wb-dash-card__menu-item"
                            onClick={() => onMoreMenuAction(a.message)}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                {nudgeFeedback ? (
                  <p className="wb-dash-card__feedback" role="status">
                    {nudgeFeedback}
                  </p>
                ) : null}
                {moreMenuFeedback ? (
                  <p className="wb-dash-card__feedback" role="status">
                    {moreMenuFeedback}
                  </p>
                ) : null}
              </div>
            </article>

            <SendNudgeModal open={nudgeOpen} onClose={() => setNudgeOpen(false)} onSent={onNudgeSent} />
          </div>
      </section>

      <section className="wb-dash-home wb-dash-home--overview" aria-labelledby="dash-overview-heading">
          <h2 className="wb-dash-home__overview-title" id="dash-overview-heading">
            Overview
          </h2>
          <div className="wb-dash-home__stat-grid">
            <article className="wb-dash-stat">
              <div className="wb-dash-stat__top">
                <span className="wb-dash-stat__label">Active employees</span>
                <span className="wb-dash-stat__pill wb-dash-stat__pill--up">+3 this month</span>
              </div>
              <p className="wb-dash-stat__value">21</p>
              <svg className="wb-dash-stat__spark" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden>
                <path
                  d="M0 28 L20 24 L40 26 L60 14 L80 18 L100 8 L120 4"
                  fill="none"
                  stroke="var(--dash-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="wb-dash-stat__foot">14 full-time · 5 part-time · 2 interns</p>
            </article>

            <article className="wb-dash-stat">
              <div className="wb-dash-stat__top">
                <span className="wb-dash-stat__label">Active job listings</span>
              </div>
              <p className="wb-dash-stat__value">4</p>
              <p className="wb-dash-stat__hint">2 new applicants today.</p>
              <p className="wb-dash-stat__foot">Head Chef · 2 Cashiers · Kitchen Staff</p>
            </article>

            <article className="wb-dash-stat">
              <div className="wb-dash-stat__top">
                <span className="wb-dash-stat__label">Avg. time to hire</span>
                <span className="wb-dash-stat__pill wb-dash-stat__pill--up">
                  <span aria-hidden>↓</span> 4 days faster
                </span>
              </div>
              <p className="wb-dash-stat__value">18 days</p>
              <p className="wb-dash-stat__foot">Industry benchmark: 24 days</p>
            </article>

            <article className="wb-dash-stat">
              <div className="wb-dash-stat__top">
                <span className="wb-dash-stat__label">Upcoming time off</span>
                <span className="wb-dash-stat__pill wb-dash-stat__pill--alert">Coverage gap Apr 28</span>
              </div>
              <p className="wb-dash-stat__value">7</p>
              <p className="wb-dash-stat__foot">3 pending · 4 approved this week</p>
            </article>
          </div>
      </section>

      <section className="wb-dash-panel" aria-labelledby="dash-hiring-heading">
          <div className="wb-dash-panel__head">
            <h2 className="wb-dash-panel__title" id="dash-hiring-heading">
              Hiring pipeline
            </h2>
            <div
              className="wb-dash-segments"
              role="group"
              aria-label="Listing status"
            >
              {(
                [
                  ["active", "Active"],
                  ["paused", "Paused"],
                  ["closed", "Closed"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`wb-dash-segments__btn${pipelineTab === id ? " wb-dash-segments__btn--active" : ""}`}
                  aria-pressed={pipelineTab === id}
                  onClick={() => setPipelineTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {pipelineTab === "active" ? (
            <div className="wb-dash-hire-list">
              {HIRING_ACTIVE.map((job) => (
                <article key={job.title} className="wb-dash-hire-row">
                  <h3 className="wb-dash-hire-row__title">{job.title}</h3>
                  <p className="wb-dash-hire-row__meta">{job.meta}</p>
                  <div className="wb-dash-hire-progress" aria-hidden>
                    {job.segments.map((seg, i) => (
                      <span key={i} className={segmentClass(seg)} />
                    ))}
                  </div>
                  <p className="wb-dash-hire-row__status">{job.status}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="wb-dash-panel__empty">
              No {pipelineTab} listings right now. Active roles appear when you post or reopen a job.
            </p>
          )}
      </section>

      <section className="wb-dash-panel" aria-labelledby="dash-upcoming-heading">
          <div className="wb-dash-panel__head">
            <h2 className="wb-dash-panel__title" id="dash-upcoming-heading">
              Upcoming
            </h2>
            <div
              className="wb-dash-segments"
              role="group"
              aria-label="Date range"
            >
              <button
                type="button"
                className={`wb-dash-segments__btn${upcomingRange === "7" ? " wb-dash-segments__btn--active" : ""}`}
                aria-pressed={upcomingRange === "7"}
                onClick={() => setUpcomingRange("7")}
              >
                7 days
              </button>
              <button
                type="button"
                className={`wb-dash-segments__btn${upcomingRange === "30" ? " wb-dash-segments__btn--active" : ""}`}
                aria-pressed={upcomingRange === "30"}
                onClick={() => setUpcomingRange("30")}
              >
                30 days
              </button>
            </div>
          </div>

          <ul className="wb-dash-upcoming-list">
            {upcomingRows.map((row) => (
              <li key={`${row.mo}-${row.day}-${row.title}`} className="wb-dash-upcoming-row">
                <div className="wb-dash-upcoming-date" aria-hidden>
                  <span className="wb-dash-upcoming-date__mo">{row.mo}</span>
                  <span className="wb-dash-upcoming-date__day">{row.day}</span>
                </div>
                <div className="wb-dash-upcoming-body">
                  <h3 className="wb-dash-upcoming-row__title">{row.title}</h3>
                  <div className="wb-dash-upcoming-row__line">
                    {row.tags.map((t) => (
                      <span
                        key={t.label}
                        className={`wb-dash-upcoming-tag wb-dash-upcoming-tag--${t.tone}`}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                  <p className="wb-dash-upcoming-row__sub">{row.sub}</p>
                </div>
              </li>
            ))}
          </ul>
      </section>
    </>
  );
}
