import "./Navbar.css";
import logo from "../assets/reset-logo-transparent.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import navArt from "../assets/hero-art.png";
import { IoMdClose } from "react-icons/io";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LuHouse, LuDumbbell, LuLeaf, LuUser, LuMail } from "react-icons/lu";
import { HiOutlineUserGroup, HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
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
      <Link to="/" className="navbar-logo-link">
        <img src={logo} alt="Reset" className="logo" />
      </Link>

      <div className="navbar-right">
        <LanguageSwitcher />

        <Link
          to="/cart"
          className="navbar-icon"
          aria-label={`Cart with ${cartCount} items`}
        >
          <HiOutlineShoppingBag />

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        <SignedOut>
          <Link to="/login" className="navbar-icon" aria-label="Login">
            <LuUser />
          </Link>
        </SignedOut>
        <SignedIn>
          <Link to="/profile" className="navbar-icon" aria-label="Profile">
            <LuUser />
          </Link>
        </SignedIn>

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
            <LuHouse className="mobile-link-icon" />
            {t("navbar.home")}
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <LuLeaf className="mobile-link-icon" />
            {t("navbar.about")}
          </Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>
            <LuDumbbell className="mobile-link-icon" />
            {t("navbar.services")}
          </Link>
          <Link to="/community" onClick={() => setMenuOpen(false)}>
            <HiOutlineUserGroup className="mobile-link-icon" />
            {t("navbar.community")}
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            <LuMail className="mobile-link-icon" />
            {t("navbar.contact")}
          </Link>
        </div>
        <img src={navArt} alt="" className="mobile-nav-art" />
      </div>

      <nav className="desktop-nav">
        <Link to="/">{t("navbar.home")}</Link>
        <Link to="/about">{t("navbar.about")}</Link>
        <Link to="/services">{t("navbar.services")}</Link>
        <Link to="/community">{t("navbar.community")}</Link>
        <Link to="/contact">{t("navbar.contact")}</Link>
      </nav>
    </header>
  );
}
