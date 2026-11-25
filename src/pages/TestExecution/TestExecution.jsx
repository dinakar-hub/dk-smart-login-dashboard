import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionCard from "../../components/SectionCard/SectionCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { useQa } from "../../context/QaContext";
import { caseStatuses, release, withRunStatus } from "../../data/sampleData";
import "./TestExecution.css";

export default function TestExecution() {
  const { runs, updateRunCase } = useQa();
  const prepared = useMemo(() => runs.map(withRunStatus), [runs]);
  const [activeId, setActiveId] = useState(prepared[0]?.id);
  const [note, setNote] = useState("");
  const active = prepared.find((run) => run.id === activeId) ?? prepared[0];

  const record = (caseId, result) => {
    updateRunCase(active.id, caseId, result);
    setNote(`${caseId} marked ${result}.`);
  };

  return (
    <div className="stack">
      <PageHeader
        eyebrow={`${release.sprint} · ${release.environment}`}
        title="Execution board"
        description="Record a result on the active run. The linked test case status updates immediately."
      />

      <div className="summary-strip">
        <article><span>Runs</span><strong>{prepared.length}</strong></article>
        <article><span>In progress</span><strong>{prepared.filter((run) => run.status === "In Progress").length}</strong></article>
        <article><span>Completed</span><strong>{prepared.filter((run) => run.status === "Completed").length}</strong></article>
        <article><span>Build</span><strong className="summary-build">{prepared[0]?.build}</strong></article>
      </div>

      <div className="execution">
        <SectionCard title="Runs" subtitle={`${release.sprint} on ${release.environment}`}>
          <ul className="run-list">
            {prepared.map((run) => (
              <li key={run.id}>
                <button
                  type="button"
                  className={`run-card${active?.id === run.id ? " is-active" : ""}`}
                  onClick={() => {
                    setActiveId(run.id);
                    setNote("");
                  }}
                >
                  <div className="run-card__top">
                    <strong>{run.name}</strong>
                    <StatusBadge status={run.status} />
                  </div>
                  <p>{run.id} · {run.owner}</p>
                  <div className="progress" aria-hidden="true"><span style={{ width: `${run.progress}%` }} /></div>
                  <span>{run.done} of {run.cases.length} recorded · {run.progress}%</span>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        {active && (
          <SectionCard
            title={active.name}
            subtitle={`${active.build} · started ${active.started}`}
          >
            {note && <p className="save-note" role="status">{note}</p>}
            <ul className="run-cases">
              {active.cases.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.id}</strong>
                    <p>{item.title}</p>
                    <StatusBadge status={item.result} />
                  </div>
                  <div className="run-cases__actions">
                    {caseStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`btn btn--small ${item.result === status ? "btn--primary" : "btn--ghost"}`}
                        onClick={() => record(item.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
