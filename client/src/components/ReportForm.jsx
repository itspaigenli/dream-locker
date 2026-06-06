function ReportForm({ heading, form, onChange, onSubmit, submitLabel }) {
  return (
    <section className="panel form-panel">
      <p className="section-label">Evidence Entry</p>
      <h1>{heading}</h1>

      <form onSubmit={onSubmit}>
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

export default ReportForm;
