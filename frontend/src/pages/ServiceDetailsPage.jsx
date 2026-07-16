import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { services } from "../data/services";
import "./ServiceDetailsPage.css";
import Navbar from "../components/Navbar";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { PiPlantLight } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
import hills from "../assets/hills.png";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useUser } from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

export default function ServiceDetailsPage() {
  const { addToCart } = useCart();
  const { isSignedIn } = useUser();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}`,
        );

        if (!response.ok) {
          throw new Error("Service not found.");
        }

        const data = await response.json();

        setService(data);
        setSelectedPlan(data.plans?.[0] ?? null);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const formattedPrice = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(selectedPlan?.price_halalas / 100);

  const iconData = services[serviceId];

  const featuresKey = `serviceDetails.${serviceId}.features`;

  const features = i18n.exists(featuresKey)
    ? t(featuresKey, { returnObjects: true })
    : [];

  function handleAddToCart() {
    if (!isSignedIn) {
      navigate("/login", {
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });

      return;
    }

    if (!selectedPlan) {
      return;
    }

    addToCart({
      cartItemId: selectedPlan.id,
      code: selectedPlan.code,
      serviceId: serviceId,
      planId: selectedPlan.id,
      price: selectedPlan.price_halalas / 100,
      sessions: selectedPlan.sessions,
      quantity: 1,
    });

    navigate("/cart");
  }

  return (
    <>
      <Navbar />
      <div className="service-details-page">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/services")}
        >
          <HiOutlineArrowLeft />
        </button>

        <div className="service-details-header">
          <h1>{t(`serviceDetails.${serviceId}.title`)}</h1>
          <div className="services-divider">
            <span></span>
            <PiPlantLight className="hero-leaf" />
            <span></span>
          </div>

          {serviceId === "group" ? (
            ""
          ) : (
            <p>{t(`serviceDetails.${serviceId}.subtitle`)}</p>
          )}
        </div>

        {features.length > 0 ? (
          <div className="service-features">
            <h2>{t("serviceDetails.includes")}</h2>

            <ul>
              {features.map((feature, index) => (
                <li key={feature}>
                  <span className="feature-icon">{iconData?.icons[index]}</span>
                  <span className="feature-text">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="service-descriptions">
            <p>{t(`serviceDetails.${serviceId}.description1`)}</p>

            <p>{t(`serviceDetails.${serviceId}.description2`)}</p>
          </div>
        )}

        <div className="plan-section">
          <h2>{t("serviceDetails.choosePlan")}</h2>

          <div className="plan-options">
            {selectedPlan &&
              service.plans.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;

                const formattedPrice = new Intl.NumberFormat(i18n.language, {
                  style: "currency",
                  currency: "SAR",
                  maximumFractionDigits: 0,
                }).format(selectedPlan.price_halalas / 100);

                return (
                  <button
                    key={plan.id}
                    type="button"
                    className={`plan-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedPlan(plan)}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <div className="selected-check">
                        <FaCircleCheck />
                      </div>
                    )}
                    {service.slug !== "online" ? (
                      <>
                        <strong className="sessions">{plan.sessions}</strong>
                        <span className="plan-description">
                          {t("serviceDetails.sessions", {
                            count: plan.sessions,
                          })}
                        </span>
                      </>
                    ) : (
                      <strong className="plans">
                        {t(`serviceDetails.${serviceId}.plans.${plan.code}`)}
                      </strong>
                    )}

                    <span className="plan-price">
                      {new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "SAR",
                        maximumFractionDigits: 0,
                      }).format(plan.price_halalas / 100)}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
        <div className="cart-section">
          <div className="cart-summary">
            <div className="total-price">
              <span>{t("serviceDetails.total")}</span>
              <strong>{formattedPrice}</strong>
            </div>

            <button
              type="button"
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              <HiOutlineShoppingBag className="cart-icon" />
              {t("serviceDetails.addToCart")}
            </button>
          </div>
          <img src={hills} className="service-details-hills" />
        </div>
      </div>
      <Footer />
    </>
  );
}
