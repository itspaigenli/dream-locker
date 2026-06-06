function ArchivePage({ archivedReports }) {
  return (
    <section className="panel">
      <p className="section-label">Admin Surface</p>
      <h1>Resolved Archive</h1>
      {archivedReports.length === 0 && (
        <p className="empty-state">No archived reports found.</p>
      )}
      <div className="report-list">
        {archivedReports.map((report) => (
          <article className="report-card" key={report.id}>
            <div className="card-topline">
              <p className="section-label">Report #{report.id}</p>
              <span>archived</span>
            </div>
            <h2>{report.title}</h2>
            <p>{report.description}</p>
            <dl>
              <div>
                <dt>Resolution Status</dt>
                <dd>Resolved pattern cluster</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{report.location || "Unknown"}</dd>
              </div>
            </dl>
            <button type="button" disabled>
              Archived
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ArchivePage;
