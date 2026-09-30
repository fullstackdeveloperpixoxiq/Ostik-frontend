import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import OrderTracking from "../OrderTracking/OrderTracking"

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [myReturns, setMyReturns] = useState([]);
  const [myExchanges, setMyExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================================================
  // FETCH ORDER
  // =========================================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data.order);
    } catch (err) {
      console.error("Fetch order details error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load order details"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH USER RETURNS
  // =========================================================

  const fetchMyReturns = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/return`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyReturns(response.data?.returns || []);
    } catch (err) {
      console.error("Fetch returns error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    }
  };

  // =========================================================
  // =========================================================
  // FETCH MY EXCHANGES
  // =========================================================

  const fetchMyExchanges = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exchange`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMyExchanges(response.data?.exchanges || []);
    } catch (err) {
      console.error("Fetch exchanges error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchOrder();
    fetchMyReturns();
    fetchMyExchanges();
  }, [id]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // =========================================================
  // ORDER STATUS
  // =========================================================

  const getStatusDetails = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Processing":
        return {
          icon: Package,
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Shipped":
        return {
          icon: Truck,
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Delivered":
        return {
          icon: CheckCircle2,
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          icon: Clock3,
          className:
            "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  // =========================================================
  // FIND RETURN FOR SPECIFIC ITEM
  // =========================================================

  const getReturnForItem = (orderId, itemId) => {
    return myReturns.find((returnRequest) => {
      const returnOrderId =
        returnRequest.order?._id || returnRequest.order;

      const returnItemId =
        returnRequest.item?.orderItemId;

      return (
        String(returnOrderId) === String(orderId) &&
        String(returnItemId) === String(itemId)
      );
    });
  };

  // =========================================================
  // =========================================================
  // GET EXCHANGE FOR SPECIFIC ORDER ITEM
  // =========================================================

  const getExchangeForItem = (orderId, itemId) => {
    return myExchanges.find((exchangeRequest) => {
      const exchangeOrderId = exchangeRequest.order?._id || exchangeRequest.order;
      const exchangeItemId = exchangeRequest.item?.orderItemId;

      return (
        String(exchangeOrderId) === String(orderId) &&
        String(exchangeItemId) === String(itemId)
      );
    });
  };

  // =========================================================
  // EXCHANGE STATUS DETAILS
  // =========================================================

  const getExchangeStatusDetails = (status) => {
    switch (status) {
      case "Pending":
        return { label: "Exchange Requested", className: "bg-amber-50 text-amber-700 border-amber-200" };
      case "Approved":
        return { label: "Exchange Approved", className: "bg-blue-50 text-blue-700 border-blue-200" };
      case "Pickup Scheduled":
        return { label: "Exchange Pickup Scheduled", className: "bg-purple-50 text-purple-700 border-purple-200" };
      case "Received":
        return { label: "Exchange Product Received", className: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      case "Replacement Shipped":
        return { label: "Replacement Shipped", className: "bg-cyan-50 text-cyan-700 border-cyan-200" };
      case "Completed":
        return { label: "Exchange Completed", className: "bg-green-50 text-green-700 border-green-200" };
      case "Rejected":
        return { label: "Exchange Rejected", className: "bg-red-50 text-red-700 border-red-200" };
      case "Cancelled":
        return { label: "Exchange Cancelled", className: "bg-gray-50 text-gray-600 border-gray-200" };
      default:
        return null;
    }
  };

  const isExchangeActive = (status) =>
    ["Pending", "Approved", "Pickup Scheduled", "Received", "Replacement Shipped", "Completed"].includes(status);

  // RETURN STATUS DETAILS
  // =========================================================

  const getReturnStatusDetails = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          label: "Return Requested",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Approved":
        return {
          icon: CheckCircle2,
          label: "Return Approved",
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Rejected":
        return {
          icon: XCircle,
          label: "Return Rejected",
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      case "Picked Up":
        return {
          icon: Truck,
          label: "Return Picked Up",
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Received":
        return {
          icon: Package,
          label: "Return Received",
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
        };

      case "Refunded":
        return {
          icon: CheckCircle2,
          label: "Return Completed",
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          label: "Return Cancelled",
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };

      default:
        return null;
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

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
              Loading order details...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !order) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f9f7] px-4">
          <div className="text-center">
            <XCircle
              size={40}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Unable to load order
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Order not found"}
            </p>

            <button
              onClick={() => navigate("/orders")}
              className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Orders
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  const status = getStatusDetails(order.orderStatus);
  const StatusIcon = status.icon;

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* BACK */}

          <button
            onClick={() => navigate("/orders")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          {/* HEADER */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Order ID
                </p>

                <h1 className="mt-1 text-xl font-semibold text-gray-900">
                  #{order._id.slice(-8).toUpperCase()}
                </h1>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={15} />

                  {formatDate(
                    order.placedAt || order.createdAt
                  )}
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${status.className}`}
              >
                <StatusIcon size={16} />
                {order.orderStatus}
              </div>

            </div>
          </div>

          {/* order tracking */}
              <div className="m-10">
                <OrderTracking order={order}/>
              </div>

          {/* PRODUCTS */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-gray-900">
                Ordered Products
              </h2>
            </div>

            <div className="divide-y divide-gray-100">

              {order.items?.map((item) => {

                // Find return request for this exact order item
                const returnRequest = getReturnForItem(
                  order._id,
                  item._id
                );

                const exchangeRequest = getExchangeForItem(
                  order._id,
                  item._id
                );

                const returnStatus = returnRequest
                  ? getReturnStatusDetails(
                      returnRequest.status
                    )
                  : null;

                const exchangeStatus = exchangeRequest
                  ? getExchangeStatusDetails(exchangeRequest.status)
                  : null;

                const ReturnStatusIcon =
                  returnStatus?.icon;

                const hasActiveReturn = [
                  "Pending",
                  "Approved",
                  "Picked Up",
                  "Received",
                  "Refunded",
                ].includes(returnRequest?.status);

                const hasActiveExchange =
                  exchangeRequest &&
                  isExchangeActive(exchangeRequest.status);

                return (
                  <div
                    key={item._id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex gap-4">

                      {/* PRODUCT IMAGE */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={28}
                              className="text-gray-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        {item.variantName && (
                          <p className="mt-1 text-sm text-gray-500">
                            Variant: {item.variantName}
                          </p>
                        )}

                        {item.sku && (
                          <p className="mt-1 text-xs text-gray-400">
                            SKU: {item.sku}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">

                          <span>
                            Qty:{" "}
                            <strong className="text-gray-800">
                              {item.quantity}
                            </strong>
                          </span>

                          <span>
                            Price:{" "}
                            <strong className="text-gray-800">
                              {formatPrice(
                                item.finalPrice
                              )}
                            </strong>
                          </span>

                        </div>

                        {/* RETURN STATUS */}

                        {returnStatus && (
                          <div
                            className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${returnStatus.className}`}
                          >
                            {ReturnStatusIcon && (
                              <ReturnStatusIcon size={15} />
                            )}

                            {returnStatus.label}
                          </div>
                        )}

                        {/* EXCHANGE STATUS */}

                        {exchangeStatus && (
                          <div
                            className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${exchangeStatus.className}`}
                          >
                            <RefreshCcw size={15} />
                            {exchangeStatus.label}
                          </div>
                        )}

                        {/* RETURN / EXCHANGE */}

                        {order.orderStatus === "Delivered" && (
                          <div className="mt-4 flex flex-wrap gap-2">

                            {/* If active return exists,
                                don't allow another request */}

                            {!hasActiveReturn && !hasActiveExchange && (
                              <>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/orders/${order._id}/return/${item._id}`
                                    )
                                  }
                                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:bg-orange-50"
                                >
                                  Return
                                </button>

                                <button
                                  onClick={() =>
                                    navigate(
                                      `/orders/${order._id}/exchange/${item._id}`
                                    )
                                  }
                                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                  Exchange
                                </button>
                              </>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* SHIPPING + PAYMENT */}

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* SHIPPING */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-green-600"
                />

                <h2 className="font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-4 text-sm leading-6 text-gray-600">

                {order.shippingAddress && (
                  <>
                    <p>
                      {order.shippingAddress.name}
                    </p>

                    <p>
                      {order.shippingAddress.address}
                    </p>

                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>

                    <p>
                      {order.shippingAddress.pincode}
                    </p>

                    {order.shippingAddress.phone && (
                      <p>
                        Phone:{" "}
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </>
                )}

              </div>
            </div>

            {/* PAYMENT */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2">
                <CreditCard
                  size={18}
                  className="text-green-600"
                />

                <h2 className="font-semibold text-gray-900">
                  Payment
                </h2>
              </div>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Method
                  </span>

                  <span className="font-medium capitalize text-gray-900">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span className="font-medium text-gray-900">
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Discount
                  </span>

                  <span>
                    - {formatPrice(order.discount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span>
                    {order.shippingFee === 0
                      ? "Free"
                      : formatPrice(
                          order.shippingFee
                        )}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3">

                  <div className="flex justify-between">

                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </span>

                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* TRACKING */}

          {order.trackingNumber && (
            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50/50 p-5">

              <div className="flex items-center gap-2">

                <Truck
                  size={18}
                  className="text-green-600"
                />

                <h2 className="font-semibold text-gray-900">
                  Tracking Information
                </h2>

              </div>

              <div className="mt-3 text-sm text-gray-600">

                <p>
                  Tracking Number:{" "}
                  <span className="font-medium text-gray-900">
                    {order.trackingNumber}
                  </span>
                </p>

                {order.carrier && (
                  <p className="mt-1">
                    Carrier:{" "}
                    <span className="font-medium text-gray-900">
                      {order.carrier}
                    </span>
                  </p>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderDetails;