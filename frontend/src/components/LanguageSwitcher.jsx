import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TbWorld } from "react-icons/tb";
import { HiChevronDown } from "react-icons/hi2";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  function changeLanguage(lang) {
    document.documentElement.classList.add("changing-dir");

    i18n.changeLanguage(lang).then(() => {
      document.documentElement.dir = i18n.dir(lang);

      requestAnimationFrame(() => {
        document.documentElement.classList.remove("changing-dir");
      });

      setOpen(false);
    });
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-switcher" ref={menuRef}>
      <button className="language-button" onClick={() => setOpen(!open)}>
        <TbWorld size={22} />

        <span>{i18n.language === "en" ? "EN" : "عربي"}</span>

        <HiChevronDown size={18} className={open ? "rotate" : ""} />
      </button>

      {open && (
        <div className="language-menu">
          <button
            className={i18n.language === "en" ? "active" : ""}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>

          <button
            className={i18n.language === "ar" ? "active" : ""}
            onClick={() => changeLanguage("ar")}
          >
            عربي
          </button>
        </div>
      )}
    </div>
  );
}
