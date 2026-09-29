import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  RotateCcw,
  Loader2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const Returns = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // =====================================================
  // FETCH MY RETURNS
  // =====================================================

  const fetchReturns = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/return`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReturns(response.data.returns || []);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to load return requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // =====================================================
  // CANCEL RETURN REQUEST
  // =====================================================

  const handleCancel = async (returnId) => {
    try {
      setCancellingId(returnId);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/return/${returnId}/cancel`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Return request cancelled successfully");

      // Update status immediately
      setReturns((prevReturns) =>
        prevReturns.map((returnRequest) =>
          returnRequest._id === returnId
            ? {
                ...returnRequest,
                status: "Cancelled",
              }
            : returnRequest
        )
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to cancel return request"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =====================================================
  // SONNER CONFIRMATION
  // =====================================================

  const showCancelConfirmation = (returnId) => {
    toast(
      (t) => (
        <div className="w-full">
          <p className="font-semibold text-gray-900">
            Cancel return request?
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Are you sure you want to cancel this return request?
          </p>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Keep
            </button>

            <button
              onClick={() => {
                toast.dismiss(t);
                handleCancel(returnId);
              }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
            >
              Cancel Return
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

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

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* BACK */}

          <button
            onClick={() => navigate("/orders")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          {/* HEADER */}

          <div className="mb-6">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <RotateCcw
                  size={21}
                  className="text-orange-500"
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  My Returns
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Track and manage your return requests.
                </p>
              </div>

            </div>
          </div>

          {/* EMPTY */}

          {returns.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <RotateCcw
                  size={28}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                No return requests
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You don't have any return requests yet.
              </p>

              <button
                onClick={() => navigate("/orders")}
                className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                View My Orders
              </button>

            </div>
          ) : (

            /* RETURN LIST */

            <div className="space-y-4">

              {returns.map((returnRequest) => {

                const item = returnRequest.item;

                return (
                  <div
                    key={returnRequest._id}
                    className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >

                    <div className="p-5 sm:p-6">

                      {/* TOP */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        {/* PRODUCT */}

                        <div className="flex min-w-0 gap-4">

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                            {item?.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
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

                            <h2 className="truncate text-base font-semibold text-gray-900">
                              {item?.name || "Product"}
                            </h2>

                            {item?.variantName && (
                              <p className="mt-1 text-sm text-gray-500">
                                {item.variantName}
                              </p>
                            )}

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item?.quantity || 1}
                            </p>

                          </div>

                        </div>

                        {/* STATUS */}

                        <span
                          className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                            returnRequest.status
                          )}`}
                        >
                          {returnRequest.status}
                        </span>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Return Reason
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            {returnRequest.reason}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Requested On
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            {formatDate(
                              returnRequest.requestedAt ||
                                returnRequest.createdAt
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Order
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            #
                            {returnRequest.order?._id
                              ? returnRequest.order._id
                                  .slice(-8)
                                  .toUpperCase()
                              : "N/A"}
                          </p>
                        </div>

                      </div>

                      {/* COMMENT */}

                      {returnRequest.comment && (
                        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">

                          <p className="text-xs font-medium text-gray-400">
                            Your comment
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {returnRequest.comment}
                          </p>

                        </div>
                      )}

                      {/* ADMIN COMMENT */}

                      {returnRequest.adminComment && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                          <p className="text-xs font-medium text-blue-600">
                            Admin response
                          </p>

                          <p className="mt-1 text-sm text-blue-800">
                            {returnRequest.adminComment}
                          </p>

                        </div>
                      )}

                      {/* ACTIONS */}

                      <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">

                        {returnRequest.status === "Pending" && (
                          <button
                            onClick={() =>
                              showCancelConfirmation(
                                returnRequest._id
                              )
                            }
                            disabled={
                              cancellingId ===
                              returnRequest._id
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId ===
                            returnRequest._id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <XCircle size={15} />
                            )}

                            Cancel Return
                          </button>
                        )}

                        <button
                          onClick={() =>
                            navigate(
                              `/returns/${returnRequest._id}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </button>

                      </div>

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

export default Returns;