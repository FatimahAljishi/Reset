import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    code: "",
  });

  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setError("");

      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Registration failed");
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setError("");

      const result = await signUp.attemptEmailAddressVerification({
        code: form.code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  }

  return (
    <div className="auth-page">
      <h1>Create Account</h1>

      {!pendingVerification ? (
        <form onSubmit={handleRegister}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">Create Account</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <p>We sent a verification code to your email.</p>

          <input
            name="code"
            placeholder="Verification code"
            value={form.code}
            onChange={handleChange}
          />

          <button type="submit">Verify Email</button>
        </form>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}
