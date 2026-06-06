import { useState } from "react";

function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  return (
    <section className="panel form-panel">
      <p className="section-label">Account Access</p>
      <h1>Sign Up</h1>
    </section>
  );
}

export default SignupPage;
