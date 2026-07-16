import "./Footer.css";
import { useTranslation } from "react-i18next";
import logo from "../assets/reset-logo-transparent.png";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { PiPlantLight } from "react-icons/pi";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-container">
          <img src={logo} className="footer-logo" />
          <div className="footer-text">
            <h2>Reset by Zainab</h2>
            <p>{t("footer.subtitle1")}</p>
            <p>{t("footer.subtitle2")}</p>
          </div>
        </div>
        <div className="footer-links">
          <h3>{t("footer.connect")}</h3>
          <a
            href="https://www.instagram.com/z.j_fitness/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="footer-icon" />
            <span>@z.j_fitness</span>
          </a>
          <a
            href="https://wa.me/00966542281215"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="footer-icon" /> <span>+966542281215</span>
          </a>
          <a
            href="mailto:reset.by.zainab@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdOutlineMailOutline className="footer-icon" />{" "}
            <span>reset.by.zainab@gmail.com</span>
          </a>
        </div>
      </div>
      <p className="footer-bottom">{t("footer.copyright")}</p>
    </footer>
  );
}
