import { useMemo, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionCard from "../../components/SectionCard/SectionCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { useQa } from "../../context/QaContext";
import { defectStatuses, modules, severities } from "../../data/sampleData";
import "./DefectManagement.css";

export default function DefectManagement() {
  const { defects, updateDefectStatus } = useQa();
  const [severity, setSeverity] = useState("All");
  const [moduleName, setModuleName] = useState("All");
  const [query, setQuery] = useState("");

  const openLike = defects.filter((item) => ["Open", "In Progress", "Blocked"].includes(item.status));
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return defects.filter((item) => {
      const matchesSeverity = severity === "All" || item.severity === severity;
      const matchesModule = moduleName === "All" || item.module === moduleName;
      const matchesQuery = !needle
        || item.id.toLowerCase().includes(needle)
        || item.title.toLowerCase().includes(needle)
        || item.assignee.toLowerCase().includes(needle);
      return matchesSeverity && matchesModule && matchesQuery;
    });
  }, [defects, severity, moduleName, query]);

  const columns = [
    { key: "id", header: "Defect", render: (row) => <span className="id">{row.id}</span> },
    { key: "title", header: "Summary" },
    { key: "severity", header: "Severity", render: (row) => <StatusBadge status={row.severity} /> },
    { key: "module", header: "Module" },
    { key: "assignee", header: "Assignee" },
    { key: "linkedCase", header: "Case" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <select
          className="select select--compact"
          value={row.status}
          aria-label={`Status for ${row.id}`}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => updateDefectStatus(row.id, event.target.value)}
        >
          {defectStatuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      ),
    },
  ];

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Defect backlog"
        title="Defect management"
        description="Triage open issues against the cases that found them. Status changes are kept for this session."
      />

      <div className="summary-strip">
        <article><span>Open backlog</span><strong>{openLike.length}</strong></article>
        <article><span>Critical still open</span><strong>{openLike.filter((item) => item.severity === "Critical").length}</strong></article>
        <article><span>Resolved or closed</span><strong>{defects.length - openLike.length}</strong></article>
        <article><span>All defects</span><strong>{defects.length}</strong></article>
      </div>

      <SectionCard title="Backlog" subtitle={`Showing ${filtered.length} defects`}>
        <div className="toolbar defect-filters">
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search id, summary, or assignee"
            aria-label="Search defects"
          />
          <select className="select" value={moduleName} aria-label="Module" onChange={(event) => setModuleName(event.target.value)}>
            <option value="All">All modules</option>
            {modules.map((item) => <option key={item}>{item}</option>)}
          </select>
          <div className="chip-row" role="group" aria-label="Severity">
            {["All", ...severities].map((item) => (
              <button
                key={item}
                type="button"
                className={`chip${severity === item ? " is-active" : ""}`}
                onClick={() => setSeverity(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(row) => row.id}
          emptyMessage="No defects match these filters."
        />
      </SectionCard>
    </div>
  );
}
