import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  RefreshCcw,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const ExchangeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const token = localStorage.getItem("token");

  const fetchExchange = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exchange/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExchange(response.data?.exchangeRequest || null);
    } catch (err) {
      console.error("Fetch exchange details error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load exchange details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchange();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

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
      case "Rejected":
        return {
          icon: XCircle,
          label: "Exchange Rejected",
          className:
            "bg-red-50 text-red-700 border-red-200",
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
          label: status || "Exchange Request",
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  const handleCancel = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      setCancelling(true);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exchange/${id}/cancel`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExchange(response.data?.exchangeRequest || exchange);
      toast.success(
        response.data?.message ||
          "Exchange request cancelled successfully"
      );
    } catch (err) {
      console.error("Cancel exchange error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      toast.error(
        err.response?.data?.message ||
          "Unable to cancel exchange request"
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f9f7]">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={32}
              className="animate-spin text-green-600"
            />
            <p className="text-sm text-gray-500">
              Loading exchange details...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !exchange) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f9f7] px-4">
          <div className="text-center">
            <XCircle
              size={42}
              className="mx-auto text-red-500"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Unable to load exchange details
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {error || "Exchange request not found"}
            </p>
            <button
              onClick={() => navigate("/exchanges")}
              className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Exchanges
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const status = getStatusDetails(exchange.status);
  const StatusIcon = status.icon;

  const originalItem = exchange.item;
  const exchangeItem = exchange.exchangeItem;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <button
            onClick={() => navigate("/exchanges")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={17} />
            Back to Exchanges
          </button>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <RefreshCcw
                      size={20}
                      className="text-blue-600"
                    />
                    <h1 className="text-xl font-semibold text-gray-900">
                      Exchange Details
                    </h1>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Exchange ID: #{String(exchange._id).slice(-8).toUpperCase()}
                  </p>
                </div>

                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${status.className}`}
                >
                  <StatusIcon size={15} />
                  {status.label}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                {/* ORIGINAL */}
                <div className="rounded-2xl border border-gray-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Original Product
                  </p>

                  <div className="mt-4 flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      {originalItem?.image ? (
                        <img
                          src={originalItem.image}
                          alt={originalItem.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-gray-900">
                        {originalItem?.name}
                      </h2>

                      {originalItem?.variantName && (
                        <p className="mt-1 text-sm text-gray-500">
                          Variant: {originalItem.variantName}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-gray-500">
                        Qty: {originalItem?.quantity || 1}
                      </p>

                      {/* Order-time discounted amount */}
                      <p className="mt-2 text-base font-semibold text-gray-900">
                        {formatPrice(
                          originalItem?.finalPrice ??
                            originalItem?.price
                        )}
                      </p>

                      {Number(originalItem?.price || 0) >
                        Number(originalItem?.finalPrice || 0) && (
                        <p className="mt-1 text-xs text-gray-400 line-through">
                          {formatPrice(originalItem.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* REPLACEMENT */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Exchange Product
                  </p>

                  <div className="mt-4 flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                      {exchangeItem?.image ? (
                        <img
                          src={exchangeItem.image}
                          alt={exchangeItem.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-gray-900">
                        {exchangeItem?.name}
                      </h2>

                      {exchangeItem?.variantName && (
                        <p className="mt-1 text-sm text-gray-500">
                          Variant: {exchangeItem.variantName}
                        </p>
                      )}

                      {/* Same amount as the original discounted order-time price */}
                      <p className="mt-2 text-base font-semibold text-gray-900">
                        {formatPrice(exchangeItem?.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CalendarDays size={16} />
                    Requested On
                  </div>
                  <p className="mt-2 text-sm text-gray-900">
                    {formatDate(exchange.requestedAt || exchange.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Order
                  </p>
                  <p className="mt-2 text-sm text-gray-900">
                    #{String(exchange.order?._id || exchange.order || "").slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">
                  Exchange Reason
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {exchange.reason || "N/A"}
                </p>

                {exchange.comment && (
                  <>
                    <h3 className="mt-5 font-semibold text-gray-900">
                      Additional Comment
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {exchange.comment}
                    </p>
                  </>
                )}

                {exchange.adminComment && (
                  <>
                    <h3 className="mt-5 font-semibold text-gray-900">
                      Admin Comment
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {exchange.adminComment}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {exchange.status === "Pending" && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancelling && (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    )}
                    Cancel Exchange
                  </button>
                )}

                <button
                  onClick={() =>
                    navigate(`/orders/${exchange.order?._id || exchange.order}`)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  View Original Order
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-sm leading-6 text-blue-800">
                  The exchange uses the discounted amount recorded at the time of your original purchase. The current product price is not used for this exchange request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ExchangeDetails;
