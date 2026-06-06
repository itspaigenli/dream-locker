import { useState } from "react";

function SignupPage({ API_URL, setPage }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
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

  async function handleSignup(event) {
    event.preventDefault();

    setMessage("Creating account...");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        return;
      }

      setMessage(data.message);

      setForm({
        username: "",
        email: "",
        password: "",
      });

      setPage("login");
    } catch {
      setMessage("Could not connect to the server.");
    }
  }

  return (
    <section className="panel form-panel">
      <p className="section-label">Account Access</p>
      <h1>Sign Up</h1>
      {message && <p className="notice">{message}</p>}
      <form onSubmit={handleSignup}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={updateForm}
            placeholder="mara"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateForm}
            placeholder="mara@example.com"
            required
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
            required
          />
        </label>

        <button type="submit">Create Account</button>
      </form>
    </section>
  );
}

export default SignupPage;
