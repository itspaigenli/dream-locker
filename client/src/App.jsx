import { useEffect, useState } from "react";
import ArchivePage from "./components/ArchivePage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Header from "./components/Header.jsx";
import LinksPage from "./components/LinksPage.jsx";
import ReportDetail from "./components/ReportDetail.jsx";
import ReportForm from "./components/ReportForm.jsx";
import ReportsPage from "./components/ReportsPage.jsx";
import { authenticatedFetch } from "../api/authenticatedFetch.js";
import SignupPage from "./components/SignupPage.jsx";
import LoginPage from "./components/LoginPage.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const emptyForm = {
  title: "",
  description: "",
  symbols: "",
  location: "",
  visibility: "public",
};

function App() {
  const [page, setPage] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [archivedReports, setArchivedReports] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getReports();
    getArchivedReports();
    getLinks();
  }, []);

  async function getReports() {
    const response = await fetch(`${API_URL}/reports`);
    const data = await response.json();
    setReports(data);
  }

  async function getArchivedReports() {
    try {
      const data = await authenticatedFetch("/archive");
      setArchivedReports(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function getLinks() {
    try {
      const data = await authenticatedFetch("/report-links");
      setLinks(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function openArchive() {
    await getArchivedReports();
    setPage("archive");
  }

  async function openReport(reportId) {
    const response = await fetch(`${API_URL}/reports/${reportId}`);
    const data = await response.json();
    setSelectedReport(data);
    setPage("report");
  }

  function openEditReport(report) {
    setSelectedReport(report);
    setForm({
      title: report.title,
      description: report.description,
      symbols: report.symbols || "",
      location: report.location || "",
      visibility: report.visibility,
    });
    setPage("edit");
  }

  async function createReport(event) {
    event.preventDefault();

    try {
      const data = await authenticatedFetch("/reports", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage(`Report filed: ${data.title}`);
      setForm(emptyForm);
      await getReports();
      setPage("reports");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateReport(event) {
    event.preventDefault();

    try {
      const data = await authenticatedFetch(`/reports/${selectedReport.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setMessage(`Report updated: ${data.title}`);
      await getReports();
      setSelectedReport(data);
      setPage("report");
    } catch (error) {
      setMessage(error.message);
    }
  }

  const symbolCount = reports.reduce((total, report) => {
    if (!report.symbols) {
      return total;
    }

    return total + report.symbols.split(",").length;
  }, 0);

  return (
    <main>
      <Header onPageChange={setPage} onArchiveClick={openArchive} />

      {message && <p className="notice">{message}</p>}

      {page === "dashboard" && (
        <Dashboard
          reports={reports}
          archivedReports={archivedReports}
          symbolCount={symbolCount}
          onPageChange={setPage}
          onOpenReport={openReport}
        />
      )}

      {page === "reports" && (
        <ReportsPage
          reports={reports}
          onPageChange={setPage}
          onOpenReport={openReport}
          onEditReport={openEditReport}
        />
      )}

      {page === "report" && selectedReport && (
        <ReportDetail
          report={selectedReport}
          onBack={() => setPage("reports")}
          onEditReport={openEditReport}
        />
      )}

      {page === "new" && (
        <ReportForm
          heading="New Dream Report"
          form={form}
          onChange={updateForm}
          onSubmit={createReport}
          submitLabel="File Report"
        />
      )}

      {page === "edit" && selectedReport && (
        <ReportForm
          heading={`Edit ${selectedReport.title}`}
          form={form}
          onChange={updateForm}
          onSubmit={updateReport}
          submitLabel="Save Report"
        />
      )}

      {page === "links" && <LinksPage links={links} />}

      {page === "archive" && <ArchivePage archivedReports={archivedReports} />}

      {page === "signup" && <SignupPage API_URL={API_URL} />}

      {page === "login" && <LoginPage API_URL={API_URL} />}
    </main>
  );
}

export default App;
