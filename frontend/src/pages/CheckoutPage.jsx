import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import Moyasar from "moyasar-payment-form";
import "moyasar-payment-form/dist/moyasar.css";
import Navbar from "../components/Navbar";
import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { cartItems, cartTotal, customerPhone } = useCart();

  const formInitialized = useRef(false);

  const cleanedPhone = customerPhone?.replace(/\s/g, "") || "";

  const fullPhoneNumber = cleanedPhone.startsWith("05")
    ? `+966${cleanedPhone.slice(1)}`
    : cleanedPhone;

  useEffect(() => {
    if (!cartItems?.length || !cartTotal || formInitialized.current) {
      return;
    }

    formInitialized.current = true;

    const amountInHalalas = Math.round(Number(cartTotal) * 100);

    localStorage.setItem(
      "resetPendingPayment",
      JSON.stringify({
        expectedAmount: amountInHalalas,
        phone: fullPhoneNumber,
      }),
    );

    Moyasar.init({
      element: ".mysr-form",

      amount: Math.round(cartTotal * 100),

      currency: "SAR",

      description: "Reset by Zainab order",

      publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY,

      callback_url: `${window.location.origin}/payment-result`,

      methods: ["creditcard"],

      supported_networks: ["mada", "visa", "mastercard"],

      language: i18n.language === "ar" ? "ar" : "en",

      fixed_width: false,

      metadata: {
        customer_phone: fullPhoneNumber,
      },
    });
  }, [cartItems, cartTotal, i18n.language, fullPhoneNumber]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="checkout-page checkout-empty">
          <h1>{t("checkout.noOrder")}</h1>

          <p>{t("checkout.emptyCart")}</p>

          <button type="button" onClick={() => navigate("/cart")}>
            {t("checkout.returnToCart")}
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <button
          type="button"
          className="checkout-back-button"
          onClick={() => navigate("/cart")}
        >
          {t("checkout.back")}
        </button>

        <h1>{t("checkout.title")}</h1>

        <section className="checkout-details">
          <div className="checkout-detail">
            <span>{t("checkout.phone")}</span>
            <strong dir="ltr">{fullPhoneNumber}</strong>
          </div>

          <div className="checkout-detail">
            <span>{t("checkout.total")}</span>

            <strong>
              {cartTotal} {t("checkout.currency")}
            </strong>
          </div>
        </section>

        <section className="payment-section">
          <h2>{t("checkout.cardDetails")}</h2>

          <div className="mysr-form"></div>
        </section>
      </main>
    </>
  );
}

export default CheckoutPage;
