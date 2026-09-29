import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  RotateCcw,
  Loader2,
  CalendarDays,
  MessageSquare,
  CircleCheck,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const ReturnDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH RETURN DETAILS
  // =====================================================

  const fetchReturnDetails = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/return/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReturnRequest(response.data.returnRequest);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to load return details"
      );

      navigate("/returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnDetails();
  }, [id]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Approved":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Picked Up":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Received":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Refunded":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "Cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f9f7]">
          <Loader2
            size={32}
            className="animate-spin text-green-600"
          />
        </div>

        <Footer />
      </>
    );
  }

  if (!returnRequest) {
    return null;
  }

  const item = returnRequest.item;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

          {/* =====================================================
              BACK TO RETURNS
          ===================================================== */}

          <button
            onClick={() => navigate("/returns")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Returns
          </button>

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
              <RotateCcw
                size={22}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Return Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View the details and status of your return request.
              </p>
            </div>

          </div>

          {/* =====================================================
              MAIN CARD
          ===================================================== */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* =====================================================
                STATUS HEADER
            ===================================================== */}

            <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Return Request
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  #{returnRequest._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                  returnRequest.status
                )}`}
              >
                {returnRequest.status}
              </span>

            </div>

            <div className="space-y-6 px-6 py-6">

              {/* =====================================================
                  PRODUCT
              ===================================================== */}

              <div>
                <h2 className="mb-3 text-sm font-semibold text-gray-900">
                  Product
                </h2>

                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">

                    {item?.image ? (
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

                  <div className="min-w-0">

                    <h3 className="text-base font-semibold text-gray-900">
                      {item?.name || "Product"}
                    </h3>

                    {item?.variantName && (
                      <p className="mt-1 text-sm text-gray-500">
                        Variant: {item.variantName}
                      </p>
                    )}

                    {item?.sku && (
                      <p className="mt-1 text-sm text-gray-500">
                        SKU: {item.sku}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item?.quantity || 1}
                    </p>

                  </div>

                </div>
              </div>

              {/* =====================================================
                  RETURN INFORMATION
              ===================================================== */}

              <div>
                <h2 className="mb-3 text-sm font-semibold text-gray-900">
                  Return Information
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* REASON */}

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex items-center gap-2 text-gray-400">

                      <RotateCcw size={16} />

                      <span className="text-xs font-medium uppercase tracking-wide">
                        Reason
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-medium text-gray-800">
                      {returnRequest.reason}
                    </p>

                  </div>

                  {/* DATE */}

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex items-center gap-2 text-gray-400">

                      <CalendarDays size={16} />

                      <span className="text-xs font-medium uppercase tracking-wide">
                        Requested On
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-medium text-gray-800">
                      {formatDate(
                        returnRequest.requestedAt ||
                          returnRequest.createdAt
                      )}
                    </p>

                  </div>

                </div>
              </div>

              {/* =====================================================
                  ORDER INFORMATION
              ===================================================== */}

              {returnRequest.order && (
                <div>

                  <h2 className="mb-3 text-sm font-semibold text-gray-900">
                    Order Information
                  </h2>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-xs text-gray-400">
                          Order ID
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          #
                          {returnRequest.order._id
                            .slice(-8)
                            .toUpperCase()}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/orders/${returnRequest.order._id}`
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 text-sm font-medium text-gray-700 transition hover:text-black"
                      >
                        View Order
                        <ChevronRight size={16} />
                      </button>

                    </div>

                  </div>

                </div>
              )}

              {/* =====================================================
                  YOUR COMMENT
              ===================================================== */}

              {returnRequest.comment && (
                <div>

                  <h2 className="mb-3 text-sm font-semibold text-gray-900">
                    Your Comment
                  </h2>

                  <div className="flex gap-3 rounded-xl bg-gray-50 p-4">

                    <MessageSquare
                      size={18}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <p className="text-sm leading-6 text-gray-600">
                      {returnRequest.comment}
                    </p>

                  </div>

                </div>
              )}

              {/* =====================================================
                  ADMIN RESPONSE
              ===================================================== */}

              {returnRequest.adminComment && (
                <div>

                  <h2 className="mb-3 text-sm font-semibold text-gray-900">
                    Admin Response
                  </h2>

                  <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <CircleCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-500"
                    />

                    <p className="text-sm leading-6 text-blue-800">
                      {returnRequest.adminComment}
                    </p>

                  </div>

                </div>
              )}

              {/* =====================================================
                  STATUS MESSAGE
              ===================================================== */}

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">

                <p className="text-sm leading-6 text-orange-700">
                  Your return request is currently{" "}
                  <span className="font-semibold">
                    {returnRequest.status}
                  </span>
                  . You can check this page later for status updates.
                </p>

              </div>

            </div>

            {/* =====================================================
                BOTTOM ACTIONS
            ===================================================== */}

            <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                {/* BACK TO RETURNS */}

                <button
                  onClick={() => navigate("/returns")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  Back to Returns
                </button>

                {/* VIEW ORDER */}

                {returnRequest.order && (
                  <button
                    onClick={() =>
                      navigate(
                        `/orders/${returnRequest.order._id}`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    View Order
                    <ChevronRight size={16} />
                  </button>
                )}

              </div>

              {/* CONTINUE SHOPPING */}

              <div className="mt-4 text-center">

                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
                >
                  <ShoppingBag size={16} />
                  Continue Shopping
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnDetails;