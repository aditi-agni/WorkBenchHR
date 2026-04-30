/** Set when user finishes onboarding training so the dashboard sidebar can show the DNA sync widget. */
export const WB_DNA_SYNC_WIDGET_KEY = "workbench_hr_dna_sync_training";

export function setDnaSyncWidgetPending(): void {
  try {
    localStorage.setItem(WB_DNA_SYNC_WIDGET_KEY, "1");
  } catch {
    /* private mode / quota */
  }
}

export function clearDnaSyncWidgetPending(): void {
  try {
    localStorage.removeItem(WB_DNA_SYNC_WIDGET_KEY);
  } catch {
    /* ignore */
  }
}

export function isDnaSyncWidgetPending(): boolean {
  try {
    return localStorage.getItem(WB_DNA_SYNC_WIDGET_KEY) === "1";
  } catch {
    return false;
  }
}
