import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import logo from "../assets/reset-logo-transparent.png";
import "./RegisterPage.css";

const clerkErrorTranslations = {
  form_identifier_exists: "errors.emailExists",
  form_password_pwned: "errors.passwordPwned",
  form_password_length_too_short: "errors.passwordTooShort",
  form_password_not_strong_enough: "errors.passwordNotStrongEnough",
  form_code_incorrect: "errors.invalidCode",
  form_code_expired: "errors.expiredCode",
  session_exists: "errors.sessionExists",
};

export default function RegisterPage() {
  const { t } = useTranslation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    code: "",
  });

  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function getErrorMessage(err) {
    const clerkError = err.errors?.[0];

    if (!clerkError) {
      return t("errors.generic");
    }

    const translationKey = clerkErrorTranslations[clerkError.code];

    return translationKey ? t(translationKey) : clerkError.message;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

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
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      const result = await signUp.attemptEmailAddressVerification({
        code: form.code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      }
    } catch (err) {
      setError(getErrorMessage(err));
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
                type="text"
                placeholder={t("register.enterCode")}
                value={form.code}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? t("register.verifying") : t("register.verify")}
              </button>
            </form>
          )}

          {error && <p className="register-error">{error}</p>}

          {!pendingVerification && (
            <p className="register-login">
              {t("register.login")}{" "}
              <Link to="/login">{t("register.loginLink")}</Link>
            </p>
          )}
        </section>
      </main>
    </>
  );
}
