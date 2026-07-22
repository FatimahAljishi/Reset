import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import "./CartPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { PiPlantLight } from "react-icons/pi";
import emptyCartImage from "../assets/cart.png";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Footer from "../components/Footer";

export default function CartPage() {
  const [phoneError, setPhoneError] = useState("");
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    cartItems,
    cartLoaded,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    customerPhone,
    setCustomerPhone,
  } = useCart();

  if (!cartLoaded) {
    return (
      <main className="cart-page">
        <p>{t("cart.loading")}</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="cart-page empty-cart">
          <h1>{t("cart.title")}</h1>
          <div className="services-divider">
            <span></span>
            <PiPlantLight className="hero-leaf" />
            <span></span>
          </div>
          <div className="empty-cart-content">
            <img src={emptyCartImage} className="empty-cart-image" />
            <h2>{t("cart.empty")}</h2>
            <p>{t("cart.emptyMessage")}</p>

            <button type="button" onClick={() => navigate("/services")}>
              {t("cart.explore")}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const validatePhone = () => {
    const cleanedPhone = customerPhone.replace(/\s/g, "");

    if (!cleanedPhone) {
      setPhoneError(t("cart.phoneRequired"));
      return false;
    }

    if (!/^05\d{8}$/.test(cleanedPhone)) {
      setPhoneError(t("cart.phoneInvalid"));
      return false;
    }

    setPhoneError("");
    return true;
  };

  const handleCheckout = () => {
    if (!validatePhone()) return;

    setCustomerPhone(customerPhone.replace(/\s/g, ""));

    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <h1>{t("cart.title")}</h1>
        <div className="services-divider">
          <span></span>
          <PiPlantLight className="hero-leaf" />
          <span></span>
        </div>

        <div className="cart-content">
          <section className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.cartItemId}>
                <div className="cart-item-info">
                  <h2>{t(`serviceDetails.${item.serviceId}.title`)}</h2>
                  {!item.sessions && (
                    <p>
                      {t(`serviceDetails.${item.serviceId}.plans.${item.code}`)}
                    </p>
                  )}

                  {item.sessions && (
                    <p>
                      {item.sessions}{" "}
                      {t("serviceDetails.sessions", {
                        count: item.sessions,
                      })}
                    </p>
                  )}
                  <strong>
                    {new Intl.NumberFormat(i18n.language, {
                      style: "currency",
                      currency: "SAR",
                      maximumFractionDigits: 0,
                    }).format(item.price)}
                  </strong>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.cartItemId)}
                      aria-label="Decrease quantity"
                    >
                      <FiMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.cartItemId)}
                      aria-label="Increase quantity"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.cartItemId)}
                    aria-label={`Remove ${item.title}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="phone-section">
            <div className="phone-section-header">
              <div>
                <h3>{t("cart.phoneLabel")}</h3>
                <p>{t("cart.phoneDescription")}</p>
              </div>
            </div>

            <div className="phone-input-group">
              <span className="phone-icon">
                <FaWhatsapp />
              </span>

              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={customerPhone}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setCustomerPhone(value);

                  if (phoneError) {
                    setPhoneError("");
                  }
                }}
                onBlur={validatePhone}
                placeholder="05XXXXXXXX"
                aria-label={t("cart.phoneLabel")}
                aria-invalid={Boolean(phoneError)}
                aria-describedby={phoneError ? "phone-error" : "phone-help"}
              />
            </div>

            {phoneError && (
              <p className="phone-error" id="phone-error">
                {phoneError}
              </p>
            )}
          </section>

          <aside className="order-summary">
            <h2>{t("cart.summary")}</h2>

            <div className="summary-row">
              <span>{t("cart.total")}</span>

              <strong>
                {new Intl.NumberFormat(i18n.language, {
                  style: "currency",
                  currency: "SAR",
                  maximumFractionDigits: 0,
                }).format(cartTotal)}
              </strong>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              {t("cart.checkout")}
            </button>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
