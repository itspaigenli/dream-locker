import { useState } from "react";

function LoginPage({ API_URL }) {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function updateForm(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleLogin(event) {
    event.preventDefault();

    setMessage("Signing in...");
  }

  return (
    <section className="panel form-panel">
      <p className="section-label">Account Access</p>
      <h1>Login</h1>
      {message && <p className="notice">{message}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Username or Email
          <input
            name="identifier"
            value={form.identifier}
            onChange={updateForm}
            placeholder="mara or mara@example.com"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateForm}
            placeholder="ExamplePassword1!"
          />
        </label>

        <button type="submit">Login</button>
      </form>
    </section>
  );
}

export default LoginPage;
