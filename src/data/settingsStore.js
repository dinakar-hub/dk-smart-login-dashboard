export const defaultSettings = {
  workspace: "Northline Retail",
  environment: "UAT",
  timezone: "Asia/Kolkata",
  emailAlerts: true,
  requireEvidence: true,
  defectSla: "8",
  automationGate: "90",
};

const STORAGE_KEY = "meridian-qa-settings";

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
