import "./ServicesPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { PiPlantLight } from "react-icons/pi";
import hills from "../assets/hills.png";
import { LuVideo, LuClipboardList, LuSlidersHorizontal } from "react-icons/lu";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import plant from "../assets/plants.png";
import { useNavigate } from "react-router-dom";

export default function ResetOnlinePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="services-page">
        <img src={plant} className="services-plant-right" />
        <img src={plant} className="services-plant-left" />
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/services")}
        >
          <HiOutlineArrowLeft />
        </button>
        <h1>{t("resetOnline.title")}</h1>
        <div className="services-divider">
          <span></span>
          <PiPlantLight className="hero-leaf" />
          <span></span>
        </div>
        <p className="services-subtitle">{t("resetOnline.description")}</p>
        <div className="services-cards">
          <Link to="/services/online" className="services-card">
            <div className="services-icon">
              <LuVideo />
            </div>
            <div className="services-card-content">
              <h2>{t("resetOnline.services.liveCoaching.title")}</h2>
              <p>{t("resetOnline.services.liveCoaching.description")}</p>
            </div>
            <div className="arrow-btn">
              <HiOutlineArrowRight />
            </div>
          </Link>
          <Link to="/services/ready-programs" className="services-card">
            <div className="services-icon">
              <LuClipboardList />
            </div>
            <div className="services-card-content">
              <h2>{t("resetOnline.services.readyMade.title")}</h2>
              <p>{t("resetOnline.services.readyMade.description")}</p>
            </div>
            <div className="arrow-btn">
              <HiOutlineArrowRight />
            </div>
          </Link>
          <Link to="/services/personalized-programs" className="services-card">
            <div className="services-icon">
              <LuSlidersHorizontal />
            </div>
            <div className="services-card-content">
              <h2>{t("resetOnline.services.personalized.title")}</h2>
              <p>{t("resetOnline.services.personalized.description")}</p>
            </div>
            <div className="arrow-btn">
              <HiOutlineArrowRight />
            </div>
          </Link>
        </div>
        <img src={hills} className="services-hills" />
      </div>
      <Footer />
    </>
  );
}
