import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";
import logo from "../assets/reset-logo-transparent.png";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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
      setLoading(true);

      await signUp.create({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Registration failed");
    } finally {
      setLoading(false);
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
    <>
      <Navbar />
      <main className="register-page">
        <section className="register-card">
          <img src={logo} alt="Reset logo" className="register-logo" />

          <h1>
            {pendingVerification
              ? t("register.verifyEmail")
              : t("register.title")}
          </h1>

          <p className="register-subtitle">
            {pendingVerification
              ? t("register.verificationMessage")
              : t("register.subtitle")}
          </p>

          {!pendingVerification ? (
            <form onSubmit={handleRegister} className="register-form">
              <label>{t("register.firstName")}</label>
              <input
                name="firstName"
                type="text"
                placeholder={t("register.firstNamePlaceholder")}
                value={form.firstName}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <label>{t("register.lastName")}</label>
              <input
                name="lastName"
                type="text"
                placeholder={t("register.lastNamePlaceholder")}
                value={form.lastName}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <label>{t("register.email")}</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <label>{t("register.password")}</label>
              <input
                name="password"
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <div id="clerk-captcha" />

              <button type="submit" disabled={loading}>
                {loading
                  ? t("register.loadingMessage")
                  : t("register.registerButton")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="register-form">
              <label>{t("register.verificationCode")}</label>
              <input
                name="code"
                placeholder={t("register.enterCode")}
                value={form.code}
                onChange={handleChange}
                required
              />

              <button type="submit">{t("register.verify")}</button>
            </form>
          )}

          {error && <p className="register-error">{error}</p>}

          {!pendingVerification && (
            <p className="register-login">
              {t("register.login")}{" "}
              <Link to="/login"> {t("register.loginLink")} </Link>
            </p>
          )}
        </section>
      </main>
    </>
  );
}
