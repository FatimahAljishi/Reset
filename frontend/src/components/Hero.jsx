import "./Hero.css";
import heroArt from "../assets/hero-art.png";
import { useTranslation } from "react-i18next";
import heroPortrait from "../assets/portrait.png";
import { PiPlantLight } from "react-icons/pi";

export default function Hero() {
  const { t } = useTranslation();
  const heading = t("hero.mainHeading", { returnObjects: true });
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          {heading.map((line, index) => (
            <span
              key={index}
              className={`hero-line ${line.accent ? "accent" : ""}`}
            >
              {line.text}
            </span>
          ))}
        </h1>

        <div className="hero-divider">
          <span></span>
          <PiPlantLight className="hero-leaf" />
          <span></span>
        </div>

        <p>{t("hero.subHeading")}</p>

        <div className="hero-buttons">
          <button className="primary-btn">{t("hero.start")}</button>
        </div>
      </div>

      <img src={heroArt} alt="" className="hero-art" />
      <img src={heroPortrait} alt="" className="hero-portrait" />
    </section>
  );
}
