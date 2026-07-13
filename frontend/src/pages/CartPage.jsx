import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import "./CartPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { PiPlantLight } from "react-icons/pi";
import emptyCartImage from "../assets/cart.png";

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    cartItems,
    cartLoaded,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
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
      </>
    );
  }

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
                      {t(
                        `serviceDetails.${item.serviceId}.plans.${item.planId}`,
                      )}
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
              onClick={() => navigate("/checkout")}
            >
              {t("cart.checkout")}
            </button>
          </aside>
        </div>
      </main>
    </>
  );
}
