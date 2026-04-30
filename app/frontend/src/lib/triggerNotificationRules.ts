const STORAGE_KEY = "workbench_hr_trigger_notification_rules";

export type NotificationChannels = {
  push: boolean;
  email: boolean;
  googleCalendar: boolean;
};

export type TriggerNotificationRule = {
  id: string;
  title: string;
  taskKey: string;
  taskLabel: string;
  assigneeId: string;
  assigneeName: string;
  channels: NotificationChannels;
  updatedAt: string;
};

function uid(): string {
  return `tn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_RULES: TriggerNotificationRule[] = [
  {
    id: "tn-seed-1",
    title: "Certification expiring — kitchen leads",
    taskKey: "compliance",
    taskLabel: "Compliance / training renewal",
    assigneeId: "e2",
    assigneeName: "Adam Benson",
    channels: { push: true, email: true, googleCalendar: false },
    updatedAt: "Apr 20, 2026",
  },
  {
    id: "tn-seed-2",
    title: "New hire packet incomplete",
    taskKey: "onboarding",
    taskLabel: "Onboarding documents",
    assigneeId: "e3",
    assigneeName: "Pauline Thomas",
    channels: { push: true, email: false, googleCalendar: true },
    updatedAt: "Apr 18, 2026",
  },
];

function parseRules(raw: unknown): TriggerNotificationRule[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((r): r is TriggerNotificationRule => {
    if (!r || typeof r !== "object") return false;
    const o = r as Record<string, unknown>;
    const ch = o.channels as Record<string, unknown> | undefined;
    return (
      typeof o.id === "string" &&
      typeof o.title === "string" &&
      typeof o.taskKey === "string" &&
      typeof o.taskLabel === "string" &&
      typeof o.assigneeId === "string" &&
      typeof o.assigneeName === "string" &&
      typeof o.updatedAt === "string" &&
      ch != null &&
      typeof ch.push === "boolean" &&
      typeof ch.email === "boolean" &&
      typeof ch.googleCalendar === "boolean"
    );
  });
}

export function getTriggerNotificationRules(): TriggerNotificationRule[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) return [...DEFAULT_RULES];
    const parsed = JSON.parse(raw) as unknown;
    return parseRules(parsed);
  } catch {
    return [...DEFAULT_RULES];
  }
}

export function saveTriggerNotificationRules(rules: TriggerNotificationRule[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch {
    /* private mode */
  }
}

export function createRuleId(): string {
  return uid();
}
