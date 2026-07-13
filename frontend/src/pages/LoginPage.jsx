import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import logo from "../assets/reset-logo-transparent.png";
import "./RegisterPage.css";

const clerkErrorTranslations = {
  form_identifier_not_found: "errors.emailNotFound",
  form_password_incorrect: "errors.incorrectPassword",
  form_param_format_invalid: "errors.invalidEmail",
  form_code_incorrect: "errors.invalidCode",
  form_code_expired: "errors.expiredCode",
  session_exists: "errors.sessionExists",
};

export default function LoginPage() {
  const { t } = useTranslation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [needsSecondFactor, setNeedsSecondFactor] = useState(false);
  const [code, setCode] = useState("");
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

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate(redirectPath, { replace: true });
      } else if (result.status === "needs_second_factor") {
        await signIn.prepareSecondFactor({
          strategy: "email_code",
        });

        setNeedsSecondFactor(true);
      } else {
        setError(t("errors.loginNeedsAnotherStep"));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setError("");
      setLoading(true);

      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate(redirectPath, { replace: true });
      } else {
        setError(t("errors.verificationNeedsAnotherStep"));
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
            {needsSecondFactor ? t("login.verifyEmail") : t("login.title")}
          </h1>

          <p className="register-subtitle">
            {needsSecondFactor
              ? t("login.verifyEmailSubtitle")
              : t("login.subtitle")}
          </p>

          {!needsSecondFactor ? (
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
          ) : (
            <form onSubmit={handleVerifyCode} className="register-form">
              <label>{t("login.verifyEmailLabel")}</label>
              <input
                type="text"
                placeholder={t("login.verifyEmailPlaceholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? t("login.verifying") : t("login.verify")}
              </button>
            </form>
          )}

          {error && <p className="register-error">{error}</p>}

          {!needsSecondFactor && (
            <p className="register-login">
              {t("login.register")}{" "}
              <Link to="/register">{t("login.registerLink")}</Link>
            </p>
          )}
        </section>
      </main>
    </>
  );
}
