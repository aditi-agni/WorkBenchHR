const STORAGE_KEY = "workbench_hr_document_library";

/** Session-scoped list of “uploaded” file names (demo; replace with API later). */
export function saveUploadedDocuments(filenames: string[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filenames));
  } catch {
    /* private mode */
  }
}

export function getUploadedDocuments(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
