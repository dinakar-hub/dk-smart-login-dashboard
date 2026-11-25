import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QaProvider } from "./context/QaContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import TestManagement from "./pages/TestManagement/TestManagement";
import TestExecution from "./pages/TestExecution/TestExecution";
import DefectManagement from "./pages/DefectManagement/DefectManagement";
import AutomationReports from "./pages/AutomationReports/AutomationReports";
import TestReports from "./pages/TestReports/TestReports";
import TeamManagement from "./pages/TeamManagement/TeamManagement";
import Settings from "./pages/Settings/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <QaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test-management" element={<TestManagement />} />
            <Route path="/test-execution" element={<TestExecution />} />
            <Route path="/defects" element={<DefectManagement />} />
            <Route path="/automation" element={<AutomationReports />} />
            <Route path="/reports" element={<TestReports />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </QaProvider>
    </BrowserRouter>
  );
}
