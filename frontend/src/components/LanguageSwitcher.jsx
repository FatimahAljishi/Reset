import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function changeLanguage(lang) {
    document.documentElement.classList.add("changing-dir");

    i18n.changeLanguage(lang).then(() => {
      document.documentElement.dir = i18n.dir(lang);

      requestAnimationFrame(() => {
        document.documentElement.classList.remove("changing-dir");
      });
    });
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
