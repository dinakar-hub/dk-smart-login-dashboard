import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "../../components/ChartTooltip/ChartTooltip";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionCard from "../../components/SectionCard/SectionCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { chartColors, reports, sprintTrend } from "../../data/sampleData";
import "./TestReports.css";

export default function TestReports() {
  const [activeId, setActiveId] = useState(reports[0].id);
  const active = reports.find((report) => report.id === activeId);

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Quality reporting"
        title="Test reports"
        description="Sprint pass rate and execution coverage for the last six sprints, plus the reports currently in circulation."
      />

      <SectionCard title="Pass rate and execution" subtitle="Percent of the sprint plan">
        <div className="chart-frame chart-frame--trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sprintTrend} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#e6edf4" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fill: "#5c6e82", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#5c6e82", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="passRate" name="Pass rate" stroke={chartColors.teal} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="execution" name="Execution" stroke={chartColors.navy} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="reports">
        <SectionCard title="Library">
          <ul className="report-list">
            {reports.map((report) => (
              <li key={report.id}>
                <button
                  type="button"
                  className={`report-card${report.id === active.id ? " is-active" : ""}`}
                  onClick={() => setActiveId(report.id)}
                >
                  <div>
                    <strong>{report.name}</strong>
                    <p>{report.type} · {report.updated}</p>
                  </div>
                  <StatusBadge status={report.status} />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={active.name} subtitle={`${active.owner} · updated ${active.updated}`}>
          <div className="report-rate">
            <strong>{active.passRate.toFixed(1)}%</strong>
            <span>Pass rate</span>
          </div>
          <p className="report-summary">{active.summary}</p>
          <StatusBadge status={active.status} />
        </SectionCard>
      </div>
    </div>
  );
}
