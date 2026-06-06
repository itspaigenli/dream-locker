import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const emptyForm = {
  user_id: "1",
  title: "",
  description: "",
  symbols: "",
  location: "",
  visibility: "public",
};

function App() {
  const [page, setPage] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getReports();
    getLinks();
  }, []);

  async function getReports() {
    const response = await fetch(`${API_URL}/reports`);
    const data = await response.json();
    setReports(data);
  }

  async function getLinks() {
    const response = await fetch(`${API_URL}/report-links`);
    const data = await response.json();
    setLinks(data);
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
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
      user_id: String(report.user_id),
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

    const response = await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const newReport = await response.json();
    setMessage(`Report filed: ${newReport.title}`);
    setForm(emptyForm);
    await getReports();
    setPage("reports");
  }

  async function updateReport(event) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/reports/${selectedReport.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const updatedReport = await response.json();
    setMessage(`Report updated: ${updatedReport.title}`);
    await getReports();
    setSelectedReport(updatedReport);
    setPage("report");
  }

  const publicCount = reports.length;
  const symbolCount = reports.reduce((total, report) => {
    if (!report.symbols) {
      return total;
    }

    return total + report.symbols.split(",").length;
  }, 0);

  return (
    <main>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setPage("dashboard")}>
          Dream Evidence Locker
        </button>

        <nav className="nav">
          <button type="button" onClick={() => setPage("dashboard")}>
            Dashboard
          </button>
          <button type="button" onClick={() => setPage("reports")}>
            Reports
          </button>
          <button type="button" onClick={() => setPage("new")}>
            New Report
          </button>
          <button type="button" onClick={() => setPage("links")}>
            Links
          </button>
          <button type="button" onClick={() => setPage("archive")}>
            Archive
          </button>
        </nav>
      </header>

      {message && <p className="notice">{message}</p>}

      {page === "dashboard" && (
        <section className="page-grid">
          <section className="intro">
            <p className="section-label">Evidence System</p>
            <h1>Dream Evidence Locker</h1>
            <p>
              A fictional investigation workspace for reports about repeated
              symbols, locations, numbers, and events.
            </p>
          </section>

          <section className="stats">
            <article>
              <span>{publicCount}</span>
              <p>Public Reports</p>
            </article>
            <article>
              <span>{links.length}</span>
              <p>Report Links</p>
            </article>
            <article>
              <span>{symbolCount}</span>
              <p>Tracked Symbols</p>
            </article>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-label">Recent Evidence</p>
                <h2>Public Reports</h2>
              </div>
              <button type="button" onClick={() => setPage("reports")}>
                View All
              </button>
            </div>

            <div className="report-list">
              {reports.slice(0, 3).map((report) => (
                <article className="report-card" key={report.id}>
                  <div>
                    <p className="section-label">{report.location || "Unknown"}</p>
                    <h3>{report.title}</h3>
                  </div>
                  <p>{report.description}</p>
                  <button type="button" onClick={() => openReport(report.id)}>
                    Open Report
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {page === "reports" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">All Reports</p>
              <h1>Public Evidence</h1>
            </div>
            <button type="button" onClick={() => setPage("new")}>
              New Report
            </button>
          </div>

          <div className="report-list">
            {reports.map((report) => (
              <article className="report-card" key={report.id}>
                <div className="card-topline">
                  <p className="section-label">{report.username}</p>
                  <span>{report.visibility}</span>
                </div>
                <h2>{report.title}</h2>
                <p>{report.description}</p>
                <dl>
                  <div>
                    <dt>Symbols</dt>
                    <dd>{report.symbols || "None recorded"}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{report.location || "Unknown"}</dd>
                  </div>
                </dl>
                <div className="actions">
                  <button type="button" onClick={() => openReport(report.id)}>
                    Open
                  </button>
                  <button type="button" onClick={() => openEditReport(report)}>
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === "report" && selectedReport && (
        <section className="detail-layout">
          <article className="panel detail">
            <p className="section-label">Report #{selectedReport.id}</p>
            <h1>{selectedReport.title}</h1>
            <p>{selectedReport.description}</p>

            <dl>
              <div>
                <dt>Dreamer</dt>
                <dd>{selectedReport.username}</dd>
              </div>
              <div>
                <dt>Symbols</dt>
                <dd>{selectedReport.symbols || "None recorded"}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{selectedReport.location || "Unknown"}</dd>
              </div>
              <div>
                <dt>Visibility</dt>
                <dd>{selectedReport.visibility}</dd>
              </div>
            </dl>

            <div className="actions">
              <button type="button" onClick={() => openEditReport(selectedReport)}>
                Edit Report
              </button>
              <button type="button" onClick={() => setPage("reports")}>
                Back
              </button>
            </div>
          </article>
        </section>
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

      {page === "links" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Investigator Surface</p>
              <h1>Linked Reports</h1>
            </div>
          </div>

          <div className="report-list">
            {links.map((link) => (
              <article className="report-card" key={link.id}>
                <p className="section-label">{link.investigator_name}</p>
                <h2>
                  {link.source_title} / {link.target_title}
                </h2>
                <p>{link.reason}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === "archive" && (
        <section className="panel">
          <p className="section-label">Admin Surface</p>
          <h1>Archive Queue</h1>
          <div className="report-list">
            {reports.map((report) => (
              <article className="report-card" key={report.id}>
                <div className="card-topline">
                  <p className="section-label">Report #{report.id}</p>
                  <span>{report.archived ? "archived" : "active"}</span>
                </div>
                <h2>{report.title}</h2>
                <p>{report.description}</p>
                <button type="button" disabled>
                  Archive
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ReportForm({ heading, form, onChange, onSubmit, submitLabel }) {
  return (
    <section className="panel form-panel">
      <p className="section-label">Evidence Entry</p>
      <h1>{heading}</h1>

      <form onSubmit={onSubmit}>
        <label>
          Dreamer ID
          <select name="user_id" value={form.user_id} onChange={onChange}>
            <option value="1">1 - Mara</option>
            <option value="2">2 - Sol</option>
          </select>
        </label>

        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="The Red Staircase"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Describe the dream report."
          />
        </label>

        <label>
          Symbols
          <input
            name="symbols"
            value={form.symbols}
            onChange={onChange}
            placeholder="water, stairs, number 314"
          />
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="unknown hospital basement"
          />
        </label>

        <label>
          Visibility
          <select
            name="visibility"
            value={form.visibility}
            onChange={onChange}
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </label>

        <button type="submit">{submitLabel}</button>
      </form>
    </section>
  );
}

export default App;
