export const CELL_SIZE = 64;

const TAB_STORAGE_KEY = "capybara_tab_id";

function resolveTabId(): string {
  const windowRef = (globalThis as { window?: Window }).window;

  if (windowRef == null) {
    return "server";
  }

  const existing = windowRef.sessionStorage.getItem(TAB_STORAGE_KEY);
  if (existing !== null) {
    return existing;
  }

  const generated = crypto.randomUUID();
  windowRef.sessionStorage.setItem(TAB_STORAGE_KEY, generated);
  return generated;
}

// Unique identifier for this browser tab (used to prevent multi-tab conflicts)
export const TAB_ID = resolveTabId();
