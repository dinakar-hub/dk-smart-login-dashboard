import { useMemo, useState } from "react";
import { Ban, CircleCheck, CircleX, ClipboardList, Gauge } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import ChartTooltip from "../../components/ChartTooltip/ChartTooltip";
import SectionCard from "../../components/SectionCard/SectionCard";
import StatCard from "../../components/StatCard/StatCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { useQa } from "../../context/QaContext";
import {
  activities,
  chartColors,
  currentUser,
  defectStats,
  portfolio,
  release,
} from "../../data/sampleData";
import { executionStats, formatNumber, formatPercent, greetingForHour } from "../../utils/format";
import "./Dashboard.css";

const filters = ["All", "Passed", "Failed", "Blocked"];

export default function Dashboard() {
  const { cases } = useQa();
  const [filter, setFilter] = useState("All");
  const stats = executionStats(portfolio);
  const greeting = greetingForHour();
  const critical = defectStats.reduce((sum, row) => sum + row.critical, 0);

  const pieData = [
    { name: "Passed", value: portfolio.passed, color: chartColors.passed },
    { name: "Failed", value: portfolio.failed, color: chartColors.failed },
    { name: "Blocked", value: portfolio.blocked, color: chartColors.blocked },
    { name: "Not Run", value: portfolio.notRun, color: chartColors.notRun },
  ];

  const visibleActivity = activities.filter((item) => filter === "All" || item.result === filter);
  const attention = useMemo(
    () => cases.filter((item) => item.status === "Failed" || item.status === "Blocked"),
    [cases],
  );

  return (
    <div className="dashboard">
      <section className="welcome">
        <div>
          <p className="welcome__eyebrow">{release.name} · {release.theme}</p>
          <h2>{greeting}, {currentUser.name.split(" ")[0]}.</h2>
          <p className="welcome__copy">
            {formatPercent(stats.executionPercent)} of the release portfolio has been executed.
            {" "}{formatNumber(portfolio.failed)} failed cases and {critical} critical defects still
            need a decision before the {release.exitDate} UAT exit.
          </p>
          <div className="welcome__facts">
            <span>{release.sprint}</span>
            <span>{release.environment}</span>
            <span>Exit {release.exitDate}</span>
          </div>
        </div>
        <div className="welcome__meter" aria-label={`Execution ${formatPercent(stats.executionPercent)}`}>
          <strong>{formatPercent(stats.executionPercent)}</strong>
          <span>Execution coverage</span>
          <div className="progress" role="progressbar" aria-valuenow={stats.executionPercent} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${stats.executionPercent}%` }} />
          </div>
          <small>Pass rate of executed cases {formatPercent(stats.passRate)}</small>
        </div>
      </section>

      <section className="stats" aria-label="Release portfolio">
        <StatCard
          tone="total"
          icon={ClipboardList}
          label="Total test cases"
          value={formatNumber(portfolio.total)}
          meta="Planned for Release 4.2"
          to="/test-management"
        />
        <StatCard
          tone="passed"
          icon={CircleCheck}
          label="Passed"
          value={formatNumber(portfolio.passed)}
          meta={`${formatPercent(stats.passRate)} of executed cases`}
          to="/test-management?status=Passed"
        />
        <StatCard
          tone="failed"
          icon={CircleX}
          label="Failed"
          value={formatNumber(portfolio.failed)}
          meta="Needs triage or a retest"
          to="/test-management?status=Failed"
        />
        <StatCard
          tone="blocked"
          icon={Ban}
          label="Blocked"
          value={formatNumber(portfolio.blocked)}
          meta="Waiting on environment or defect"
          to="/test-management?status=Blocked"
        />
        <StatCard
          tone="execution"
          icon={Gauge}
          label="Test execution"
          value={formatPercent(stats.executionPercent)}
          meta={`${formatNumber(stats.executed)} of ${formatNumber(portfolio.total)} have a result`}
          to="/test-execution"
        />
      </section>

      <section className="dashboard__charts">
        <SectionCard
          title="Test execution"
          subtitle="How the Release 4.2 portfolio is distributed"
        >
          <div className="donut">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={96}
                  paddingAngle={2}
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut__center">
              <strong>{formatPercent(stats.executionPercent)}</strong>
              <span>Executed</span>
            </div>
          </div>
          <ul className="legend">
            {pieData.map((entry) => (
              <li key={entry.name}>
                <i style={{ background: entry.color }} />
                <span>{entry.name}</span>
                <strong>{formatNumber(entry.value)}</strong>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Defect statistics"
          subtitle="Open defects by module and severity"
        >
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={defectStats} barSize={28} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#e6edf4" vertical={false} />
                <XAxis dataKey="module" tick={{ fill: "#5c6e82", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5c6e82", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(12, 35, 64, 0.04)" }} />
                <Bar dataKey="critical" name="Critical" stackId="defects" fill={chartColors.critical} />
                <Bar dataKey="high" name="High" stackId="defects" fill={chartColors.high} />
                <Bar dataKey="medium" name="Medium" stackId="defects" fill={chartColors.medium} />
                <Bar dataKey="low" name="Low" stackId="defects" fill={chartColors.low} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="legend legend--inline">
            <li><i style={{ background: chartColors.critical }} /><span>Critical</span></li>
            <li><i style={{ background: chartColors.high }} /><span>High</span></li>
            <li><i style={{ background: chartColors.medium }} /><span>Medium</span></li>
            <li><i style={{ background: chartColors.low }} /><span>Low</span></li>
          </ul>
        </SectionCard>
      </section>

      <section className="dashboard__lower">
        <SectionCard
          title="Recent test execution"
          subtitle="Latest results recorded by the Sprint 18 squad"
          action={
            <div className="chip-row" role="group" aria-label="Filter activity">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip${filter === item ? " is-active" : ""}`}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <ActivityFeed items={visibleActivity} />
        </SectionCard>

        <SectionCard
          title="Needs a decision"
          subtitle="Sprint 18 cases that are failed or blocked"
        >
          <ul className="attention">
            {attention.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.id}</strong>
                  <p>{item.title}</p>
                  <span>{item.module} · {item.owner}</span>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>
    </div>
  );
}
