import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";
import logo from "../assets/reset-logo-transparent.png";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setError("");
      setLoading(true);

      const result = await signIn.create({
        identifier: form.email,
        password: form.password,
      });
      console.log(result.status);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/profile");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="register-page">
        <section className="register-card">
          <img src={logo} alt="Reset logo" className="register-logo" />

          <h1>{t("login.title")}</h1>

          <p className="register-subtitle">{t("login.subtitle")}</p>

          <form onSubmit={handleLogin} className="register-form">
            <label>{t("login.email")}</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <label>{t("login.password")}</label>
            <input
              name="password"
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? t("login.loadingMessage") : t("login.loginButton")}
            </button>
          </form>

          {error && <p className="register-error">{error}</p>}

          <p className="register-login">
            {t("login.register")}{" "}
            <Link to="/register">{t("login.registerLink")}</Link>
          </p>
        </section>
      </main>
    </>
  );
}
