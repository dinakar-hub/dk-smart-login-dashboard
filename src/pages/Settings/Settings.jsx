import { useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionCard from "../../components/SectionCard/SectionCard";
import { loadSettings, saveSettings } from "../../data/settingsStore";
import "./Settings.css";

export default function Settings() {
  const [form, setForm] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    saveSettings(form);
    setSaved(true);
  };

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="These preferences stay in this browser and drive the automation gate on the reports page."
      />

      <form className="settings" onSubmit={onSubmit}>
        <SectionCard title="Workspace" subtitle="Used on the header and report footers">
          <div className="settings__grid">
            <label>
              Workspace name
              <input className="input" value={form.workspace} onChange={(event) => update("workspace", event.target.value)} />
            </label>
            <label>
              Default environment
              <select className="select" value={form.environment} onChange={(event) => update("environment", event.target.value)}>
                <option>DEV</option>
                <option>QA</option>
                <option>UAT</option>
                <option>STAGING</option>
              </select>
            </label>
            <label>
              Timezone
              <select className="select" value={form.timezone} onChange={(event) => update("timezone", event.target.value)}>
                <option>Asia/Kolkata</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
              </select>
            </label>
            <label>
              Defect SLA (hours)
              <input
                className="input"
                type="number"
                min="1"
                max="72"
                value={form.defectSla}
                onChange={(event) => update("defectSla", event.target.value)}
              />
            </label>
            <label>
              Automation gate (%)
              <input
                className="input"
                type="number"
                min="50"
                max="100"
                value={form.automationGate}
                onChange={(event) => update("automationGate", event.target.value)}
              />
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Quality policy">
          <label className="toggle">
            <input
              type="checkbox"
              checked={form.emailAlerts}
              onChange={(event) => update("emailAlerts", event.target.checked)}
            />
            <span>Email the squad when a critical defect is opened</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={form.requireEvidence}
              onChange={(event) => update("requireEvidence", event.target.checked)}
            />
            <span>Require evidence before a failed case can be closed</span>
          </label>
        </SectionCard>

        <div className="settings__actions">
          <button type="submit" className="btn btn--primary">Save settings</button>
          {saved && <p role="status">Saved for {form.workspace}. The automation gate is now {form.automationGate}%.</p>}
        </div>
      </form>
    </div>
  );
}
