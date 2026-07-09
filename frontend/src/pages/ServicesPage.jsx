import "./ServicesPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { PiPlantLight } from "react-icons/pi";
import hills from "../assets/hills.png";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LuLaptop } from "react-icons/lu";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="services-page">
        <h1>{t("services.title")}</h1>
        <div className="services-divider">
          <span></span>
          <PiPlantLight className="hero-leaf" />
          <span></span>
        </div>
        <p className="services-subtitle">{t("services.subtitle")}</p>
        <div className="services-cards">
          <Link to="/" className="services-card">
            <div className="services-icon">
              <HiOutlineUser />
            </div>
            <div className="services-card-content">
              <h2>{t("services.service1.title")}</h2>
              <p>{t("services.service1.description")}</p>
            </div>
            <div className="arrow-btn">
              <HiOutlineArrowRight />
            </div>
          </Link>
          <Link to="/" className="services-card">
            <div className="services-icon">
              <HiOutlineUserGroup />
            </div>
            <div className="services-card-content">
              <h2>{t("services.service2.title")}</h2>
              <p>{t("services.service2.description")}</p>
            </div>
            <div className="arrow-btn">
              <HiOutlineArrowRight />
            </div>
          </Link>
          <Link to="/" className="services-card">
            <div className="services-icon">
              <LuLaptop />
            </div>
            <div className="services-card-content">
              <h2>{t("services.service3.title")}</h2>
              <p>{t("services.service3.description")}</p>
            </div>
            <div className="arrow-btn">
              <HiOutlineArrowRight />
            </div>
          </Link>
        </div>
        <div className="services-footer">
          <h3>{t("services.footer.title")}</h3>
          <div className="services-footer-divider">
            <span></span>
            <PiPlantLight className="hero-leaf" />
            <span></span>
          </div>
          <p>{t("services.footer.subtitle1")}</p>
          <p>{t("services.footer.subtitle2")}</p>
        </div>
        <img src={hills} className="services-hills" />
      </div>
    </>
  );
}
