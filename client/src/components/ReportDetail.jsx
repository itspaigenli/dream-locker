function ReportDetail({ report, onBack, onEditReport }) {
  return (
    <section className="detail-layout">
      <article className="panel detail">
        <p className="section-label">Report #{report.id}</p>
        <h1>{report.title}</h1>
        <p>{report.description}</p>

        <dl>
          <div>
            <dt>Report Type</dt>
            <dd>Public dream evidence</dd>
          </div>
          <div>
            <dt>Symbols</dt>
            <dd>{report.symbols || "None recorded"}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{report.location || "Unknown"}</dd>
          </div>
          <div>
            <dt>Visibility</dt>
            <dd>{report.visibility}</dd>
          </div>
        </dl>

        <div className="actions">
          <button type="button" onClick={() => onEditReport(report)}>
            Edit Report
          </button>
          <button type="button" onClick={onBack}>
            Back
          </button>
        </div>
      </article>
    </section>
  );
}

export default ReportDetail;
