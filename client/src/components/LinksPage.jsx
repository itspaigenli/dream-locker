function LinksPage({ links, onOpenReport }) {
  return (
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
            <p className="section-label">Investigator Link</p>
            <h2>
              {link.source_title} / {link.target_title}
            </h2>
            <p>{link.reason}</p>
            <div className="actions">
              <button
                type="button"
                onClick={() => onOpenReport(link.source_report_id)}
              >
                Open Source Report
              </button>
              <button
                type="button"
                onClick={() => onOpenReport(link.target_report_id)}
              >
                Open Target Report
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LinksPage;
