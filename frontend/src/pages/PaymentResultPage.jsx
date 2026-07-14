import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import "./PaymentResultPage.css";

function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const { clearCheckout } = useCart();

  const [paymentStatus, setPaymentStatus] = useState("checking");

  const [errorMessage, setErrorMessage] = useState("");

  const paymentId = searchParams.get("id");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    const verifyPayment = async () => {
      if (!paymentId) {
        setPaymentStatus("failed");
        setErrorMessage(t("paymentResult.missingPaymentId"));
        return;
      }

      const savedPayment = localStorage.getItem("resetPendingPayment");

      const pendingPayment = savedPayment ? JSON.parse(savedPayment) : null;

      if (!pendingPayment?.expectedAmount) {
        setPaymentStatus("failed");
        setErrorMessage(t("paymentResult.missingOrder"));
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/payments/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payment_id: paymentId,
              expected_amount: pendingPayment.expectedAmount,
            }),
          },
        );

        const data = await response.json();

        /*console.log("Verification response:", data);*/

        if (!response.ok || !data.verified) {
          throw new Error(data.detail || t("paymentResult.verificationFailed"));
        }

        setPaymentStatus("success");

        clearCheckout();

        localStorage.removeItem("resetPendingPayment");
      } catch (error) {
        console.error("Payment verification error:", error);

        setPaymentStatus("failed");

        setErrorMessage(error.message || t("paymentResult.verificationFailed"));
      }
    };

    verifyPayment();
  }, [paymentId, clearCheckout, t]);

  return (
    <>
      <Navbar />

      <main className="payment-result-page">
        {paymentStatus === "checking" && (
          <section className="payment-result-card">
            <div className="payment-loader"></div>

            <h1>{t("paymentResult.checkingTitle")}</h1>

            <p>{t("paymentResult.checkingMessage")}</p>
          </section>
        )}

        {paymentStatus === "success" && (
          <section className="payment-result-card">
            <div className="payment-result-icon success-icon">✓</div>

            <h1>{t("paymentResult.successTitle")}</h1>

            <p>{t("paymentResult.successMessage")}</p>

            <button type="button" onClick={() => navigate("/")}>
              {t("paymentResult.returnHome")}
            </button>
          </section>
        )}

        {paymentStatus === "failed" && (
          <section className="payment-result-card">
            <div className="payment-result-icon failed-icon">×</div>

            <h1>{t("paymentResult.failedTitle")}</h1>

            <p>{errorMessage || t("paymentResult.failedMessage")}</p>

            <button type="button" onClick={() => navigate("/checkout")}>
              {t("paymentResult.tryAgain")}
            </button>
          </section>
        )}
      </main>
    </>
  );
}

export default PaymentResultPage;
