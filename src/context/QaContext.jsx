import { createContext, useContext, useMemo, useState } from "react";
import { defects as seedDefects, executionRuns, testCases as seedCases } from "../data/sampleData";

const QaContext = createContext(null);

export function QaProvider({ children }) {
  const [cases, setCases] = useState(seedCases);
  const [defects, setDefects] = useState(seedDefects);
  const [runs, setRuns] = useState(executionRuns);

  const api = useMemo(
    () => ({
      cases,
      defects,
      runs,
      updateCaseStatus(id, status) {
        setCases((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status, lastRun: "Just now" } : item,
          ),
        );
      },
      updateDefectStatus(id, status) {
        setDefects((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      },
      updateRunCase(runId, caseId, result) {
        setRuns((current) =>
          current.map((run) => {
            if (run.id !== runId) return run;
            return {
              ...run,
              cases: run.cases.map((item) =>
                item.id === caseId ? { ...item, result } : item,
              ),
            };
          }),
        );
        setCases((current) =>
          current.map((item) =>
            item.id === caseId ? { ...item, status: result, lastRun: "Just now" } : item,
          ),
        );
      },
    }),
    [cases, defects, runs],
  );

  return <QaContext.Provider value={api}>{children}</QaContext.Provider>;
}

export function useQa() {
  const value = useContext(QaContext);
  if (!value) {
    throw new Error("useQa must be used within QaProvider");
  }
  return value;
}
