import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ChevronRight,
  CalendarDays,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  ShoppingBag,
  MapPin,
  RefreshCcw,
  X,
  Star,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import axios from "axios";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [myReturns, setMyReturns] = useState([]);
  const [myExchanges, setMyExchanges] = useState([]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // =====================================================
  // CANCEL ORDER STATES
  // =====================================================

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");

  // =====================================================
  // REVIEW STATES
  // =====================================================

  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [myReviews, setMyReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const token = localStorage.getItem("token");

  // =====================================================
  // CANCELLATION REASONS
  // =====================================================

  const cancellationReasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found a better price",
    "Product no longer needed",
    "Delivery taking too long",
    "Ordered the wrong product",
    "Other",
  ];

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH MY RETURNS
  // =====================================================

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

  // =====================================================
  // FETCH MY EXCHANGES
  // =====================================================

  const fetchMyExchanges = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exchange`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyExchanges(
        response.data?.exchanges || []
      );
    } catch (err) {
      console.error(
        "Fetch exchanges error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    }
  };

  // =====================================================
  // FETCH MY REVIEWS
  // =====================================================

  const fetchMyReviews = async () => {
    try {
      if (!token) return;

      setReviewLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/review/my-reviews`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyReviews(
        response.data.reviews || []
      );
    } catch (err) {
      console.error(
        "Fetch reviews error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }
    } finally {
      setReviewLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchOrders();
    fetchMyReturns();
    fetchMyExchanges();
    fetchMyReviews();
  }, []);

  // =====================================================
  // GET RETURN FOR SPECIFIC ORDER ITEM
  // =====================================================

  const getReturnForItem = (
    orderId,
    itemId
  ) => {
    return myReturns.find(
      (returnRequest) => {
        const returnOrderId =
          returnRequest.order?._id ||
          returnRequest.order;

        const returnItemId =
          returnRequest.item?.orderItemId;

        return (
          String(returnOrderId) ===
            String(orderId) &&
          String(returnItemId) ===
            String(itemId)
        );
      }
    );
  };

  // =====================================================
  // GET EXCHANGE FOR SPECIFIC ORDER ITEM
  // =====================================================

  const getExchangeForItem = (
    orderId,
    itemId
  ) => {
    return myExchanges.find(
      (exchangeRequest) => {
        const exchangeOrderId =
          exchangeRequest.order?._id ||
          exchangeRequest.order;

        const exchangeItemId =
          exchangeRequest.item?.orderItemId;

        return (
          String(exchangeOrderId) ===
            String(orderId) &&
          String(exchangeItemId) ===
            String(itemId)
        );
      }
    );
  };

  // =====================================================
  // EXCHANGE STATUS STYLE
  // =====================================================

  const getExchangeStatusDetails = (
    status
  ) => {
    switch (status) {
      case "Pending":
        return {
          label: "Exchange Requested",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Approved":
        return {
          label: "Exchange Approved",
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Rejected":
        return {
          label: "Exchange Rejected",
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      case "Pickup Scheduled":
        return {
          label:
            "Exchange Pickup Scheduled",
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Received":
        return {
          label:
            "Exchange Product Received",
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
        };

      case "Replacement Shipped":
        return {
          label: "Replacement Shipped",
          className:
            "bg-cyan-50 text-cyan-700 border-cyan-200",
        };

      case "Completed":
        return {
          label: "Exchange Completed",
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          label: "Exchange Cancelled",
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };

      default:
        return null;
    }
  };

  // =====================================================
  // CHECK WHETHER EXCHANGE IS ACTIVE
  // =====================================================

  const isExchangeActive = (
    status
  ) => {
    return [
      "Pending",
      "Approved",
      "Pickup Scheduled",
      "Received",
      "Replacement Shipped",
      "Completed",
    ].includes(status);
  };

  // =====================================================
  // RETURN STATUS STYLE
  // =====================================================

  const getReturnStatusDetails = (
    status
  ) => {
    switch (status) {
      case "Pending":
        return {
          label: "Return Requested",
          className:
            "bg-yellow-50 text-yellow-700 border-yellow-200",
        };

      case "Approved":
        return {
          label: "Return Approved",
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Rejected":
        return {
          label: "Return Rejected",
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      case "Picked Up":
        return {
          label: "Return Picked Up",
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Received":
        return {
          label: "Return Received",
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
        };

      case "Refunded":
        return {
          label: "Return Completed",
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          label: "Return Cancelled",
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };

      default:
        return null;
    }
  };

  // =====================================================
  // CHECK WHETHER RETURN IS ACTIVE
  // =====================================================

  const isReturnActive = (
    status
  ) => {
    return [
      "Pending",
      "Approved",
      "Picked Up",
      "Received",
      "Refunded",
    ].includes(status);
  };

  // =====================================================
  // CHECK WHETHER ORDER HAS RETURN
  // =====================================================

  const hasReturnForOrder = (
    orderId
  ) => {
    return myReturns.some(
      (returnRequest) => {
        const returnOrderId =
          returnRequest.order?._id ||
          returnRequest.order;

        return (
          String(returnOrderId) ===
          String(orderId)
        );
      }
    );
  };

  // =====================================================
  // CHECK WHETHER ORDER HAS EXCHANGE
  // =====================================================

  const hasExchangeForOrder = (
    orderId
  ) => {
    return myExchanges.some(
      (exchangeRequest) => {
        const exchangeOrderId =
          exchangeRequest.order?._id ||
          exchangeRequest.order;

        return (
          String(exchangeOrderId) ===
          String(orderId)
        );
      }
    );
  };

  // =====================================================
  // OPEN CANCEL MODAL
  // =====================================================

  const openCancelModal = (
    orderId
  ) => {
    setCancelOrderId(orderId);
    setCancelReason("");
    setCancelComment("");
    setCancelModalOpen(true);
  };

  // =====================================================
  // CLOSE CANCEL MODAL
  // =====================================================

  const closeCancelModal = () => {
    if (cancellingId) return;

    setCancelModalOpen(false);
    setCancelOrderId(null);
    setCancelReason("");
    setCancelComment("");
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {
    try {
      if (!token) {
        toast.error(
          "Please login to cancel the order"
        );

        navigate("/login");
        return;
      }

      if (!cancelOrderId) {
        toast.error(
          "Order information is missing"
        );

        return;
      }

      if (!cancelReason) {
        toast.error(
          "Please select a cancellation reason"
        );

        return;
      }

      setCancellingId(cancelOrderId);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/order/${cancelOrderId}/cancel`,
        {
          reason: cancelReason,
          comment: cancelComment,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === cancelOrderId
            ? {
                ...order,
                orderStatus:
                  "Cancelled",
                cancellation:
                  response.data
                    .order?.cancellation || {
                    reason:
                      cancelReason,
                    comment:
                      cancelComment,
                    cancelledAt:
                      new Date(),
                    cancelledBy:
                      "user",
                  },
              }
            : order
        )
      );

      toast.success(
        response.data.message ||
          "Order cancelled successfully"
      );

      setCancelModalOpen(false);
      setCancelOrderId(null);
      setCancelReason("");
      setCancelComment("");
    } catch (err) {
      console.error(
        "Cancel order error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =====================================================
  // OPEN REVIEW MODAL
  // =====================================================

  const openReviewModal = (
    order,
    item
  ) => {
    setSelectedOrder(order);
    setSelectedProduct(item);

    setReviewRating(0);
    setReviewComment("");
    setReviewImages([]);

    setReviewOpen(true);
  };

  // =====================================================
  // CLOSE REVIEW MODAL
  // =====================================================

  const closeReviewModal = () => {
    if (reviewSubmitting) return;

    setReviewOpen(false);

    setSelectedProduct(null);
    setSelectedOrder(null);

    setReviewRating(0);
    setReviewComment("");
    setReviewImages([]);
  };

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  const handleReviewImages = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) return;

    if (files.length > 3) {
      toast.error(
        "You can upload up to 3 images"
      );

      e.target.value = "";
      return;
    }

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/")
    );

    if (
      validFiles.length !==
      files.length
    ) {
      toast.error(
        "Only image files are allowed"
      );

      e.target.value = "";
      return;
    }

    setReviewImages(validFiles);

    e.target.value = "";
  };

  // =====================================================
  // REMOVE REVIEW IMAGE
  // =====================================================

  const removeReviewImage = (
    index
  ) => {
    setReviewImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================================
  // CHECK ALREADY REVIEWED
  // =====================================================

  const hasReviewed = (
    orderId,
    productId
  ) => {
    return myReviews.some(
      (review) => {
        const reviewOrderId =
          review.order?._id ||
          review.order;

        const reviewProductId =
          review.product?._id ||
          review.product;

        return (
          String(reviewOrderId) ===
            String(orderId) &&
          String(reviewProductId) ===
            String(productId)
        );
      }
    );
  };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmitReview = async () => {
    try {
      if (!token) {
        toast.error(
          "Please login to submit a review"
        );

        navigate("/login");
        return;
      }

      if (
        !selectedProduct ||
        !selectedOrder
      ) {
        toast.error(
          "Product information is missing"
        );

        return;
      }

      if (!reviewRating) {
        toast.error(
          "Please select a rating"
        );

        return;
      }

      setReviewSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "product",
        selectedProduct.productId
      );

      formData.append(
        "order",
        selectedOrder._id
      );

      formData.append(
        "rating",
        reviewRating
      );

      formData.append(
        "comment",
        reviewComment
      );

      reviewImages.forEach(
        (file) => {
          formData.append(
            "images",
            file
          );
        }
      );

      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/review`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      toast.success(
        response.data.message ||
          "Review submitted successfully"
      );

      if (
        response.data.review
      ) {
        setMyReviews((prev) => [
          ...prev,
          response.data.review,
        ]);
      }

      closeReviewModal();
    } catch (err) {
      console.error(
        "Submit review error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit review"
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders =
    orders.filter((order) => {
      // ALL ORDERS
      if (activeFilter === "All") {
        return true;
      }

      // RETURNS
      if (
        activeFilter ===
        "Returns"
      ) {
        return hasReturnForOrder(
          order._id
        );
      }

      // EXCHANGES
      if (
        activeFilter ===
        "Exchanges"
      ) {
        return hasExchangeForOrder(
          order._id
        );
      }

      // NORMAL ORDER STATUS
      return (
        order.orderStatus?.toLowerCase() ===
        activeFilter.toLowerCase()
      );
    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatPrice = (
    price
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(price || 0);
  };

  // =====================================================
  // ORDER STATUS STYLE
  // =====================================================

  const getStatusDetails = (
    status
  ) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          label: "Pending",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Processing":
        return {
          icon: Package,
          label: "Processing",
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Shipped":
        return {
          icon: Truck,
          label: "Shipped",
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Delivered":
        return {
          icon: CheckCircle2,
          label: "Delivered",
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          label: "Cancelled",
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          icon: Clock3,
          label:
            status || "Pending",
          className:
            "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const filters = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Returns",
    "Exchanges",
    "Cancelled",
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#f8f9f7]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2
                  size={34}
                  className="animate-spin text-green-600"
                />

                <p className="text-sm text-gray-500">
                  Loading your orders...
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#f8f9f7]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <XCircle
                    size={30}
                    className="text-red-500"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Unable to load orders
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {error}
                </p>

                <button
                  onClick={fetchOrders}
                  className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl">
                <ShoppingBag
                  size={21}
                  className="text-[#00ff03]"
                />
              </div>

              <div>

                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                  My Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Track and manage your Ostik orders
                </p>

              </div>

            </div>

          </div>


          {/* FILTER TABS */}

          <div className="mb-7 overflow-x-auto">

            <div className="flex min-w-max gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">

              {filters.map(
                (filter) => (

                  <button
                    key={filter}
                    onClick={() =>
                      setActiveFilter(
                        filter
                      )
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      activeFilter ===
                      filter
                        ? "bg-[#00ff03] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {filter}
                  </button>

                )
              )}

            </div>

          </div>


          {/* EMPTY ORDERS */}

          {filteredOrders.length ===
            0 && (

            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

                <Package
                  size={29}
                  className="text-gray-500"
                />

              </div>

              <h2 className="text-lg font-semibold text-gray-900">

                {activeFilter ===
                "All"
                  ? "No orders yet"
                  : `No ${activeFilter.toLowerCase()} orders`}

              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">

                {activeFilter ===
                "All"
                  ? "Your orders will appear here once you place your first order."
                  : `There are currently no ${activeFilter.toLowerCase()} orders.`}

              </p>

              {activeFilter ===
                "All" && (

                <button
                  onClick={() =>
                    navigate("/shop")
                  }
                  className="mt-6 rounded-lg bg-[#00ff03] px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Start Shopping
                </button>

              )}

            </div>

          )}


          {/* ORDER LIST */}

          <div className="space-y-5">

            {filteredOrders.map(
              (order) => {

                const status =
                  getStatusDetails(
                    order.orderStatus
                  );

                const StatusIcon =
                  status.icon;

                return (

                  <div
                    key={order._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >

                    {/* ORDER HEADER */}

                    <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

                          <div>

                            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                              Order ID
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-gray-900">
                              #
                              {order._id
                                .slice(-8)
                                .toUpperCase()}
                            </p>

                          </div>

                          <div className="hidden h-7 w-px bg-gray-200 sm:block" />

                          <div className="flex items-center gap-1.5 text-sm text-gray-500">

                            <CalendarDays
                              size={15}
                            />

                            <span>
                              {formatDate(
                                order.placedAt ||
                                  order.createdAt
                              )}
                            </span>

                          </div>

                          <div className="hidden h-7 w-px bg-gray-200 sm:block" />

                          <div className="flex items-center gap-1.5 text-sm text-gray-500">

                            <CreditCard
                              size={15}
                            />

                            <span className="capitalize">
                              {order.paymentMethod ||
                                "N/A"}
                            </span>

                          </div>

                        </div>


                        {/* STATUS */}

                        <div
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                        >

                          <StatusIcon
                            size={14}
                          />

                          {status.label}

                        </div>

                      </div>

                    </div>


                    {/* ORDER ITEMS */}

                    <div className="divide-y divide-gray-100">

                      {order.items?.map(
                        (item, index) => {

                          const returnRequest =
                            getReturnForItem(
                              order._id,
                              item._id
                            );

                          const exchangeRequest =
                            getExchangeForItem(
                              order._id,
                              item._id
                            );

                          const returnStatus =
                            returnRequest
                              ? getReturnStatusDetails(
                                  returnRequest.status
                                )
                              : null;

                          const exchangeStatus =
                            exchangeRequest
                              ? getExchangeStatusDetails(
                                  exchangeRequest.status
                                )
                              : null;

                          const returnActive =
                            returnRequest &&
                            isReturnActive(
                              returnRequest.status
                            );

                          const exchangeActive =
                            exchangeRequest &&
                            isExchangeActive(
                              exchangeRequest.status
                            );

                          return (

                            <div
                              key={`${order._id}-${index}`}
                              className="px-4 py-5 sm:px-6"
                            >

                              <div className="flex gap-4">

                                {/* PRODUCT IMAGE */}

                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 sm:h-24 sm:w-24">

                                  {item.image ? (

                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name
                                      }
                                      className="h-full w-full object-contain p-2"
                                    />

                                  ) : (

                                    <div className="flex h-full w-full items-center justify-center">

                                      <Package
                                        size={25}
                                        className="text-gray-300"
                                      />

                                    </div>

                                  )}

                                </div>


                                {/* PRODUCT INFO */}

                                <div className="min-w-0 flex-1">

                                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">

                                    <div>

                                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                                        {
                                          item.name
                                        }
                                      </h3>

                                      {item.variantName && (
                                        <p className="mt-1 text-sm text-gray-500">
                                          Variant:{" "}
                                          <span className="font-medium text-gray-700">
                                            {
                                              item.variantName
                                            }
                                          </span>
                                        </p>
                                      )}

                                      {item.sku && (
                                        <p className="mt-1 text-xs text-gray-400">
                                          SKU:{" "}
                                          {item.sku}
                                        </p>
                                      )}

                                    </div>


                                    {/* PRICE */}

                                    <div className="shrink-0 sm:text-right">

                                      <p className="text-base font-semibold text-gray-900">
                                        {formatPrice(
                                          item.finalPrice ??
                                            item.price
                                        )}
                                      </p>

                                      {item.discountPercent >
                                        0 && (

                                        <p className="mt-1 text-xs text-gray-400 line-through">
                                          {formatPrice(
                                            item.price
                                          )}
                                        </p>

                                      )}

                                    </div>

                                  </div>


                                  {/* QUANTITY + DISCOUNT */}

                                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">

                                    <span>
                                      Qty:{" "}
                                      <span className="font-medium text-gray-700">
                                        {
                                          item.quantity
                                        }
                                      </span>
                                    </span>

                                    {item.discountPercent >
                                      0 && (

                                      <span className="rounded-md bg-green-50 px-2 py-1 font-medium text-green-700">
                                        {
                                          item.discountPercent
                                        }
                                        % OFF
                                      </span>

                                    )}

                                    <span>
                                      Item total:{" "}
                                      <span className="font-semibold text-gray-800">
                                        {formatPrice(
                                          (item.finalPrice ??
                                            item.price) *
                                            item.quantity
                                        )}
                                      </span>
                                    </span>

                                  </div>


                                  {/* DELIVERED ACTIONS */}

                                  {order.orderStatus ===
                                    "Delivered" && (

                                    <div className="mt-4 flex flex-wrap gap-2">

                                      {/* REVIEW */}

                                      {hasReviewed(
                                        order._id,
                                        item.productId
                                      ) ? (

                                        <div className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">

                                          <CheckCircle2
                                            size={15}
                                          />

                                          Reviewed

                                        </div>

                                      ) : (

                                        <button
                                          onClick={() =>
                                            openReviewModal(
                                              order,
                                              item
                                            )
                                          }
                                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:border-green-300 hover:bg-green-50"
                                        >

                                          <Star
                                            size={16}
                                            className="fill-yellow-400 text-yellow-400"
                                          />

                                          Write a Review

                                        </button>

                                      )}


                                      {/* RETURN STATUS */}

                                      {returnStatus && (

                                        <div
                                          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium ${returnStatus.className}`}
                                        >

                                          <Package
                                            size={16}
                                          />

                                          {
                                            returnStatus.label
                                          }

                                        </div>

                                      )}


                                      {/* EXCHANGE STATUS */}

                                      {exchangeStatus && (

                                        <div
                                          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium ${exchangeStatus.className}`}
                                        >

                                          <RefreshCcw
                                            size={16}
                                          />

                                          {
                                            exchangeStatus.label
                                          }

                                        </div>

                                      )}


                                      {/* RETURN + EXCHANGE */}

                                      {!returnActive &&
                                        !exchangeActive && (

                                          <>
                                            <button
                                              onClick={() =>
                                                navigate(
                                                  `/orders/${order._id}/return/${item._id}`
                                                )
                                              }
                                              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:bg-orange-50"
                                            >
                                              Return
                                            </button>

                                            <button
                                              onClick={() =>
                                                navigate(
                                                  `/orders/${order._id}/exchange/${item._id}`
                                                )
                                              }
                                              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
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
                        }
                      )}

                    </div>


                    {/* ORDER FOOTER */}

                    <div className="border-t border-gray-100 px-4 py-4 sm:px-6">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* LEFT */}

                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-sm text-gray-500">

                            <span>
                              {order.items?.length ||
                                0}{" "}
                              {order.items?.length ===
                              1
                                ? "item"
                                : "items"}
                            </span>

                            {order.shippingFee !==
                              undefined && (
                              <>
                                <span>
                                  •
                                </span>

                                <span>
                                  Shipping:{" "}
                                  {order.shippingFee ===
                                  0
                                    ? "Free"
                                    : formatPrice(
                                        order.shippingFee
                                      )}
                                </span>
                              </>
                            )}

                          </div>

                          {order.paymentStatus && (

                            <p className="text-xs text-gray-400">

                              Payment:{" "}

                              <span className="font-medium text-gray-600">
                                {
                                  order.paymentStatus
                                }
                              </span>

                            </p>

                          )}

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col gap-3 sm:items-end">

                          <div className="flex items-center justify-between gap-4 sm:justify-end">

                            <span className="text-sm text-gray-500">
                              Total
                            </span>

                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(
                                order.total
                              )}
                            </span>

                          </div>


                          <div className="flex flex-wrap gap-2">

                            {/* CANCEL */}

                            {(order.orderStatus ===
                              "Pending" ||
                              order.orderStatus ===
                                "Processing") && (

                              <button
                                onClick={() =>
                                  openCancelModal(
                                    order._id
                                  )
                                }
                                disabled={
                                  cancellingId ===
                                  order._id
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >

                                {cancellingId ===
                                order._id ? (
                                  <>
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />

                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <X
                                      size={15}
                                    />

                                    Cancel Order
                                  </>
                                )}

                              </button>

                            )}


                            {/* VIEW DETAILS */}

                            <button
                              onClick={() =>
                                navigate(
                                  `/orders/${order._id}`
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                            >

                              View Details

                              <ChevronRight
                                size={16}
                              />

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* TRACKING */}

                    {order.trackingNumber &&
                      order.orderStatus !==
                        "Cancelled" && (

                        <div className="border-t border-green-100 bg-green-50/50 px-4 py-3 sm:px-6">

                          <div className="flex flex-wrap items-center gap-2 text-sm">

                            <Truck
                              size={16}
                              className="text-green-600"
                            />

                            <span className="text-gray-600">
                              Tracking:
                            </span>

                            <span className="font-medium text-gray-900">
                              {
                                order.trackingNumber
                              }
                            </span>

                            {order.carrier && (
                              <span className="text-gray-500">
                                •{" "}
                                {
                                  order.carrier
                                }
                              </span>
                            )}

                          </div>

                        </div>

                      )}

                  </div>

                );
              }
            )}

          </div>


          {/* BOTTOM INFO */}

          {orders.length > 0 && (

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">

              <MapPin
                size={13}
              />

              <span>
                All prices shown are the prices recorded at the time of purchase.
              </span>

            </div>

          )}

        </div>

      </div>


      <Footer />


      {/* ===================================================== */}
      {/* CANCEL ORDER MODAL */}
      {/* ===================================================== */}

      {cancelModalOpen && (

        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">

          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <button
              type="button"
              onClick={
                closeCancelModal
              }
              disabled={
                !!cancellingId
              }
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <X size={18} />

            </button>


            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-xl font-semibold text-gray-900">
                Cancel Order
              </h2>

              <p className="mt-1 pr-8 text-sm leading-5 text-gray-500">
                Please tell us why you want to cancel this order.
              </p>

            </div>


            <div className="space-y-5 px-6 py-6">

              <div>

                <label className="text-sm font-semibold text-gray-900">
                  Cancellation reason
                </label>

                <div className="mt-3 space-y-2">

                  {cancellationReasons.map(
                    (reason) => (

                      <label
                        key={reason}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                          cancelReason ===
                          reason
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >

                        <input
                          type="radio"
                          name="cancelReason"
                          value={reason}
                          checked={
                            cancelReason ===
                            reason
                          }
                          onChange={(e) =>
                            setCancelReason(
                              e.target.value
                            )
                          }
                          className="h-4 w-4 accent-red-600"
                        />

                        <span
                          className={`text-sm ${
                            cancelReason ===
                            reason
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {reason}
                        </span>

                      </label>

                    )
                  )}

                </div>

              </div>


              <div>

                <label className="text-sm font-semibold text-gray-900">

                  Additional details{" "}

                  <span className="font-normal text-gray-400">
                    (optional)
                  </span>

                </label>

                <textarea
                  value={
                    cancelComment
                  }
                  onChange={(e) =>
                    setCancelComment(
                      e.target.value
                    )
                  }
                  placeholder="Tell us more about your cancellation..."
                  rows={4}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />

                <div className="mt-1 text-right text-xs text-gray-400">
                  {cancelComment.length}/500
                </div>

              </div>


              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                <p className="text-sm leading-5 text-red-700">
                  Once the order is cancelled, it cannot be restored from this page.
                </p>

              </div>

            </div>


            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={
                  closeCancelModal
                }
                disabled={
                  !!cancellingId
                }
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Order
              </button>


              <button
                type="button"
                onClick={
                  handleCancelOrder
                }
                disabled={
                  !!cancellingId ||
                  !cancelReason
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {cancellingId ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================== */}
      {/* REVIEW MODAL */}
      {/* ===================================================== */}

      {reviewOpen &&
        selectedProduct && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <button
              onClick={
                closeReviewModal
              }
              disabled={
                reviewSubmitting
              }
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
            >
              <X size={18} />
            </button>


            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-xl font-semibold text-gray-900">
                Write a Review
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Share your experience with this product
              </p>

            </div>


            <div className="space-y-6 px-6 py-6">

              <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">

                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">

                  {selectedProduct.image ? (

                    <img
                      src={
                        selectedProduct.image
                      }
                      alt={
                        selectedProduct.name
                      }
                      className="h-full w-full object-contain p-1"
                    />

                  ) : (

                    <div className="flex h-full w-full items-center justify-center">

                      <Package
                        size={22}
                        className="text-gray-300"
                      />

                    </div>

                  )}

                </div>


                <div className="min-w-0">

                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                    {
                      selectedProduct.name
                    }
                  </h3>

                  {selectedProduct.variantName && (

                    <p className="mt-1 text-xs text-gray-500">
                      {
                        selectedProduct.variantName
                      }
                    </p>

                  )}

                </div>

              </div>


              <div>

                <label className="text-sm font-semibold text-gray-900">
                  Your Rating
                </label>

                <div className="mt-3 flex items-center gap-2">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewRating(
                            star
                          )
                        }
                        className="transition-transform hover:scale-110"
                      >

                        <Star
                          size={30}
                          className={
                            star <=
                            reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />

                      </button>

                    )
                  )}

                  {reviewRating > 0 && (

                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {reviewRating}/5
                    </span>

                  )}

                </div>

              </div>


              <div>

                <label className="text-sm font-semibold text-gray-900">
                  Your Review
                </label>

                <textarea
                  value={
                    reviewComment
                  }
                  onChange={(e) =>
                    setReviewComment(
                      e.target.value
                    )
                  }
                  placeholder="Tell us about your experience with this product..."
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />

              </div>


              <div>

                <div className="flex items-center justify-between">

                  <label className="text-sm font-semibold text-gray-900">
                    Add Photos
                    <span className="ml-1 font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <span className="text-xs text-gray-400">
                    {reviewImages.length}/3
                  </span>

                </div>


                <div className="mt-3 grid grid-cols-3 gap-3">

                  {reviewImages.length <
                    3 && (

                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-green-300 hover:bg-green-50">

                      <ImagePlus
                        size={24}
                        className="text-gray-400"
                      />

                      <span className="mt-1 text-xs text-gray-500">
                        Add Photo
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                          handleReviewImages
                        }
                        className="hidden"
                      />

                    </label>

                  )}


                  {reviewImages.map(
                    (file, index) => (

                      <div
                        key={`${file.name}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                      >

                        <img
                          src={URL.createObjectURL(
                            file
                          )}
                          alt={`Review ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeReviewImage(
                              index
                            )
                          }
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                        >
                          <X
                            size={14}
                          />
                        </button>

                      </div>

                    )
                  )}

                </div>


                <p className="mt-2 text-xs text-gray-400">
                  You can upload up to 3 product photos.
                </p>

              </div>

            </div>


            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={
                  closeReviewModal
                }
                disabled={
                  reviewSubmitting
                }
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleSubmitReview
                }
                disabled={
                  reviewSubmitting ||
                  reviewRating === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {reviewSubmitting ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Orders;