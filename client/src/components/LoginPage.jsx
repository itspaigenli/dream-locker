import { useState } from "react";

function LoginPage() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

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
      <h1>Login</h1>
    </section>
  );
}

export default LoginPage;
