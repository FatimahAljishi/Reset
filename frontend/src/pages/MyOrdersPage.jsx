import "./MyOrdersPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function MyOrdersPage() {
  const { t, i18n } = useTranslation();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const token = await getToken();
        if (!token) {
          throw new Error("Could not retrieve session token.");
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || t("myOrders.loadError"));
        }
        setOrders(data);
      } catch (error) {
        console.error("Orders fetch error:", error);

        setError(error.message || t("myOrders.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken, isLoaded, isSignedIn, t]);

  const formatDate = (dateValue) => {
    return new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-SA" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateValue));
  };
  const formatPrice = (halalas) => {
    return new Intl.NumberFormat(i18n.language === "ar" ? "ar-SA" : "en-SA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(halalas / 100);
  };

  if (!isLoaded || loading) {
    return (
      <>
        <Navbar />

        <main className="my-orders-page">
          <p className="my-orders-message">{t("myOrders.loading")}</p>
        </main>
      </>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <Navbar />

        <main className="my-orders-page">
          <section className="my-orders-state">
            <h1>{t("myOrders.signInTitle")}</h1>

            <p>{t("myOrders.signInMessage")}</p>

            <button type="button" onClick={() => navigate("/login")}>
              {t("myOrders.signIn")}
            </button>
          </section>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="my-orders-page">
          <section className="my-orders-state">
            <h1>{t("myOrders.errorTitle")}</h1>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              {t("myOrders.tryAgain")}
            </button>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="my-orders-page">
        <header className="my-orders-header">
          <h1>{t("myOrders.title")}</h1>
        </header>

        {orders.length === 0 ? (
          <section className="my-orders-state">
            <h2>{t("myOrders.emptyTitle")}</h2>

            <p>{t("myOrders.emptyMessage")}</p>

            <button type="button" onClick={() => navigate("/services")}>
              {t("myOrders.exploreServices")}
            </button>
          </section>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-number">
                      {t("myOrders.orderNumber", {
                        number: order.id,
                      })}
                    </span>

                    <p>{formatDate(order.created_at)}</p>
                  </div>

                  <span className={`order-status order-status-${order.status}`}>
                    {t(`myOrders.status.${order.status}`)}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => {
                    const serviceTitle =
                      i18n.language === "ar"
                        ? item.service_title_ar
                        : item.service_title_en;

                    const planTitle =
                      i18n.language === "ar"
                        ? item.plan_title_ar
                        : item.plan_title_en;

                    return (
                      <div key={item.id} className="order-item">
                        <div>
                          <h2>{serviceTitle}</h2>
                          <p>{planTitle}</p>

                          {item.quantity > 1 && (
                            <span>
                              {t("myOrders.quantity", {
                                count: item.quantity,
                              })}
                            </span>
                          )}
                        </div>

                        <strong>
                          {formatPrice(item.unit_price_halalas * item.quantity)}{" "}
                          {t("myOrders.currency")}
                        </strong>
                      </div>
                    );
                  })}
                </div>

                <div className="order-total">
                  <span>{t("myOrders.total")}</span>

                  <strong>
                    {formatPrice(order.total_halalas)} {t("myOrders.currency")}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
