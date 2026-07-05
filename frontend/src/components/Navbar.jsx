import "./Navbar.css";
import logo from "../assets/reset-logo-transparent.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  return (
    <header className="navbar">
      <img src={logo} alt="Reset" className="logo" />

      <div className="navbar-right">
        <LanguageSwitcher />

        <button className="menu-btn">
          <HiOutlineBars3 />
        </button>
      </div>

      <nav className="desktop-nav">
        <a href="/">{t("navbar.home")}</a>
        <a href="/">{t("navbar.plans")}</a>
        <a href="/">{t("navbar.training")}</a>
        <a href="/">{t("navbar.classes")}</a>
        <a href="/">{t("navbar.about")}</a>

        <button>{t("navbar.book")}</button>
      </nav>
    </header>
  );
}
