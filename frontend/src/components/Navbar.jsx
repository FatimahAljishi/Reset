import "./Navbar.css";
import logo from "../assets/reset-logo-transparent.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import navArt from "../assets/hero-art.png";
import { IoMdClose } from "react-icons/io";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuHouse,
  LuDumbbell,
  LuLeaf,
  LuUser,
  LuMail,
  LuClipboardList,
  LuClipboard,
  LuLogOut,
  LuSettings,
  LuLayoutDashboard,
} from "react-icons/lu";
import { HiOutlineUserGroup, HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../context/CartContext";
import defaultAvatar from "../assets/default-avatar.png";

export default function Navbar() {
  const { cartCount } = useCart();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleProfileClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleProfileClick);
    return () => document.removeEventListener("mousedown", handleProfileClick);
  }, []);

  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const isTrainer = user?.publicMetadata?.role === "trainer";

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
          <button className="profile-btn" onClick={() => navigate("/login")}>
            <LuUser />
          </button>
        </SignedOut>
        <SignedIn>
          <button
            className="profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <LuUser />
          </button>
        </SignedIn>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <HiOutlineBars3 />
        </button>
      </div>

      {profileOpen && (
        <div
          className="profile-overlay"
          onClick={() => setProfileOpen(false)}
        />
      )}

      <div className={`profile-menu ${profileOpen ? "open" : ""}`}>
        <button
          type="button"
          className="close-menu"
          onClick={() => setProfileOpen(false)}
          aria-label="Close profile menu"
        >
          <IoMdClose />
        </button>
        {isSignedIn && isLoaded && user && (
          <>
            <img
              src={user.hasImage ? user.imageUrl : defaultAvatar}
              className="profile-avatar"
            />

            <p>
              {t("profile.welcome")}, {user.fullName}!
            </p>

            <div className="mobile-links">
              {isTrainer && (
                <Link
                  to="/trainer-dashboard"
                  onClick={() => setProfileOpen(false)}
                >
                  <LuLayoutDashboard className="mobile-link-icon" />
                  {t("profile.trainerDashboard")}
                </Link>
              )}
              <Link to="/my-orders" onClick={() => setProfileOpen(false)}>
                <LuClipboardList className="mobile-link-icon" />
                {t("myOrders.title")}
              </Link>
              <Link
                to="/profile/settings"
                onClick={() => setProfileOpen(false)}
              >
                <LuSettings className="mobile-link-icon" />
                {t("profile.manageAccount")}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ redirectUrl: "/" })}
                className="sign-out-btn"
              >
                <LuLogOut className="mobile-link-icon" />
                {t("profile.signOut")}
              </button>
            </div>
          </>
        )}
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
