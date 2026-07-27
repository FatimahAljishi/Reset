import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import logo from "../assets/reset-logo-transparent.png";
import "./RegisterPage.css";

const clerkErrorTranslations = {
  form_identifier_not_found: "errors.emailNotFound",
  form_param_format_invalid: "errors.invalidEmail",
  form_code_incorrect: "errors.invalidCode",
  form_code_expired: "errors.expiredCode",
};

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getErrorMessage(err) {
    const clerkError = err.errors?.[0];

    if (!clerkError) {
      return t("errors.generic");
    }

    const translationKey = clerkErrorTranslations[clerkError.code];

    return translationKey ? t(translationKey) : clerkError.message;
  }

  async function handleSendCode(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/", { replace: true });
      } else {
        setError(t("forgotPassword.unexpected"));
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

          <h1>{t("forgotPassword.title")}</h1>

          <p className="register-subtitle">
            {step === 1
              ? t("forgotPassword.subtitle")
              : t("forgotPassword.resetSubtitle")}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="register-form">
              <label>{t("forgotPassword.email")}</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <button type="submit" disabled={loading}>
                {loading
                  ? t("forgotPassword.sending")
                  : t("forgotPassword.sendCode")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="register-form">
              <label>{t("forgotPassword.code")}</label>

              <input
                type="text"
                placeholder={t("forgotPassword.codePlaceholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                required
              />

              <label>{t("forgotPassword.newPassword")}</label>

              <input
                type="password"
                placeholder={t("forgotPassword.newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <button type="submit" disabled={loading}>
                {loading
                  ? t("forgotPassword.resetting")
                  : t("forgotPassword.resetButton")}
              </button>
            </form>
          )}

          {error && <p className="register-error">{error}</p>}
        </section>
      </main>
    </>
  );
}
