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
import { FaRegCircleUser } from "react-icons/fa6";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { CiDumbbell } from "react-icons/ci";

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
      <Link to="/">
        <img src={logo} alt="Reset" className="logo" />
      </Link>

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
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <GoHome className="mobile-link-icon" />
            {t("navbar.home")}
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <HiOutlineUser className="mobile-link-icon" />
            {t("navbar.about")}
          </Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>
            <CiDumbbell className="mobile-link-icon" />
            {t("navbar.services")}
          </Link>
          <SignedOut>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <FaRegCircleUser className="mobile-link-icon" />
              {t("navbar.login")}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <FaRegCircleUser className="mobile-link-icon" />
              {t("navbar.profile")}
            </Link>
          </SignedIn>
        </div>
        <img src={navArt} alt="" className="mobile-nav-art" />
      </div>

      <nav className="desktop-nav">
        <Link to="/">{t("navbar.home")}</Link>
        <Link to="/about">{t("navbar.about")}</Link>
        <Link to="/services">{t("navbar.services")}</Link>
        <SignedOut>
          <Link to="/login">{t("navbar.login")}</Link>
        </SignedOut>
        <SignedIn>
          <Link to="/profile">{t("navbar.profile")}</Link>
        </SignedIn>

        <button>{t("navbar.book")}</button>
      </nav>
    </header>
  );
}
