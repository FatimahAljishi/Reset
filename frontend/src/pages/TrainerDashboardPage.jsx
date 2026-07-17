import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./TrainerDashboardPage.css";

const ORDERS_PER_PAGE = 5;

function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return (
      <span className="trainer-sort-icon trainer-sort-icon-inactive">
        <FiChevronUp />
        <FiChevronDown />
      </span>
    );
  }

  return sortConfig.direction === "asc" ? (
    <FiChevronUp className="trainer-sort-icon" />
  ) : (
    <FiChevronDown className="trainer-sort-icon" />
  );
}

function TrainerDashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortConfig]);

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

  const handleSort = (key) => {
    setSortConfig((currentSort) => {
      if (currentSort.key === key) {
        return {
          key,
          direction: currentSort.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: "desc",
      };
    });
  };

  const processedOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredOrders = orders.filter((order) => {
      const orderStatus = order.status?.toLowerCase() || "";

      const matchesStatus =
        statusFilter === "all" || orderStatus === statusFilter;

      const customerName = order.customer_name;

      const matchesCustomer = customerName
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesOrderNumber = String(order.id).includes(
        normalizedSearch.replace("#", ""),
      );

      const matchesService = order.items?.some((item) => {
        const serviceName = item.service;

        const planName = item.plan;

        return (
          serviceName.toLowerCase().includes(normalizedSearch) ||
          planName.toLowerCase().includes(normalizedSearch)
        );
      });

      const matchesSearch =
        normalizedSearch === "" ||
        matchesCustomer ||
        matchesOrderNumber ||
        matchesService;

      return matchesStatus && matchesSearch;
    });

    return [...filteredOrders].sort((firstOrder, secondOrder) => {
      let firstValue;
      let secondValue;

      if (sortConfig.key === "created_at") {
        firstValue = new Date(firstOrder.created_at).getTime();
        secondValue = new Date(secondOrder.created_at).getTime();
      } else {
        firstValue = Number(firstOrder.id);
        secondValue = Number(secondOrder.id);
      }

      if (firstValue < secondValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [orders, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedOrders.length / ORDERS_PER_PAGE);

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

  const paginatedOrders = processedOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  );

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatLongDate = (dateString) => {
    if (!dateString) return "—";

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    return new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getCustomerName = (order) => {
    return order.customer_name || "Unknown customer";
  };

  const getCustomerEmail = (order) => {
    return order.customer_email || "";
  };

  const getCustomerPhone = (order) => {
    return order.phone || "";
  };

  const getOrderTotalHalalas = (order) => {
    return order.total_halalas;
  };

  const formatPrice = (order) => {
    const totalHalalas = getOrderTotalHalalas(order);

    return `${(totalHalalas / 100).toFixed(0)} SAR`;
  };

  const getServiceTitle = (item) => {
    return item.service;
  };

  const getPlanTitle = (item) => {
    if (item.plan) return item.plan;

    if (item.sessions) {
      return `${item.sessions} Sessions`;
    }

    return "";
  };

  return (
    <>
      <Navbar />

      <main className="trainer-dashboard-page">
        <section className="trainer-dashboard-header">
          <div>
            <p className="trainer-dashboard-eyebrow">Trainer Dashboard</p>

            <h1>Orders</h1>

            <p>Review customer purchases and manage training orders.</p>
          </div>
        </section>

        <section className="trainer-orders-section">
          <div className="trainer-orders-top">
            <div>
              <h2>Recent Orders</h2>
              <p>{orders.length} total orders</p>
            </div>

            <div className="trainer-orders-controls">
              <label className="trainer-order-search">
                <FiSearch />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search order, customer or service"
                  aria-label="Search order number, customer or service"
                />

                {searchTerm && (
                  <button
                    type="button"
                    className="trainer-search-clear"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </label>

              <select
                className="trainer-status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter orders by status"
              >
                <option value="all">All statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="trainer-orders-message">Loading orders...</div>
          )}

          {!loading && error && (
            <div className="trainer-orders-message trainer-orders-error">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="trainer-orders-table-container">
                <table className="trainer-orders-table">
                  <thead>
                    <tr>
                      <th>
                        <button
                          type="button"
                          className="trainer-sort-button"
                          onClick={() => handleSort("id")}
                        >
                          Order #
                          <SortIcon column="id" sortConfig={sortConfig} />
                        </button>
                      </th>

                      <th>Customer</th>

                      <th>Service / Plan</th>

                      <th>Amount</th>

                      <th>
                        <button
                          type="button"
                          className="trainer-sort-button"
                          onClick={() => handleSort("created_at")}
                        >
                          Purchase Date
                          <SortIcon
                            column="created_at"
                            sortConfig={sortConfig}
                          />
                        </button>
                      </th>

                      <th>Status</th>

                      <th aria-label="Open order details"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="trainer-order-row"
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
                        <td className="trainer-order-number">#{order.id}</td>

                        <td>
                          <strong>{getCustomerName(order)}</strong>
                        </td>

                        <td>
                          <div className="trainer-order-items">
                            {order.items?.map((item, index) => (
                              <div
                                className="trainer-order-item"
                                key={item.id ?? index}
                              >
                                <strong>{getServiceTitle(item)}</strong>

                                <span>
                                  {getPlanTitle(item)}

                                  {item.quantity > 1
                                    ? ` × ${item.quantity}`
                                    : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="trainer-order-amount">
                          {formatPrice(order)}
                        </td>

                        <td>
                          <div className="trainer-order-date">
                            <span>{formatDate(order.created_at)}</span>

                            <small>{formatTime(order.created_at)}</small>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`trainer-order-status trainer-order-status-${order.status?.toLowerCase()}`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </td>

                        <td className="trainer-order-open">
                          <FiChevronRight />
                        </td>
                      </tr>
                    ))}

                    {paginatedOrders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="trainer-no-orders">
                          No matching orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="trainer-pagination">
                <p>
                  Showing {processedOrders.length === 0 ? 0 : startIndex + 1}–
                  {Math.min(
                    startIndex + ORDERS_PER_PAGE,
                    processedOrders.length,
                  )}{" "}
                  of {processedOrders.length} orders
                </p>

                {totalPages > 1 && (
                  <div className="trainer-pagination-buttons">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => page - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <FiChevronLeft />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          className={
                            currentPage === pageNumber
                              ? "trainer-pagination-active"
                              : ""
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

                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => page + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
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
              aria-label="Close order details"
            >
              <FiX />
            </button>

            <div className="trainer-order-modal-header">
              <div>
                <h2 id="trainer-order-modal-title">
                  Order #{selectedOrder.id}
                </h2>

                <p>{formatLongDate(selectedOrder.created_at)}</p>
              </div>

              <span
                className={`trainer-order-status trainer-order-status-${selectedOrder.status?.toLowerCase()}`}
              >
                {selectedOrder.status || "Unknown"}
              </span>
            </div>

            <div className="trainer-order-customer-details">
              <div className="trainer-order-detail-group">
                <span>Customer</span>
                <strong>{getCustomerName(selectedOrder)}</strong>
              </div>

              <div className="trainer-order-detail-group">
                <span>Email</span>

                {getCustomerEmail(selectedOrder) ? (
                  <a href={`mailto:${getCustomerEmail(selectedOrder)}`}>
                    {getCustomerEmail(selectedOrder)}
                  </a>
                ) : (
                  <strong>Not provided</strong>
                )}
              </div>

              <div className="trainer-order-detail-group">
                <span>Phone</span>

                {getCustomerPhone(selectedOrder) ? (
                  <a href={`tel:${getCustomerPhone(selectedOrder)}`}>
                    {getCustomerPhone(selectedOrder)}
                  </a>
                ) : (
                  <strong>Not provided</strong>
                )}
              </div>
            </div>

            <div className="trainer-order-modal-divider" />

            <section className="trainer-order-purchased-services">
              <h3>Purchased Services</h3>

              {selectedOrder.items?.map((item, index) => (
                <div
                  className="trainer-order-modal-item"
                  key={item.id ?? index}
                >
                  <div>
                    <strong>{getServiceTitle(item)}</strong>
                    <span>{getPlanTitle(item)}</span>
                  </div>

                  {item.quantity > 1 && (
                    <span className="trainer-order-item-quantity">
                      × {item.quantity}
                    </span>
                  )}
                </div>
              ))}
            </section>

            <div className="trainer-order-modal-divider" />

            <div className="trainer-order-modal-total">
              <strong>Total</strong>
              <strong>{formatPrice(selectedOrder)}</strong>
            </div>
          </article>
        </div>
      )}

      <Footer />
    </>
  );
}

export default TrainerDashboardPage;
