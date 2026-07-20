import "./Hero.css";
import heroArt from "../assets/hills.png";
import { useTranslation } from "react-i18next";
import heroPortrait from "../assets/portrait.png";
import { PiPlantLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import plant from "../assets/plant.png";

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
          <Link to="/services" className="primary-btn">
            {t("hero.start")}
          </Link>
        </div>
      </div>

      <div className="hero-hills">
        <img src={heroArt} alt="" className="hero-art" />
      </div>
      <img src={heroPortrait} alt="" className="hero-portrait" />
      {/*<div className="plant-decoration" aria-hidden="true">
        <img src={plant} />
      </div>*/}
    </section>
  );
}
