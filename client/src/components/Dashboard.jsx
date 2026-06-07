function Dashboard({
  reports,
  archiveCount,
  symbolCount,
  onPageChange,
  onOpenReport,
}) {
  return (
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
          <span>{reports.length}</span>
          <p>Public Reports</p>
        </article>
        <article>
          <span>{archiveCount}</span>
          <p>Archived Cases</p>
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
          <button type="button" onClick={() => onPageChange("reports")}>
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
              <button type="button" onClick={() => onOpenReport(report.id)}>
                Open Report
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
