import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createRuleId,
  getTriggerNotificationRules,
  saveTriggerNotificationRules,
  type NotificationChannels,
  type TriggerNotificationRule,
} from "../lib/triggerNotificationRules";

const HR_TASKS = [
  { key: "review", label: "Performance review deadline" },
  { key: "compliance", label: "Compliance / training renewal" },
  { key: "onboarding", label: "Onboarding documents" },
  { key: "timeoff", label: "Time off & scheduling" },
  { key: "payroll", label: "Payroll & approvals" },
  { key: "policy", label: "Policy acknowledgment" },
] as const;

const ASSIGNEES = [
  {
    id: "e1",
    name: "Remi Wilkins",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: "e2",
    name: "Adam Benson",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: "e3",
    name: "Pauline Thomas",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: "e4",
    name: "Jordan Lee",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: "e5",
    name: "Morgan Ellis",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  },
] as const;

const DEFAULT_ASSIGNEE_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face";

function photoForAssigneeId(assigneeId: string): string {
  return ASSIGNEES.find((a) => a.id === assigneeId)?.photo ?? DEFAULT_ASSIGNEE_PHOTO;
}

function formatUpdated(): string {
  return new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function channelSummary(ch: NotificationChannels): string[] {
  const out: string[] = [];
  if (ch.push) out.push("Push");
  if (ch.email) out.push("Email");
  if (ch.googleCalendar) out.push("Calendar");
  return out.length > 0 ? out : ["None"];
}

export function SettingsTriggerNotificationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formId = useId();
  const [rules, setRules] = useState<TriggerNotificationRule[]>(() => getTriggerNotificationRules());
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [taskKey, setTaskKey] = useState<(typeof HR_TASKS)[number]["key"]>("review");
  const [assigneeId, setAssigneeId] = useState<(typeof ASSIGNEES)[number]["id"]>("e1");
  const [chPush, setChPush] = useState(true);
  const [chEmail, setChEmail] = useState(true);
  const [chCal, setChCal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const s = location.state as { fromOnboarding?: boolean } | null | undefined;
    if (s?.fromOnboarding) {
      setWelcomeOpen(true);
      navigate("/settings/trigger-notifications", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const persist = useCallback((next: TriggerNotificationRule[]) => {
    setRules(next);
    saveTriggerNotificationRules(next);
  }, []);

  const taskLabel = useMemo(
    () => HR_TASKS.find((t) => t.key === taskKey)?.label ?? taskKey,
    [taskKey],
  );
  const assigneeName = useMemo(
    () => ASSIGNEES.find((a) => a.id === assigneeId)?.name ?? "",
    [assigneeId],
  );

  const addRule = useCallback(() => {
    const t = title.trim();
    if (!t) {
      setFormError("Add a short name for this notification.");
      return;
    }
    if (!chPush && !chEmail && !chCal) {
      setFormError("Choose at least one delivery option: push, email, or Google Calendar.");
      return;
    }
    setFormError(null);
    const row: TriggerNotificationRule = {
      id: createRuleId(),
      title: t,
      taskKey,
      taskLabel,
      assigneeId,
      assigneeName,
      channels: { push: chPush, email: chEmail, googleCalendar: chCal },
      updatedAt: formatUpdated(),
    };
    persist([row, ...rules]);
    setTitle("");
    setChPush(true);
    setChEmail(true);
    setChCal(false);
  }, [title, taskKey, taskLabel, assigneeId, assigneeName, chPush, chEmail, chCal, rules, persist]);

  const removeRule = useCallback(
    (id: string) => {
      const row = rules.find((r) => r.id === id);
      if (!row) return;
      if (!window.confirm(`Remove notification “${row.title}”?`)) return;
      persist(rules.filter((r) => r.id !== id));
    },
    [rules, persist],
  );

  return (
    <div className="wb-roles-page">
      <div className="wb-roles-page__intro">
        <h1 className="wb-roles-page__title">Trigger notifications</h1>
        <p className="wb-roles-page__sub">
          Assign HR-related alerts to an employee and choose how they receive them: in-app push, email, or a Google
          Calendar invite (demo — stored in this browser only).
        </p>
      </div>

      <div className="wb-settings-triggers">
        {welcomeOpen ? (
          <div className="wb-settings-triggers__welcome" role="status">
            <p className="wb-settings-triggers__welcome-text">
              You&apos;re all set from onboarding — review or add notifications below. Workbench will route these to
              the assignee using the channels you pick.
            </p>
            <button type="button" className="wb-btn wb-btn--muted wb-settings-triggers__welcome-dismiss" onClick={() => setWelcomeOpen(false)}>
              Dismiss
            </button>
          </div>
        ) : null}

        <section className="wb-settings-triggers__panel" aria-labelledby={`${formId}-list-heading`}>
          <div className="wb-settings-triggers__panel-head">
            <h2 className="wb-settings-triggers__panel-title" id={`${formId}-list-heading`}>
              Active notifications
            </h2>
            <span className="wb-settings-triggers__count">{rules.length}</span>
          </div>

          {rules.length === 0 ? (
            <p className="wb-settings-triggers__empty">No notifications yet. Create one using the form below.</p>
          ) : (
            <ul className="wb-settings-triggers__list">
              {rules.map((r) => (
                <li key={r.id} className="wb-settings-triggers__card">
                  <img
                    className="wb-settings-triggers__avatar"
                    src={photoForAssigneeId(r.assigneeId)}
                    alt=""
                    width={48}
                    height={48}
                    decoding="async"
                  />
                  <div className="wb-settings-triggers__card-main">
                    <p className="wb-settings-triggers__card-title">{r.title}</p>
                    <p className="wb-settings-triggers__card-meta">
                      <span className="wb-settings-triggers__meta-label">Task</span> {r.taskLabel}
                    </p>
                    <p className="wb-settings-triggers__card-meta wb-settings-triggers__card-meta--assignee">
                      <span className="wb-settings-triggers__meta-label">Assignee</span>
                      <span className="wb-settings-triggers__assignee-name">{r.assigneeName}</span>
                    </p>
                    <p className="wb-settings-triggers__card-meta">
                      <span className="wb-settings-triggers__meta-label">Deliver via</span>{" "}
                      {channelSummary(r.channels).join(" · ")}
                    </p>
                    <p className="wb-settings-triggers__card-updated">Updated {r.updatedAt}</p>
                  </div>
                  <button type="button" className="wb-btn wb-btn--danger-outline wb-settings-triggers__delete" onClick={() => removeRule(r.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="wb-settings-triggers__panel wb-settings-triggers__panel--form" aria-labelledby={`${formId}-form-heading`}>
          <h2 className="wb-settings-triggers__panel-title" id={`${formId}-form-heading`}>
            Create notification
          </h2>
          <p className="wb-settings-triggers__form-lede">
            Pick an HR task type, assign someone responsible, and select how they should be nudged.
          </p>

          <div className="wb-settings-triggers__form-grid">
            <label className="wb-settings-triggers__field">
              <span className="wb-settings-triggers__label">Notification name</span>
              <input
                className="wb-settings-triggers__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. I-9 reverification due"
                autoComplete="off"
              />
            </label>

            <label className="wb-settings-triggers__field">
              <span className="wb-settings-triggers__label">HR task type</span>
              <select className="wb-settings-triggers__select" value={taskKey} onChange={(e) => setTaskKey(e.target.value as typeof taskKey)}>
                {HR_TASKS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="wb-settings-triggers__field wb-settings-triggers__field--full">
              <span className="wb-settings-triggers__label">Assign to employee</span>
              <select className="wb-settings-triggers__select" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value as typeof assigneeId)}>
                {ASSIGNEES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="wb-settings-triggers__field wb-settings-triggers__field--full wb-settings-triggers__channels">
              <legend className="wb-settings-triggers__label">Deliver as</legend>
              <div className="wb-settings-triggers__channel-row">
                <label className="wb-settings-triggers__check">
                  <input type="checkbox" checked={chPush} onChange={(e) => setChPush(e.target.checked)} />
                  <span>In-app push</span>
                </label>
                <label className="wb-settings-triggers__check">
                  <input type="checkbox" checked={chEmail} onChange={(e) => setChEmail(e.target.checked)} />
                  <span>Email</span>
                </label>
                <label className="wb-settings-triggers__check">
                  <input type="checkbox" checked={chCal} onChange={(e) => setChCal(e.target.checked)} />
                  <span>Google Calendar invite</span>
                </label>
              </div>
            </fieldset>
          </div>

          {formError ? <p className="wb-settings-triggers__error">{formError}</p> : null}

          <div className="wb-settings-triggers__form-actions">
            <button type="button" className="wb-btn wb-btn--primary" onClick={addRule}>
              Save notification
            </button>
            <Link to="/settings/profile" className="wb-btn wb-btn--outline">
              Back to profile
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
