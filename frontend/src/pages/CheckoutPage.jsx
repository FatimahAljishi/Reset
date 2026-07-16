import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import Moyasar from "moyasar-payment-form";
import "moyasar-payment-form/dist/moyasar.css";
import Navbar from "../components/Navbar";
import "./CheckoutPage.css";
import { useAuth } from "@clerk/clerk-react";
import Footer from "../components/Footer";

function CheckoutPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { cartItems, cartTotal, customerPhone } = useCart();

  const formInitialized = useRef(false);

  const cleanedPhone = customerPhone?.replace(/\s/g, "") || "";

  const fullPhoneNumber = cleanedPhone.startsWith("05")
    ? `+966${cleanedPhone.slice(1)}`
    : cleanedPhone;

  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");
  const orderCreationStarted = useRef(false);
  const { getToken } = useAuth();

  useEffect(() => {
    if (orderCreationStarted.current) return;

    if (!cartItems?.length || !fullPhoneNumber) {
      setOrderLoading(false);
      return;
    }

    const savedOrder = localStorage.getItem("resetPendingOrder");

    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);

      if (parsedOrder.status === "pending") {
        setOrder(parsedOrder);
        setOrderLoading(false);
        orderCreationStarted.current = true;
        return;
      }
    }

    orderCreationStarted.current = true;

    const createPendingOrder = async () => {
      try {
        setOrderLoading(true);
        setOrderError("");
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone: fullPhoneNumber,
            items: cartItems.map((item) => ({
              plan_id: item.planId,
              quantity: item.quantity ?? 1,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Could not create the order.");
        }

        setOrder(data);

        localStorage.setItem("resetPendingOrder", JSON.stringify(data));
      } catch (error) {
        console.error("Order creation error:", error);
        setOrderError(error.message);
        orderCreationStarted.current = false;
      } finally {
        setOrderLoading(false);
      }
    };

    createPendingOrder();
  }, [cartItems, fullPhoneNumber]);

  useEffect(() => {
    if (!order || !order.total_halalas || formInitialized.current) {
      return;
    }

    const amountInHalalas = order.total_halalas;

    localStorage.setItem(
      "resetPendingPayment",
      JSON.stringify({
        orderId: order.id,
        phone: fullPhoneNumber,
      }),
    );

    formInitialized.current = true;

    Moyasar.init({
      element: ".mysr-form",
      amount: amountInHalalas,
      currency: "SAR",
      description: `Reset order #${order.id}`,
      publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY,
      callback_url: `${window.location.origin}/payment-result`,
      methods: ["creditcard"],
      supported_networks: ["mada", "visa", "mastercard"],
      language: i18n.language === "ar" ? "ar" : "en",
      fixed_width: false,
      metadata: {
        order_id: String(order.id),
        customer_phone: fullPhoneNumber,
      },
    });
  }, [order, i18n.language, fullPhoneNumber]);

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
      <Footer />
    </>
  );
}

export default CheckoutPage;
