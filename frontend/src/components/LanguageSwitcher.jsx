import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function changeLanguage(language) {
    i18n.changeLanguage(language);
  }

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage("en")}
        disabled={i18n.language === "en"}
      >
        EN
      </button>

      <span>|</span>

      <button
        onClick={() => changeLanguage("ar")}
        disabled={i18n.language === "ar"}
      >
        عربي
      </button>
    </div>
  );
}
