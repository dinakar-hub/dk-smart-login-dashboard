import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "../../components/ChartTooltip/ChartTooltip";
import DataTable from "../../components/DataTable/DataTable";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionCard from "../../components/SectionCard/SectionCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { automationSuites, chartColors } from "../../data/sampleData";
import { loadSettings } from "../../data/settingsStore";
import "./AutomationReports.css";

export default function AutomationReports() {
  const gate = Number(loadSettings().automationGate) || 90;
  const [selectedId, setSelectedId] = useState(automationSuites[0].id);
  const selected = automationSuites.find((suite) => suite.id === selectedId);
  const belowGate = automationSuites.filter((suite) => suite.passRate < gate);

  const columns = [
    { key: "name", header: "Suite", render: (row) => <span className="id">{row.name}</span> },
    { key: "framework", header: "Framework" },
    { key: "passRate", header: "Pass rate", render: (row) => `${row.passRate}%` },
    { key: "failed", header: "Failed" },
    { key: "duration", header: "Duration" },
    {
      key: "gate",
      header: "Gate",
      render: (row) => <StatusBadge status={row.passRate >= gate ? "Passed" : "Failed"} />,
    },
  ];

  return (
    <div className="stack">
      <PageHeader
        eyebrow="release/4.2 nightly"
        title="Automation reports"
        description={`Suites under ${gate}% are outside the workspace gate. Change the gate in Settings and come back to this view.`}
      />

      <div className="summary-strip">
        <article><span>Suites</span><strong>{automationSuites.length}</strong></article>
        <article><span>Below gate</span><strong>{belowGate.length}</strong></article>
        <article><span>Gate</span><strong>{gate}%</strong></article>
        <article><span>Branch</span><strong className="summary-build">release/4.2</strong></article>
      </div>

      <div className="grid-2">
        <SectionCard title="Pass rate by suite" subtitle="Latest nightly run">
          <div className="chart-frame chart-frame--auto">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={automationSuites} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
                <CartesianGrid stroke="#e6edf4" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#5c6e82", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#3d516b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(12, 35, 64, 0.04)" }} />
                <Bar dataKey="passRate" name="Pass rate" fill={chartColors.teal} radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={selected.name} subtitle={`${selected.framework} · ${selected.branch}`}>
          <dl className="suite-facts">
            <div><dt>Pass rate</dt><dd>{selected.passRate}%</dd></div>
            <div><dt>Passed</dt><dd>{selected.passed}</dd></div>
            <div><dt>Failed</dt><dd>{selected.failed}</dd></div>
            <div><dt>Duration</dt><dd>{selected.duration}</dd></div>
            <div><dt>Last run</dt><dd>{selected.lastRun}</dd></div>
            <div><dt>Against gate</dt><dd>{selected.passRate >= gate ? "Meets gate" : `${gate - selected.passRate} pts under`}</dd></div>
          </dl>
        </SectionCard>
      </div>

      <SectionCard title="Suite register" subtitle="Select a suite to inspect the nightly result">
        <DataTable
          columns={columns}
          rows={automationSuites}
          getRowId={(row) => row.id}
          activeId={selectedId}
          onRowClick={(row) => setSelectedId(row.id)}
          emptyMessage="No suites available."
        />
      </SectionCard>
    </div>
  );
}
