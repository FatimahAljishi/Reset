import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import "./TrainerDashboardPage.css";

function TrainerDashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { t, i18n } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

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
          throw new Error(t("trainerDashboard.tokenError"));
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/trainer/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || t("trainerDashboard.loadError"));
        }

        setOrders(data);
      } catch (error) {
        console.error("Trainer orders fetch error:", error);

        setError(error.message || t("trainerDashboard.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken, isLoaded, isSignedIn, t]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const searchableText = [
        order.customer_name,
        order.customer_email,
        order.phone,
        String(order.id),
        ...order.items.flatMap((item) => [item.service, item.plan]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
      const first = new Date(a.created_at).getTime();
      const second = new Date(b.created_at).getTime();

      return sortOrder === "newest" ? second - first : first - second;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortOrder]);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      paid: orders.filter((order) => order.status === "paid").length,
      pending: orders.filter((order) => order.status === "pending").length,
      revenueHalalas: orders
        .filter((order) => order.status === "paid")
        .reduce((sum, order) => sum + order.total_halalas, 0),
    };
  }, [orders]);

  const formatDate = (dateValue) => {
    return new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-SA" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
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

        <main className="trainer-dashboard-page">
          <p className="trainer-dashboard-message">
            {t("trainerDashboard.loading")}
          </p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="trainer-dashboard-page">
          <section className="trainer-dashboard-state">
            <h1>{t("trainerDashboard.errorTitle")}</h1>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              {t("trainerDashboard.tryAgain")}
            </button>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="trainer-dashboard-page">
        <h1>{t("trainerDashboard.title")}</h1>

        <section className="trainer-summary-grid">
          <article className="trainer-summary-card">
            <span>{t("trainerDashboard.summary.totalOrders")}</span>
            <strong>{summary.paid}</strong>
          </article>

          <article className="trainer-summary-card">
            <span>{t("trainerDashboard.summary.revenue")}</span>

            <strong>
              {formatPrice(summary.revenueHalalas)}{" "}
              {t("trainerDashboard.currency")}
            </strong>
          </article>
        </section>

        <section className="trainer-dashboard-controls">
          <label className="trainer-search-field">
            <span>{t("trainerDashboard.searchLabel")}</span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t("trainerDashboard.searchPlaceholder")}
            />
          </label>

          <label className="trainer-filter-field">
            <span>{t("trainerDashboard.filterLabel")}</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">{t("trainerDashboard.filters.all")}</option>

              <option value="paid">{t("trainerDashboard.filters.paid")}</option>

              <option value="pending">
                {t("trainerDashboard.filters.pending")}
              </option>

              <option value="failed">
                {t("trainerDashboard.filters.failed")}
              </option>

              <option value="expired">
                {t("trainerDashboard.filters.expired")}
              </option>
            </select>
          </label>

          <label className="trainer-filter-field">
            <span>{t("trainerDashboard.sortLabel")}</span>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">
                {t("trainerDashboard.sort.newest")}
              </option>

              <option value="oldest">
                {t("trainerDashboard.sort.oldest")}
              </option>
            </select>
          </label>
        </section>

        {orders.length === 0 ? (
          <section className="trainer-dashboard-state">
            <h2>{t("trainerDashboard.emptyTitle")}</h2>
            <p>{t("trainerDashboard.emptyMessage")}</p>
          </section>
        ) : filteredOrders.length === 0 ? (
          <section className="trainer-dashboard-state">
            <h2>{t("trainerDashboard.noResultsTitle")}</h2>
            <p>{t("trainerDashboard.noResultsMessage")}</p>
          </section>
        ) : (
          <section className="trainer-orders-list">
            {filteredOrders.map((order) => (
              <article key={order.id} className="trainer-order-card">
                <div className="trainer-order-header">
                  <div>
                    <span className="trainer-order-number">
                      {t("trainerDashboard.orderNumber", {
                        number: order.id,
                      })}
                    </span>

                    <p>{formatDate(order.created_at)}</p>
                  </div>

                  <span
                    className={`trainer-order-status trainer-order-status-${order.status}`}
                  >
                    {t(`trainerDashboard.status.${order.status}`, {
                      defaultValue: order.status,
                    })}
                  </span>
                </div>

                <div className="trainer-customer-details">
                  <div>
                    <span>{t("trainerDashboard.customerName")}</span>
                    <strong>{order.customer_name}</strong>
                  </div>

                  <div>
                    <span>{t("trainerDashboard.customerEmail")}</span>

                    <a href={`mailto:${order.customer_email}`}>
                      {order.customer_email}
                    </a>
                  </div>

                  <div>
                    <span>{t("trainerDashboard.phone")}</span>

                    <a href={`tel:${order.phone}`} dir="ltr">
                      {order.phone}
                    </a>
                  </div>
                </div>

                <div className="trainer-order-items">
                  <h2>{t("trainerDashboard.purchasedServices")}</h2>

                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${item.service}-${item.plan}-${index}`}
                      className="trainer-order-item"
                    >
                      <div>
                        <strong>{item.service}</strong>
                        <span>{item.plan}</span>
                      </div>

                      {item.quantity > 1 && (
                        <span className="trainer-order-quantity">
                          {t("trainerDashboard.quantity", {
                            count: item.quantity,
                          })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="trainer-order-total">
                  <span>{t("trainerDashboard.total")}</span>

                  <strong>
                    {formatPrice(order.total_halalas)}{" "}
                    {t("trainerDashboard.currency")}
                  </strong>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default TrainerDashboardPage;
