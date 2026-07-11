import "./CommunityPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LuCoffee } from "react-icons/lu";
import {
  PiPlantLight,
  PiPresentationLight,
  PiSneakerLight,
  PiBarbellLight,
  PiHeartLight,
} from "react-icons/pi";

export default function CommunityPage() {
  const { t } = useTranslation();
  const testimonials = [
    {
      text: t("community.testimonials.testimonial1"),
    },
    {
      text: t("community.testimonials.testimonial2"),
    },
    {
      text: t("community.testimonials.testimonial3"),
    },
    {
      text: t("community.testimonials.testimonial4"),
    },
    {
      text: t("community.testimonials.testimonial5"),
    },
    {
      text: t("community.testimonials.testimonial6"),
    },
    {
      text: t("community.testimonials.testimonial7"),
    },
    {
      text: t("community.testimonials.testimonial8"),
    },
    {
      text: t("community.testimonials.testimonial9"),
    },
    {
      text: t("community.testimonials.testimonial10"),
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialsRef = useRef(null);
  const handleTestimonialScroll = () => {
    const container = testimonialsRef.current;

    if (!container) return;

    const index = Math.round(container.scrollLeft / container.clientWidth);

    setCurrentTestimonial(Math.abs(index));
  };
  const visibleDotCount = 5;

  const getVisibleDotIndexes = () => {
    const total = testimonials.length;
    const half = Math.floor(visibleDotCount / 2);

    let start = currentTestimonial - half;
    let end = currentTestimonial + half;

    if (start < 0) {
      start = 0;
      end = Math.min(visibleDotCount - 1, total - 1);
    }

    if (end >= total) {
      end = total - 1;
      start = Math.max(0, total - visibleDotCount);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };
  return (
    <>
      <Navbar />
      <div className="community-page">
        <div className="community">
          <h1>{t("community.title")}</h1>
          <div className="community-divider">
            <span></span>
            <PiPlantLight className="hero-leaf" />
            <span></span>
          </div>
          <p className="community-description">{t("community.description1")}</p>
          <p className="community-subdescription">
            {t("community.description2")}
          </p>
          <div className="community-cards">
            <div className="community-card">
              <div className="community-icon">
                <HiOutlineUserGroup />
              </div>
              <p>{t("community.community1")}</p>
            </div>
            <div className="community-card">
              <div className="community-icon">
                <LuCoffee />
              </div>
              <p>{t("community.community2")}</p>
            </div>
            <div className="community-card">
              <div className="community-icon">
                <PiPresentationLight />
              </div>
              <p>{t("community.community3")}</p>
            </div>
            <div className="community-card">
              <div className="community-icon">
                <PiSneakerLight />
              </div>
              <p>{t("community.community4")}</p>
            </div>
            <div className="community-card">
              <div className="community-icon">
                <PiBarbellLight />
              </div>
              <p>{t("community.community5")}</p>
            </div>
            <div className="community-card">
              <div className="community-icon">
                <PiHeartLight />
              </div>
              <p>{t("community.community6")}</p>
            </div>
          </div>
          <p className="community-text">{t("community.community7")}</p>
        </div>
        <div className="testimonials" dir="rtl">
          <h2>{t("community.testimonials.title")}</h2>

          <div
            className="testimonials-slider"
            ref={testimonialsRef}
            onScroll={handleTestimonialScroll}
          >
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <span className="testimonial-quote">❞</span>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {getVisibleDotIndexes().map((index) => (
              <span
                key={index}
                className={currentTestimonial === index ? "active" : ""}
              />
            ))}
          </div>
        </div>
        <div className="community-footer">
          <h2>{t("community.footer.title")}</h2>
          <p>{t("community.footer.description")}</p>
          <Link to="/services" className="community-btn">
            {t("community.footer.start")}
          </Link>
        </div>
      </div>
    </>
  );
}
