import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  ArrowLeft,
  Package,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const Exchanges = () => {
  const navigate = useNavigate();

  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [cancellingId, setCancellingId] = useState(null);

  const token = localStorage.getItem("token");

  // =====================================================
  // FETCH MY EXCHANGES
  // =====================================================

  const fetchMyExchanges = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exchange`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExchanges(response.data?.exchanges || []);
    } catch (err) {
      console.error("Fetch exchanges error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load exchange requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyExchanges();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // =====================================================
  // STATUS DETAILS
  // =====================================================

  const getStatusDetails = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          label: "Exchange Requested",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Approved":
        return {
          icon: CheckCircle2,
          label: "Exchange Approved",
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Rejected":
        return {
          icon: XCircle,
          label: "Exchange Rejected",
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      case "Pickup Scheduled":
        return {
          icon: Truck,
          label: "Pickup Scheduled",
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Received":
        return {
          icon: Package,
          label: "Product Received",
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
        };

      case "Replacement Shipped":
        return {
          icon: Truck,
          label: "Replacement Shipped",
          className:
            "bg-cyan-50 text-cyan-700 border-cyan-200",
        };

      case "Completed":
        return {
          icon: CheckCircle2,
          label: "Exchange Completed",
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          label: "Exchange Cancelled",
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };

      default:
        return {
          icon: Clock3,
          label: status || "Unknown",
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  // =====================================================
  // CANCEL EXCHANGE
  // =====================================================

  const handleCancelExchange = async (exchangeId) => {
    try {
      setCancellingId(exchangeId);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exchange/${exchangeId}/cancel`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Exchange request cancelled"
      );

      await fetchMyExchanges();
    } catch (err) {
      console.error("Cancel exchange error:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to cancel exchange request"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const filters = [
    "All",
    "Pending",
    "Approved",
    "Pickup Scheduled",
    "Received",
    "Replacement Shipped",
    "Completed",
    "Rejected",
    "Cancelled",
  ];

  const filteredExchanges = exchanges.filter(
    (exchange) => {
      if (activeFilter === "All") {
        return true;
      }

      return exchange.status === activeFilter;
    }
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f9f7]">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={32}
              className="animate-spin text-green-600"
            />

            <p className="text-sm text-gray-500">
              Loading your exchanges...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          {/* BACK */}

          <button
            onClick={() => navigate("/orders")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          {/* HEADER */}

          <div className="mb-6">

            <h1 className="text-2xl font-semibold text-gray-900">
              My Exchanges
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track and manage your exchange requests
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* FILTERS */}

          <div className="mb-6 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2">

            <div className="flex min-w-max gap-2">

              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    setActiveFilter(filter)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {filter}
                </button>
              ))}

            </div>

          </div>

          {/* EMPTY */}

          {filteredExchanges.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <RefreshCw
                  size={28}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                No exchange requests found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {activeFilter === "All"
                  ? "You haven't submitted any exchange requests yet."
                  : `You don't have any ${activeFilter.toLowerCase()} exchange requests.`}
              </p>

              <button
                onClick={() => navigate("/orders")}
                className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                View My Orders
              </button>

            </div>
          ) : (
            /* EXCHANGE LIST */

            <div className="space-y-4">

              {filteredExchanges.map((exchange) => {

                const statusDetails =
                  getStatusDetails(
                    exchange.status
                  );

                const StatusIcon =
                  statusDetails.icon;

                const canCancel =
                  exchange.status ===
                  "Pending";

                return (
                  <div
                    key={exchange._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                  >

                    {/* TOP */}

                    <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Exchange ID
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          #
                          {exchange._id
                            ?.slice(-8)
                            .toUpperCase()}
                        </p>

                      </div>

                      <div
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${statusDetails.className}`}
                      >
                        <StatusIcon size={14} />

                        {statusDetails.label}
                      </div>

                    </div>

                    {/* PRODUCTS */}

                    <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">

                      {/* ORIGINAL PRODUCT */}

                      <div className="flex gap-4">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                          {exchange.item?.image ? (
                            <img
                              src={
                                exchange.item
                                  .image
                              }
                              alt={
                                exchange.item
                                  .name
                              }
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package
                                size={26}
                                className="text-gray-300"
                              />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Original
                          </p>

                          <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">
                            {exchange.item?.name}
                          </h3>

                          {exchange.item
                            ?.variantName && (
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                exchange.item
                                  .variantName
                              }
                            </p>
                          )}

                          <p className="mt-1 text-xs text-gray-400">
                            Qty:{" "}
                            {exchange.item
                              ?.quantity || 0}
                          </p>

                        </div>

                      </div>

                      {/* ARROW */}

                      <div className="hidden md:flex items-center justify-center">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                          <ArrowRight
                            size={17}
                            className="text-gray-500"
                          />
                        </div>

                      </div>

                      {/* EXCHANGE PRODUCT */}

                      <div className="flex gap-4">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-blue-50">

                          {exchange.exchangeItem
                            ?.image ? (
                            <img
                              src={
                                exchange
                                  .exchangeItem
                                  .image
                              }
                              alt={
                                exchange
                                  .exchangeItem
                                  .name
                              }
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package
                                size={26}
                                className="text-gray-300"
                              />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                            Exchange To
                          </p>

                          <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">
                            {
                              exchange
                                .exchangeItem
                                ?.name
                            }
                          </h3>

                          {exchange
                            .exchangeItem
                            ?.variantName && (
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                exchange
                                  .exchangeItem
                                  .variantName
                              }
                            </p>
                          )}

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {formatPrice(
                              exchange
                                .exchangeItem
                                ?.price
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-5 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">

                      <div className="flex items-center gap-2 text-sm">

                        <CalendarDays
                          size={16}
                          className="text-gray-400"
                        />

                        <div>
                          <p className="text-xs text-gray-400">
                            Requested
                          </p>

                          <p className="font-medium text-gray-800">
                            {formatDate(
                              exchange.requestedAt ||
                                exchange.createdAt
                            )}
                          </p>
                        </div>

                      </div>

                      <div className="text-sm">

                        <p className="text-xs text-gray-400">
                          Reason
                        </p>

                        <p className="mt-1 line-clamp-1 font-medium text-gray-800">
                          {exchange.reason ||
                            "-"}
                        </p>

                      </div>

                      <div className="text-sm">

                        <p className="text-xs text-gray-400">
                          Order
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                          #
                          {(
                            exchange.order?._id ||
                            exchange.order ||
                            ""
                          )
                            .toString()
                            .slice(-8)
                            .toUpperCase() ||
                            "-"}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">

                      {canCancel && (
                        <button
                          disabled={
                            cancellingId ===
                            exchange._id
                          }
                          onClick={() =>
                            handleCancelExchange(
                              exchange._id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancellingId ===
                          exchange._id ? (
                            <>
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={15}
                              />
                              Cancel Request
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() =>
                          navigate(
                            `/exchanges/${exchange._id}`
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        View Details
                        <ArrowRight size={15} />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Exchanges;