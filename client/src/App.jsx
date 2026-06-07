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
  const [archiveCount, setArchiveCount] = useState(0);
  const [links, setLinks] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // Check if token is T/F
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    getReports();
    getArchiveCount();
  }, []);

  async function getReports() {
    const response = await fetch(`${API_URL}/reports`);
    const data = await response.json();
    setReports(data);
  }

  async function getArchiveCount() {
    const response = await fetch(`${API_URL}/archive-count`);
    const data = await response.json();
    setArchiveCount(data.count);
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleLoginSuccess(newToken, user) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
    setToken(newToken);
    setMessage(`Logged in as ${user.username}`);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setArchivedReports([]);
    setLinks([]);
    setMessage("Logged out");
    setToken("");
    setPage("dashboard");
  }

  async function openArchive() {
    if (!isLoggedIn) {
      setMessage("Please sign in to view the archive.");
      setPage("login");
      return;
    }

    if (!canViewRestrictedPages()) {
      setMessage("Only investigators or admins can access the archive.");
      return;
    }

    try {
      const data = await authenticatedFetch("/archive", token);
      setArchivedReports(data);
      setArchiveCount(data.length);
      setPage("archive");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function openLinks() {
    if (!isLoggedIn) {
      setMessage("Please sign in to view the archive.");
      setPage("login");
      return;
    }

    if (!canViewRestrictedPages()) {
      setMessage("Only investigators or admins can access the archive.");
      return;
    }
    
    try {
      const data = await authenticatedFetch("/report-links", token);
      setLinks(data);
      setPage("links");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function openReport(reportId) {
    const response = await fetch(`${API_URL}/reports/${reportId}`);
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setSelectedReport(data);
    setPage("report");
  }

  async function openProtectedReport(reportId) {
    try {
      const data = await authenticatedFetch(`/protected-reports/${reportId}`, token);
      setSelectedReport(data);
      setPage("report");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function openLinkedReport(reportId) {
    if (currentUser?.role === "investigator" || currentUser?.role === "admin") {
      openProtectedReport(reportId);
      return;
    }

    openReport(reportId);
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
      const data = await authenticatedFetch("/reports", token, {
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
      const data = await authenticatedFetch(`/reports/${selectedReport.id}`, token, {
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

  function canViewRestrictedPages() {
    return currentUser?.role === "investigator" || currentUser?.role === "admin";
  }

  return (
    <main>
      <Header 
        onPageChange={setPage} 
        onArchiveClick={openArchive}
        onLinksClick={openLinks} 
        isLoggedIn={isLoggedIn} 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />

      {message && <p className="notice">{message}</p>}

      {page === "dashboard" && (
        <Dashboard
          reports={reports}
          archiveCount={archiveCount}
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

      {page === "new" && !isLoggedIn && (
        <section className="panel">
          <h1>Sign in required</h1>
          <p>Please sign in before filing a dream report.</p>
          <button onClick={() => setPage("login")}>Go to Login</button>
        </section>
      )}

      {page === "new" && isLoggedIn &&(
        <ReportForm
          heading="New Dream Report"
          form={form}
          onChange={updateForm}
          onSubmit={createReport}
          submitLabel="File Report"
        />
      )}

      {page === "edit" && selectedReport && !isLoggedIn && (
        <section className="panel">
          <h1>Sign in required</h1>
          <p>Please sign in before editing a report.</p>
          <button onClick={() => setPage("login")}>Go to Login</button>
        </section>
      )}

      {page === "edit" && selectedReport && isLoggedIn && (
        <ReportForm
          heading={`Edit ${selectedReport.title}`}
          form={form}
          onChange={updateForm}
          onSubmit={updateReport}
          submitLabel="Save Report"
        />
      )}

      {page === "links" && (
        <LinksPage links={links} onOpenReport={openLinkedReport} />
      )}

      {page === "archive" && (
        <ArchivePage
          archivedReports={archivedReports}
          onOpenReport={openProtectedReport}
        />
      )}

      {page === "signup" && <SignupPage API_URL={API_URL} setPage={setPage} />}

      {page === "login" && <LoginPage API_URL={API_URL} onLoginSuccess={handleLoginSuccess} />}
    </main>
  );
}

export default App;
