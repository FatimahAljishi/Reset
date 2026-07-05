import "./Hero.css";
import heroArt from "../assets/hero-art.png";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          {t("hero.title1")}
          <br />
          {t("hero.title2")}
          <br />
          {t("hero.title3")}
          <br />
          <span>{t("hero.title4")}</span>
        </h1>

        <p>{t("hero.description")}</p>

        <div className="hero-buttons">
          <button className="primary-btn">{t("hero.explore")}</button>
          <button className="secondary-btn">{t("hero.book")}</button>
        </div>
      </div>

      <img src={heroArt} alt="" className="hero-art" />
    </section>
  );
}
