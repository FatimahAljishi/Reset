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
import {
  FaPhone,
  FaRegFileLines,
  FaCircleCheck,
  FaSpinner,
  FaUpload,
  FaFilePdf,
  FaArrowUpFromBracket,
  FaEye,
} from "react-icons/fa6";

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

  const [dashboard, setDashboard] = useState(null);
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
  const [loadingContactId, setLoadingContactId] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [loadingPackageId, setLoadingPackageId] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const formatFulfillmentStatus = (status) => {
    switch (status) {
      case "needs_contact":
        return "Needs Contact";

      case "contacted":
        return "Contacted";

      case "in_progress":
        return "In Progress";

      case "completed":
        return "Completed";

      case "needs_delivery":
        return "Needs Delivery";

      case "delivered":
        return "Delivered";

      default:
        return status;
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      if (!token) {
        throw new Error(t("trainerDashboard.tokenError"));
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/dashboard`,
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

      setDashboard(data);
    } catch (error) {
      console.error("Trainer dashboard fetch error:", error);
      setError(error.message || t("trainerDashboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    fetchDashboard();
  }, [getToken, isLoaded, isSignedIn]);

  const orders = dashboard?.recent_orders ?? [];
  const needsAction = dashboard?.needs_action ?? [];
  const activeClients = dashboard?.active_clients ?? [];

  const markContacted = async (orderItemId) => {
    try {
      setLoadingContactId(orderItemId);
      const token = await getToken();

      if (!token) {
        throw new Error(t("trainerDashboard.tokenError"));
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/order-items/${orderItemId}/mark-contacted`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      await fetchDashboard();
    } catch (error) {
      console.error("Mark contacted failed:", error);
      alert(error.message);
    } finally {
      setLoadingContactId(null);
    }
  };

  const uploadTrainingPlan = async (orderItemId) => {
    const file = selectedPdf[orderItemId];

    if (!file) return;

    try {
      setUploadingId(orderItemId);
      console.log("Uploading:", orderItemId);
      console.log(file);

      const token = await getToken();

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/order-items/${orderItemId}/upload-plan`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      const updatedDashboard = await fetchDashboard();

      delete selectedPdf[orderItemId];
      setSelectedPdf({ ...selectedPdf });
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const markCompleted = async (orderItemId) => {
    try {
      setLoadingItemId(orderItemId);
      const token = await getToken();

      if (!token) {
        throw new Error(t("trainerDashboard.tokenError"));
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/order-items/${orderItemId}/mark-completed`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      await fetchDashboard();
    } catch (error) {
      console.error("Mark completed failed:", error);
      alert(error.message);
    } finally {
      setLoadingItemId(null);
    }
  };

  const undoContact = async (orderItemId) => {
    try {
      setLoadingContactId(orderItemId);

      const token = await getToken();

      if (!token) {
        throw new Error(t("trainerDashboard.tokenError"));
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/order-items/${orderItemId}/undo-contact`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to undo contact.");
      }

      await fetchDashboard();

      // refresh the selected order in the modal
      const updatedOrder = dashboard.recent_orders.find(
        (order) => order.id === selectedOrder.id,
      );

      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingContactId(null);
    }
  };

  const recordSession = async (packageId) => {
    try {
      setLoadingPackageId(packageId);
      const token = await getToken();

      if (!token) {
        throw new Error(t("trainerDashboard.tokenError"));
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/packages/${packageId}/sessions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to record session.");
      }

      await fetchDashboard();
    } catch (error) {
      console.error("Record session failed:", error);
      alert(error.message);
    } finally {
      setLoadingPackageId(null);
    }
  };

  const removeLastSession = async (packageId) => {
    try {
      setLoadingPackageId(packageId);

      const token = await getToken();

      if (!token) {
        throw new Error(t("trainerDashboard.tokenError"));
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/packages/${packageId}/sessions/latest`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to remove session.");
      }

      await fetchDashboard();

      if (selectedOrder) {
        const refreshed = dashboard.recent_orders.find(
          (order) => order.id === selectedOrder.id,
        );

        if (refreshed) {
          setSelectedOrder(refreshed);
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingPackageId(null);
    }
  };

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

  const viewTrainingPlan = async (orderItemId) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainer/order-items/${orderItemId}/plan`,
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

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      alert("Unable to open training plan.");
    }
  };

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
          </div>
        </section>

        <section className="trainer-needs-action-section">
          <div className="trainer-needs-action-header">
            <h2>Orders Needing Your Action</h2>

            <span className="trainer-needs-action-count">
              {needsAction.length}
            </span>
          </div>

          <div className="trainer-action-cards">
            {needsAction.length === 0 ? (
              <div className="trainer-empty-actions">No actions required</div>
            ) : (
              needsAction.map((item) => (
                <div key={item.order_item_id} className="trainer-action-card">
                  <div
                    className={`trainer-action-icon ${
                      item.fulfillment_status === "needs_contact"
                        ? "contact"
                        : "delivery"
                    }`}
                  >
                    {item.fulfillment_status === "needs_contact" ? (
                      <FaPhone />
                    ) : (
                      <FaRegFileLines />
                    )}
                  </div>

                  <div className="trainer-action-info">
                    <h3>{item.customer_name}</h3>

                    <p>Order #{item.order_id}</p>

                    <p>
                      {item.service} • {item.plan}
                    </p>

                    <span>
                      {item.phone} • Paid on {formatDate(item.created_at)}
                    </span>
                  </div>

                  <div className="trainer-action-status">
                    <span
                      className={`trainer-order-progress-badge trainer-order-progress-${item.fulfillment_status}`}
                    >
                      {formatFulfillmentStatus(item.fulfillment_status)}
                    </span>
                  </div>

                  <div className="trainer-action-buttons">
                    {item.fulfillment_status === "needs_contact" && (
                      <button
                        className="trainer-primary-button"
                        disabled={loadingContactId === item.order_item_id}
                        onClick={() => markContacted(item.order_item_id)}
                      >
                        {loadingContactId === item.order_item_id ? (
                          <>
                            <FaSpinner className="spinner" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaPhone />
                            Mark Contacted
                          </>
                        )}
                      </button>
                    )}

                    {item.fulfillment_status === "needs_delivery" && (
                      <div className="trainer-upload-section">
                        {!selectedPdf[item.order_item_id] ? (
                          <label className="trainer-primary-button">
                            <FaUpload />
                            Upload Training Plan
                            <input
                              type="file"
                              hidden
                              accept=".pdf"
                              onChange={(e) => {
                                if (!e.target.files.length) return;

                                setSelectedPdf({
                                  ...selectedPdf,
                                  [item.order_item_id]: e.target.files[0],
                                });
                              }}
                            />
                          </label>
                        ) : (
                          <div className="trainer-selected-file">
                            <div className="trainer-file-name">
                              <FaFilePdf />

                              {selectedPdf[item.order_item_id].name}
                            </div>

                            <div className="trainer-upload-buttons">
                              <button
                                className="trainer-primary-button"
                                disabled={uploadingId === item.order_item_id}
                                onClick={() =>
                                  uploadTrainingPlan(item.order_item_id)
                                }
                              >
                                {uploadingId === item.order_item_id ? (
                                  <>
                                    <FaSpinner className="spinner" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>Upload</>
                                )}
                              </button>

                              <button
                                className="trainer-secondary-button"
                                onClick={() => {
                                  const files = { ...selectedPdf };
                                  delete files[item.order_item_id];
                                  setSelectedPdf(files);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="trainer-active-clients-section">
          <div className="trainer-section-header">
            <div className="trainer-section-title">
              <h2>Active Clients</h2>
              <span className="trainer-active-clients-count">
                {activeClients.length}
              </span>
            </div>
            <div className="trainer-active-clients-grid">
              {activeClients.map((client) => (
                <div
                  key={client.order_item_id}
                  className="trainer-active-client-card"
                >
                  <div className="trainer-active-client-header">
                    <div className="trainer-active-client-avatar">
                      {client.customer_name.charAt(0)}
                    </div>

                    <div className="trainer-active-client-info">
                      <h3>{client.customer_name}</h3>

                      <p className="trainer-active-client-order">
                        Order #{client.order_id}
                      </p>

                      <p>
                        {client.service} • {client.plan}
                      </p>
                    </div>

                    <span
                      className={`trainer-progress-badge ${client.progress
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {client.progress}
                    </span>
                  </div>
                  {client.total_sessions ? (
                    <>
                      <div className="trainer-active-client-progress">
                        <div className="trainer-progress-text">
                          <span>
                            {client.sessions_completed} of{" "}
                            {client.total_sessions} sessions completed
                          </span>

                          <span>{Math.round(client.progress_percentage)}%</span>
                        </div>

                        <div className="trainer-progress-bar">
                          <div
                            className="trainer-progress-fill"
                            style={{
                              width: `${client.progress_percentage}%`,
                            }}
                          />
                        </div>

                        <p className="trainer-sessions-remaining">
                          Remaining: {client.sessions_remaining}{" "}
                          {client.sessions_remaining === 1
                            ? "session"
                            : "sessions"}
                        </p>
                      </div>

                      <div className="trainer-active-client-actions">
                        <button
                          className="trainer-record-session-button"
                          onClick={() => recordSession(client.package_id)}
                          disabled={
                            client.progress === "Completed" ||
                            loadingPackageId === client.package_id
                          }
                        >
                          {loadingPackageId === client.package_id ? (
                            <>
                              <FaSpinner className="spinner" />
                              Recording...
                            </>
                          ) : (
                            <>
                              <FaCircleCheck />
                              {client.progress === "Not Started"
                                ? "Start Session"
                                : client.progress === "Completed"
                                  ? "Completed"
                                  : "Record Session"}
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="trainer-digital-actions">
                      <div className="plan-file-name">
                        <FaFilePdf className="pdf-icon" />
                        <p className="file-name">{client.plan_pdf_name}</p>
                        <p className="plan-uploaded-at">
                          Uploaded {formatDate(client.plan_uploaded_at)} at{" "}
                          {formatTime(client.plan_uploaded_at)}
                        </p>
                      </div>

                      <div className="digital-actions-buttons">
                        <button
                          className="digital-secondary-button"
                          onClick={() => viewTrainingPlan(client.order_item_id)}
                        >
                          <FaEye />
                          View PDF
                        </button>

                        {!selectedPdf[client.order_item_id] ? (
                          <label className="digital-secondary-button">
                            <FaArrowUpFromBracket />
                            Replace PDF
                            <input
                              type="file"
                              hidden
                              accept=".pdf"
                              onChange={(e) => {
                                if (!e.target.files.length) return;

                                setSelectedPdf({
                                  ...selectedPdf,
                                  [client.order_item_id]: e.target.files[0],
                                });
                              }}
                            />
                          </label>
                        ) : (
                          <div className="trainer-selected-file">
                            <div className="trainer-file-name">
                              <FaFilePdf />

                              {selectedPdf[client.order_item_id].name}
                            </div>

                            <div className="trainer-upload-buttons">
                              <button
                                className="trainer-primary-button"
                                disabled={uploadingId === client.order_item_id}
                                onClick={() =>
                                  uploadTrainingPlan(client.order_item_id)
                                }
                              >
                                {uploadingId === client.order_item_id ? (
                                  <>
                                    <FaSpinner className="spinner" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>Upload</>
                                )}
                              </button>

                              <button
                                className="trainer-secondary-button"
                                onClick={() => {
                                  const files = { ...selectedPdf };
                                  delete files[client.order_item_id];
                                  setSelectedPdf(files);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {!client.total_sessions && (
                    <div className="trainer-active-client-actions">
                      <button
                        className="trainer-record-session-button"
                        onClick={() => markCompleted(client.order_item_id)}
                        disabled={loadingItemId === client.order_item_id}
                      >
                        {loadingItemId === client.order_item_id ? (
                          <>
                            <FaSpinner className="spinner" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaCircleCheck />
                            Mark as Completed
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="trainer-active-clients-grid"></div>
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

                      <th>Progress</th>

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
                        <td>
                          <div className="trainer-order-fulfillment-status-container">
                            {order.items?.map((item, index) => (
                              <div
                                className="trainer-order-fulfillment-status"
                                key={`${item.service}-${item.plan}`}
                              >
                                <span
                                  className={`trainer-order-progress-badge trainer-order-progress-${item.fulfillment_status}`}
                                >
                                  {formatFulfillmentStatus(
                                    item.fulfillment_status,
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
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

                  {item.fulfillment_status === "contacted" && (
                    <button
                      className="trainer-secondary-button"
                      onClick={() => undoContact(item.id)}
                      disabled={loadingContactId === item.id}
                    >
                      {loadingContactId === item.id ? (
                        <>
                          <FaSpinner className="spinner" />
                          Updating...
                        </>
                      ) : (
                        "Undo Contact"
                      )}
                    </button>
                  )}

                  {(item.fulfillment_status === "in_progress" ||
                    item.fulfillment_status === "completed") &&
                    item.package_id && (
                      <button
                        className="trainer-secondary-button"
                        onClick={() => removeLastSession(item.package_id)}
                        disabled={loadingPackageId === item.package_id}
                      >
                        {loadingPackageId === item.package_id ? (
                          <>
                            <FaSpinner className="spinner" />
                            Updating...
                          </>
                        ) : (
                          "Undo Last Session"
                        )}
                      </button>
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
