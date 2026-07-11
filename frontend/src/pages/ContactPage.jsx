import "./ContactPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { PiPlantLight } from "react-icons/pi";

export default function ContactPage() {
  const { t } = useTranslation();
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

        <form className="contact-form">
          <div className="contact-field">
            <label>{t("contact.name")}</label>
            <input
              name="name"
              placeholder={t("contact.namePlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.phone")}</label>
            <input
              type="tel"
              name="phone"
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
              placeholder={t("contact.emailPlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.city")}</label>
            <input
              name="city"
              placeholder={t("contact.cityPlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.goal")}</label>
            <textarea
              name="goal"
              placeholder={t("contact.goalPlaceholder")}
              required
            />
          </div>

          <div className="contact-field">
            <label>{t("contact.message")}</label>
            <textarea
              name="message"
              placeholder={t("contact.messagePlaceholder")}
              required
            />
          </div>

          <div className="contact-button">
            <button type="submit">{t("contact.submit")}</button>
          </div>
        </form>
      </div>
    </>
  );
}
