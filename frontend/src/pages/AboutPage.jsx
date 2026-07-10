import Navbar from "../components/Navbar";
import "./AboutPage.css";
import portrait from "../assets/portrait.png";
import { useTranslation } from "react-i18next";
import plant from "../assets/plant.png";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="meet-zainab">
          <div className="meet-zainab-text">
            <h1>{t("about.meetZainab.title")}</h1>
            <p>
              <span>{t("about.meetZainab.description1")}</span>
              <span className="accent">
                {t("about.meetZainab.description2")}
              </span>
              <p>{t("about.meetZainab.description3")}</p>
              <p>{t("about.meetZainab.description4")}</p>
              <span className="accent">
                {t("about.meetZainab.description5")}
              </span>
            </p>
          </div>
          <div className="meet-zainab-image">
            <div className="bg-oval">
              <img src={portrait} />
            </div>
          </div>
        </div>
        <div className="why-reset">
          <img src={plant} className="plant-right" />
          <img src={plant} className="plant-left" />
          <h2>{t("about.whyReset.title")}</h2>
          <p>{t("about.whyReset.description1")}</p>
          <p>{t("about.whyReset.description2")}</p>
          <p>{t("about.whyReset.description3")}</p>
          <p className="accent">{t("about.whyReset.description4")}</p>
        </div>
        <div className="about-reset">
          <h1>{t("about.aboutReset.title")}</h1>
          <span>{t("about.aboutReset.description1")}</span>
          <span>{t("about.aboutReset.description2")}</span>
        </div>
      </div>
    </>
  );
}
