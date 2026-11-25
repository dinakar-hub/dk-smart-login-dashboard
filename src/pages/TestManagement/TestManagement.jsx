import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "../../components/DataTable/DataTable";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionCard from "../../components/SectionCard/SectionCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { useQa } from "../../context/QaContext";
import { caseStatuses, modules, release } from "../../data/sampleData";
import "./TestManagement.css";

export default function TestManagement() {
  const { cases, updateCaseStatus } = useQa();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "All");
  const [moduleName, setModuleName] = useState("All");
  const [selectedId, setSelectedId] = useState(cases[0]?.id ?? null);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
    setStatus(searchParams.get("status") ?? "All");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cases.filter((item) => {
      const matchesQuery = !query
        || item.id.toLowerCase().includes(query)
        || item.title.toLowerCase().includes(query)
        || item.owner.toLowerCase().includes(query);
      const matchesStatus = status === "All" || item.status === status;
      const matchesModule = moduleName === "All" || item.module === moduleName;
      return matchesQuery && matchesStatus && matchesModule;
    });
  }, [cases, search, status, moduleName]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];

  const columns = [
    { key: "id", header: "Case", width: "110px", render: (row) => <span className="id">{row.id}</span> },
    { key: "title", header: "Title" },
    { key: "module", header: "Module" },
    { key: "priority", header: "Priority", render: (row) => <StatusBadge status={row.priority} /> },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "owner", header: "Owner" },
  ];

  return (
    <div className="stack">
      <PageHeader
        eyebrow={`${release.sprint} scope`}
        title="Test repository"
        description="Priority cases for the current sprint. Portfolio totals on the dashboard include the full Release 4.2 set."
      />

      <SectionCard>
        <div className="toolbar">
          <input
            className="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by id, title, or owner"
            aria-label="Filter test cases"
          />
          <select className="select" value={moduleName} onChange={(event) => setModuleName(event.target.value)} aria-label="Module">
            <option value="All">All modules</option>
            {modules.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="select" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Status">
            <option value="All">All statuses</option>
            {caseStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <span className="result-count">Showing {filtered.length} of {cases.length}</span>
        </div>
      </SectionCard>

      <div className="management">
        <SectionCard title="Cases" subtitle="Select a row to review steps and record a status">
          <DataTable
            columns={columns}
            rows={filtered}
            getRowId={(row) => row.id}
            activeId={selected?.id}
            onRowClick={(row) => setSelectedId(row.id)}
            emptyMessage="No test cases match these filters."
          />
        </SectionCard>

        <SectionCard title={selected ? selected.id : "Case detail"} subtitle={selected?.title}>
          {selected ? (
            <div className="case-detail">
              <div className="case-detail__badges">
                <StatusBadge status={selected.status} />
                <StatusBadge status={selected.priority} />
                <span>{selected.type}</span>
              </div>
              <dl>
                <div><dt>Module</dt><dd>{selected.module}</dd></div>
                <div><dt>Owner</dt><dd>{selected.owner}</dd></div>
                <div><dt>Environment</dt><dd>{selected.environment}</dd></div>
                <div><dt>Last run</dt><dd>{selected.lastRun}</dd></div>
              </dl>
              <h3>Steps</h3>
              <ol>
                {selected.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <h3>Expected</h3>
              <p>{selected.expected}</p>
              <h3>Latest actual</h3>
              <p>{selected.actual}</p>
              <label className="case-detail__status">
                Update status
                <select
                  className="select"
                  value={selected.status}
                  onChange={(event) => updateCaseStatus(selected.id, event.target.value)}
                >
                  {caseStatuses.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          ) : (
            <p className="empty-note">Choose a different filter to see a case.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
