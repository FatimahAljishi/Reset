import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyJourneyPage.css";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { FaFilePdf } from "react-icons/fa6";

export default function MyJourneyPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchJourney = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/journey`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load journey.");
        }

        setJourney(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [getToken, isLoaded, isSignedIn]);

  const viewTrainingPlan = async (orderItemId) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/journey/order-items/${orderItemId}/plan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load PDF.");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Unable to open training plan.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="journey-page">
          <div className="journey-container">
            <p>Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="journey-page">
          <div className="journey-container">
            <p>{error}</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="journey-page">
        <div className="journey-container">
          <h1>{t("myJourney.title")}</h1>
          <p>{t("myJourney.subtitle")}</p>
        </div>

        {journey.active_plans.length === 0 ? (
          <div className="journey-empty">
            <h2>{t("myJourney.emptyTitle")}</h2>
            <p>{t("myJourney.emptyMessage")}</p>
          </div>
        ) : (
          <div className="journey-cards">
            {journey.active_plans.map((plan) => (
              <div className="journey-card" key={plan.order_item_id}>
                <div className="journey-card-header">
                  <div className="journey-card-title">
                    <h3>
                      {i18n.language === "ar" ? plan.service_ar : plan.service}
                    </h3>

                    <p>{i18n.language === "ar" ? plan.plan_ar : plan.plan}</p>
                  </div>

                  <span className="journey-order-number">
                    {t("myJourney.orderNumber")} #{plan.order_id}
                  </span>
                </div>
                {plan.total_sessions && (
                  <>
                    <div className="journey-progress-section">
                      <div className="journey-progress-labels">
                        <strong>
                          {plan.sessions_completed} / {plan.total_sessions}{" "}
                          {t("myJourney.sessions")}
                        </strong>

                        <span>{Math.round(plan.progress_percentage)}%</span>
                      </div>

                      <div className="journey-progress">
                        <div
                          className="journey-progress-fill"
                          style={{
                            width: `${plan.progress_percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="journey-card-footer">
                      <span className="journey-remaining">
                        {plan.sessions_remaining}{" "}
                        {t("myJourney.sessionsRemaining")}
                      </span>

                      <div
                        className={`journey-status ${plan.fulfillment_status.replace("_", "-")}`}
                      >
                        {plan.fulfillment_status === "needs_contact" &&
                          t("myJourney.needsContact")}

                        {plan.fulfillment_status === "contacted" &&
                          t("myJourney.contacted")}

                        {plan.fulfillment_status === "in_progress" &&
                          t("myJourney.inProgress")}

                        {plan.fulfillment_status === "completed" &&
                          t("myJourney.completed")}
                      </div>
                    </div>
                  </>
                )}
                {plan.plan_pdf_key && (
                  <button
                    className="journey-download-button"
                    onClick={() => viewTrainingPlan(plan.order_item_id)}
                  >
                    <FaFilePdf /> {t("myJourney.downloadPlan")}
                  </button>
                )}
                {!plan.plan_pdf_key && !plan.total_sessions && (
                  <div className="journey-waiting">
                    {t("myJourney.noPlanAvailable")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
