import Navbar from "../components/Navbar";
import "./AboutPage.css";
import portrait from "../assets/portrait3.png";
import { useTranslation } from "react-i18next";
import plant from "../assets/plant.svg";
import {
  FaCircleXmark,
  FaCircleCheck,
  FaRegHeart,
  FaScaleBalanced,
} from "react-icons/fa6";
import { LuBookOpen } from "react-icons/lu";
import { CiDumbbell } from "react-icons/ci";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { PiPlantLight } from "react-icons/pi";
import Footer from "../components/Footer";
import capsule from "../assets/vector.svg";
import AnimatedClock from "./AnimatedClock";
import SickZZPlant from "./SickZZPlant";
import DeadSwayingZZPlant from "./DeadSwayingZZPlant";
import leaf from "../assets/leaf.png";
import { motion } from "framer-motion";
import { useRef } from "react";
import SnapSection from "../components/SnapSection";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="meet-zainab-wrapper">
          <div className="meet-zainab">
            <div className="meet-zainab-text">
              <h1>{t("about.meetZainab.title")}</h1>
              <div>
                <span>{t("about.meetZainab.description1")}</span>
                <span className="accent">
                  {t("about.meetZainab.description2")}
                </span>
                <p>{t("about.meetZainab.description3")}</p>
                <p>{t("about.meetZainab.description4")}</p>
                <span className="accent">
                  {t("about.meetZainab.description5")}
                </span>
              </div>
            </div>
            <div className="right-column">
              <div className="meet-zainab-image">
                <div className="portrait-mask">
                  <img src={portrait} alt="Zainab" className="portrait" />
                </div>
              </div>
            </div>
            <div className="why-reset">
              <h1>{t("about.whyReset.title")}</h1>
              <div className="why-reset-item">
                <div className="why-reset-icon">
                  <AnimatedClock />
                </div>
                <p>{t("about.whyReset.description1")}</p>
              </div>
              <div className="why-reset-item">
                <div className="why-reset-icon">
                  <SickZZPlant />
                </div>
                <p>{t("about.whyReset.description2")}</p>
              </div>
              <div className="why-reset-item">
                <div className="why-reset-icon">
                  <DeadSwayingZZPlant />
                </div>
                <p>{t("about.whyReset.description3")}</p>
              </div>
              <div className="why-reset-accent">
                <p>{t("about.whyReset.description4")}</p>
              </div>
            </div>
          </div>
        </div>
        <SnapSection className="about-reset">
          <div className="floating-leaves" aria-hidden="true">
            <img src={leaf} className="about-leaf about-leaf1" alt="" />
            <img src={leaf} className="about-leaf about-leaf2" alt="" />
            <img src={leaf} className="about-leaf about-leaf3" alt="" />
            <img src={leaf} className="about-leaf about-leaf4" alt="" />
            <img src={leaf} className="about-leaf about-leaf5" alt="" />
            <img src={leaf} className="about-leaf about-leaf6" alt="" />
            <img src={leaf} className="about-leaf about-leaf7" alt="" />
            <img src={leaf} className="about-leaf about-leaf8" alt="" />
            <img src={leaf} className="about-leaf about-leaf9" alt="" />
            <img src={leaf} className="about-leaf about-leaf10" alt="" />
          </div>
          <div className="about-reset-text">
            <h1>{t("about.aboutReset.title")}</h1>
            <span>{t("about.aboutReset.description1")}</span>
            <br />
            <span>{t("about.aboutReset.description2")}</span>
          </div>
        </SnapSection>
        <SnapSection className="philosophy-container">
          <fieldset className="philosophy">
            <legend>
              <h1>{t("about.philosophy.title")}</h1>
            </legend>
            <div className="disbeliefs">
              <h2>{t("about.philosophy.disbelief")}</h2>
              <ul>
                <li>
                  <FaCircleXmark className="disbelief-icon" />{" "}
                  <span>{t("about.philosophy.disbelief1")}</span>
                </li>
                <li>
                  <FaCircleXmark className="disbelief-icon" />{" "}
                  <span>{t("about.philosophy.disbelief2")}</span>
                </li>
                <li>
                  <FaCircleXmark className="disbelief-icon" />{" "}
                  <span>{t("about.philosophy.disbelief3")}</span>
                </li>
                <li>
                  <FaCircleXmark className="disbelief-icon" />{" "}
                  <span>{t("about.philosophy.disbelief4")}</span>
                </li>
              </ul>
            </div>
            <div className="beliefs">
              <h2>{t("about.philosophy.belief")}</h2>
              <ul>
                <li>
                  <FaCircleCheck className="belief-icon" />{" "}
                  <span>{t("about.philosophy.belief1")}</span>
                </li>
                <li>
                  <FaCircleCheck className="belief-icon" />{" "}
                  <span>{t("about.philosophy.belief2")}</span>
                </li>
                <li>
                  <FaCircleCheck className="belief-icon" />{" "}
                  <span>{t("about.philosophy.belief3")}</span>
                </li>
                <li>
                  <FaCircleCheck className="belief-icon" />{" "}
                  <span>{t("about.philosophy.belief4")}</span>
                </li>
                <li>
                  <FaCircleCheck className="belief-icon" />{" "}
                  <span>{t("about.philosophy.belief5")}</span>
                </li>
                <li>
                  <FaCircleCheck className="belief-icon" />{" "}
                  <span>{t("about.philosophy.belief6")}</span>
                </li>
              </ul>
            </div>
          </fieldset>
        </SnapSection>
        <SnapSection className="mission-vision-values-container">
          <div className="mission-vision">
            <div className="mission">
              <h1>{t("about.mission.title")}</h1>
              <p>{t("about.mission.description")}</p>
            </div>
            <div className="vision">
              <h1>{t("about.vision.title")}</h1>
              <p>{t("about.vision.description")}</p>
            </div>
          </div>
          <div className="values">
            <h1>{t("about.values.title")}</h1>
            <div className="values-top">
              <div className="value">
                <div className="value-icon">
                  <FaRegHeart />
                </div>
                <p>{t("about.values.value1")}</p>
              </div>
              <div className="value">
                <div className="value-icon">
                  <LuBookOpen />
                </div>
                <p>{t("about.values.value2")}</p>
              </div>
              <div className="value">
                <div className="value-icon">
                  <CiDumbbell />
                </div>
                <p>{t("about.values.value3")}</p>
              </div>
            </div>
            <div className="values-bottom">
              <div className="value">
                <div className="value-icon">
                  <FaScaleBalanced />
                </div>
                <p>{t("about.values.value4")}</p>
              </div>
              <div className="value">
                <div className="value-icon">
                  <HiOutlineUserGroup />
                </div>
                <p>{t("about.values.value5")}</p>
              </div>
              <div className="value">
                <div className="value-icon">
                  <PiPlantLight />
                </div>
                <p>{t("about.values.value6")}</p>
              </div>
            </div>
          </div>
        </SnapSection>
      </div>
      <Footer />
    </>
  );
}
