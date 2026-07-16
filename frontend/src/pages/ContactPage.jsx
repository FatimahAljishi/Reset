import "./ContactPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { PiPlantLight } from "react-icons/pi";
import { useState } from "react";
import Footer from "../components/Footer";

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    goal: "",
    message: "",
  });

  const [status, setStatus] = useState({
    message: "",
    type: "",
  });
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();

    setSending(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setStatus({
        message: "Thank you! We'll get back to you soon.",
        type: "success",
      });

      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        goal: "",
        message: "",
      });
    } catch {
      setStatus({ message: "Unable to send message.", type: "error" });
    }

    setSending(false);
  }
  return (
    <>
      <Navbar />
      <div className="contact-page">
        <h1>{t("contact.title")}</h1>
        <div className="services-divider">
          <span></span>
          <PiPlantLight className="hero-leaf" />
          <span></span>
        </div>
        <h2>
          {t("contact.subtitle")} <span>{t("contact.subtitle2")}</span>
        </h2>
        <p>{t("contact.subtitle3")}</p>
        <p>{t("contact.subtitle4")}</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label>{t("contact.name")}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("contact.namePlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.phone")}</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="05XXXXXXXX"
              pattern="^(\+9665|05)\d{8}$"
              title={t("contact.phoneTitle")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.email")}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t("contact.emailPlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.city")}</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t("contact.cityPlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.goal")}</label>
            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder={t("contact.goalPlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.message")}</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t("contact.messagePlaceholder")}
              required
            />
          </div>

          <div className="contact-button">
            <button type="submit" disabled={sending}>
              {sending ? t("contact.submitting") : t("contact.submit")}
            </button>
          </div>
          {status.message && (
            <p className={`contact-status ${status.type}`}>{status.message}</p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}
