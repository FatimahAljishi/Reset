import "./Navbar.css";
import logo from "../assets/reset-logo-transparent.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { GoHome } from "react-icons/go";
import navArt from "../assets/hero-art.png";
import { IoMdClose } from "react-icons/io";
import { HiOutlineUser } from "react-icons/hi";
import { HiUserPlus } from "react-icons/hi2";

export default function Navbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <header className="navbar">
      <img src={logo} alt="Reset" className="logo" />

      <div className="navbar-right">
        <LanguageSwitcher />

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <HiOutlineBars3 />
        </button>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>
          <IoMdClose />
        </button>
        <div className="mobile-links">
          <a href="/" onClick={() => setMenuOpen(false)}>
            <GoHome className="mobile-link-icon" />
            {t("navbar.home")}
          </a>
          <a href="/" onClick={() => setMenuOpen(false)}>
            <HiOutlineUser className="mobile-link-icon" />
            {t("navbar.about")}
          </a>
          <a href="/register" onClick={() => setMenuOpen(false)}>
            <HiUserPlus className="mobile-link-icon" />
            {t("navbar.register")}
          </a>
        </div>
        <img src={navArt} alt="" className="mobile-nav-art" />
      </div>

      <nav className="desktop-nav">
        <a href="/">{t("navbar.home")}</a>
        <a href="/">{t("navbar.about")}</a>
        <a href="/register">{t("navbar.register")}</a>

        <button>{t("navbar.book")}</button>
      </nav>
    </header>
  );
}
