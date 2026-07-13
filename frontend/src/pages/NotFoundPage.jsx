import { useNavigate } from "react-router-dom";
import { PiPlantLight } from "react-icons/pi";
import { IoArrowBackOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import "./NotFoundPage.css";
import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="not-found-page">
        <section className="not-found-content">
          <p className="not-found-label">{t("notFound.label")}</p>

          <div className="not-found-number" aria-hidden="true">
            <span>4</span>

            <div className="lost-zero">
              <div className="face">
                <span className="eye eye-left"></span>
                <span className="eye eye-right"></span>
                <span className="mouth"></span>
              </div>

              <span className="sweat-drop"></span>
            </div>

            <span>4</span>
          </div>

          <div className="not-found-divider">
            <span></span>
            <PiPlantLight />
            <span></span>
          </div>

          <h1>{t("notFound.title")}</h1>

          <p className="not-found-message">{t("notFound.message")}</p>

          <div className="speech-bubble">{t("notFound.bubble")}</div>

          <div className="lost-mat-illustration" aria-hidden="true">
            <div className="mat-roll"></div>
            <div className="mat-body">
              <span className="mat-eye mat-eye-left"></span>
              <span className="mat-eye mat-eye-right"></span>
              <span className="mat-mouth"></span>
            </div>

            <div className="small-dumbbell">
              <span></span>
              <i></i>
              <span></span>
            </div>
          </div>

          <p className="not-found-help">{t("notFound.help")}</p>

          <div className="not-found-actions">
            <button
              type="button"
              className="home-button"
              onClick={() => navigate("/")}
            >
              {t("notFound.home")}
            </button>

            <button
              type="button"
              className="previous-button"
              onClick={() => navigate(-1)}
            >
              <IoArrowBackOutline />
              {t("notFound.back")}
            </button>
          </div>
        </section>

        <div className="not-found-hills" aria-hidden="true">
          <div className="hill hill-back"></div>
          <div className="hill hill-middle"></div>
          <div className="hill hill-front"></div>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
