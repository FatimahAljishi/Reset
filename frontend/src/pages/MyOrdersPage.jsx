import "./MyOrdersPage.css";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";

export default function MyOrdersPage() {
  const { t, i18n } = useTranslation();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const paidOrders = orders.filter((order) => order.status === "paid");
  const navigate = useNavigate();

  const ORDERS_PER_PAGE = 5;

  const processedOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().replace("#", "");

    return orders
      .filter((order) => order.status === "paid")
      .filter((order) => {
        if (!normalizedSearch) {
          return true;
        }

        return String(order.id).includes(normalizedSearch);
      })
      .sort((firstOrder, secondOrder) => {
        const firstDate = new Date(firstOrder.created_at).getTime();
        const secondDate = new Date(secondOrder.created_at).getTime();

        if (sortOrder === "oldest") {
          return firstDate - secondDate;
        }

        return secondDate - firstDate;
      });
  }, [orders, searchTerm, sortOrder]);

  const totalPages = Math.ceil(processedOrders.length / ORDERS_PER_PAGE);

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

  const paginatedOrders = processedOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!selectedOrder) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

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

        setOrders(Array.isArray(data) ? data : []);
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
    if (!dateValue) return "—";

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
    }).format((halalas ?? 0) / 100);
  };

  const goToPreviousPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages));
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

        <Footer />
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

        {paidOrders.length === 0 ? (
          <section className="my-orders-state">
            <h2>{t("myOrders.emptyTitle")}</h2>

            <p>{t("myOrders.emptyMessage")}</p>

            <button type="button" onClick={() => navigate("/services")}>
              {t("myOrders.exploreServices")}
            </button>
          </section>
        ) : (
          <div className="orders-list-summary">
            <div className="my-orders-controls">
              <label className="my-orders-search">
                <FiSearch aria-hidden="true" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={
                    i18n.language === "ar"
                      ? "ابحثي برقم الطلب"
                      : "Search by order number"
                  }
                  aria-label={
                    i18n.language === "ar"
                      ? "البحث برقم الطلب"
                      : "Search by order number"
                  }
                />

                {searchTerm && (
                  <button
                    type="button"
                    className="my-orders-search-clear"
                    onClick={() => setSearchTerm("")}
                    aria-label={
                      i18n.language === "ar" ? "مسح البحث" : "Clear search"
                    }
                  >
                    <FiX />
                  </button>
                )}
              </label>

              <label className="my-orders-sort">
                <span>
                  {i18n.language === "ar" ? "ترتيب حسب:" : "Sort by:"}
                </span>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="newest">
                    {i18n.language === "ar" ? "الأحدث أولاً" : "Newest first"}
                  </option>

                  <option value="oldest">
                    {i18n.language === "ar" ? "الأقدم أولاً" : "Oldest first"}
                  </option>
                </select>
              </label>
            </div>

            {processedOrders.length === 0 ? (
              <section className="my-orders-no-results">
                <h2>
                  {i18n.language === "ar"
                    ? "لم يتم العثور على طلب"
                    : "No order found"}
                </h2>

                <p>
                  {i18n.language === "ar"
                    ? "تحققي من رقم الطلب وحاولي مرة أخرى."
                    : "Check the order number and try again."}
                </p>

                <button type="button" onClick={() => setSearchTerm("")}>
                  {i18n.language === "ar" ? "مسح البحث" : "Clear search"}
                </button>
              </section>
            ) : (
              <>
                {paginatedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="order-card-summary"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedOrder(order);
                      }
                    }}
                  >
                    <div className="order-info">
                      <span>{t("myOrders.orderNumber2")}</span>
                      <strong>#{order.id}</strong>
                    </div>

                    <div className="order-info">
                      <span>{t("myOrders.total")}</span>

                      <span>
                        {formatPrice(order.total_halalas)}{" "}
                        {t("myOrders.currency")}
                      </span>
                    </div>

                    <div className="order-info">
                      <span>{t("myOrders.orderDate")}</span>
                      <p>{formatDate(order.created_at)}</p>
                    </div>

                    <div className="order-info">
                      <span>{t("myOrders.orderStatus")}</span>
                      <span>{t(`myOrders.status.${order.status}`)}</span>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <nav
                    className="my-orders-pagination"
                    aria-label={
                      i18n.language === "ar" ? "صفحات الطلبات" : "Orders pages"
                    }
                  >
                    <button
                      type="button"
                      className="pagination-arrow"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      aria-label={
                        i18n.language === "ar"
                          ? "الصفحة السابقة"
                          : "Previous page"
                      }
                    >
                      <FiChevronLeft />
                    </button>

                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;

                        return (
                          <button
                            key={pageNumber}
                            type="button"
                            className={
                              currentPage === pageNumber
                                ? "pagination-page pagination-page-active"
                                : "pagination-page"
                            }
                            onClick={() => setCurrentPage(pageNumber)}
                            aria-current={
                              currentPage === pageNumber ? "page" : undefined
                            }
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="pagination-arrow"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      aria-label={
                        i18n.language === "ar" ? "الصفحة التالية" : "Next page"
                      }
                    >
                      <FiChevronRight />
                    </button>
                  </nav>
                )}

                <div className="my-orders-results-info">
                  <p>
                    {i18n.language === "ar" ? (
                      <>
                        عرض {processedOrders.length === 0 ? 0 : startIndex + 1}–
                        {Math.min(
                          startIndex + ORDERS_PER_PAGE,
                          processedOrders.length,
                        )}{" "}
                        من أصل {processedOrders.length} طلب
                      </>
                    ) : (
                      <>
                        Showing{" "}
                        {processedOrders.length === 0 ? 0 : startIndex + 1}–
                        {Math.min(
                          startIndex + ORDERS_PER_PAGE,
                          processedOrders.length,
                        )}{" "}
                        of {processedOrders.length} orders
                      </>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {selectedOrder && (
        <div
          className="trainer-order-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <article
            className="trainer-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainer-order-modal-title"
          >
            <button
              type="button"
              className="trainer-order-modal-close"
              onClick={() => setSelectedOrder(null)}
              aria-label={
                i18n.language === "ar"
                  ? "إغلاق تفاصيل الطلب"
                  : "Close order details"
              }
            >
              <FiX />
            </button>

            <article className="order-card">
              <div className="order-card-header">
                <div>
                  <span id="trainer-order-modal-title" className="order-number">
                    {t("myOrders.orderNumber", {
                      number: selectedOrder.id,
                    })}
                  </span>

                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>

                <span
                  className={`order-status order-status-${selectedOrder.status}`}
                >
                  {t(`myOrders.status.${selectedOrder.status}`)}
                </span>
              </div>

              <div className="order-items">
                {(selectedOrder.items ?? []).map((item) => {
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
                        {formatPrice(item.unit_price_halalas)}{" "}
                        {t("myOrders.currency")}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="order-total">
                <span>{t("myOrders.total")}</span>

                <strong>
                  {formatPrice(selectedOrder.total_halalas)}{" "}
                  {t("myOrders.currency")}
                </strong>
              </div>
            </article>
          </article>
        </div>
      )}
    </>
  );
}
