function ReportsPage({ reports, onPageChange, onOpenReport, onEditReport }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-label">All Reports</p>
          <h1>Public Evidence</h1>
        </div>
        <button type="button" onClick={() => onPageChange("new")}>
          New Report
        </button>
      </div>

      <div className="report-list">
        {reports.map((report) => (
          <article className="report-card" key={report.id}>
            <div className="card-topline">
              <p className="section-label">Dream Report</p>
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
              <button type="button" onClick={() => onOpenReport(report.id)}>
                Open
              </button>
              <button type="button" onClick={() => onEditReport(report)}>
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReportsPage;
