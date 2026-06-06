import { useState } from "react";

function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
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
      <h1>Sign Up</h1>
    </section>
  );
}

export default SignupPage;
