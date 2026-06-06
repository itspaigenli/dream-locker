import { useState } from "react";

function SignupPage() {
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

  return (
    <section className="panel form-panel">
      <p className="section-label">Account Access</p>
      <h1>Sign Up</h1>
      {message && <p className="notice">{message}</p>}
      <form>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={updateForm}
            placeholder="mara"
          />
        </label>

        <label>
          Email
          <input
            name="email"
            value={form.email}
            onChange={updateForm}
            placeholder="mara@example.com"
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

        <button type="submit">Create Account</button>
      </form>
    </section>
  );
}

export default SignupPage;
