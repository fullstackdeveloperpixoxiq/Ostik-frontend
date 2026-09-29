import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const ReturnRequest = () => {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const returnReasons = [
    "Product is damaged",
    "Product is defective",
    "Received wrong product",
    "Product does not match description",
    "Received incomplete product",
    "Changed my mind",
    "Other",
  ];

  const fetchOrder = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/${orderId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedOrder = response.data.order;

      if (fetchedOrder.orderStatus !== "Delivered") {
        toast.error(
          "Return is available only for delivered orders"
        );

        navigate("/orders");
        return;
      }

      const selectedItem = fetchedOrder.items?.find(
        (item) => String(item._id) === String(itemId)
      );

      if (!selectedItem) {
        toast.error("Product not found in this order");
        navigate("/orders");
        return;
      }

      setOrder(fetchedOrder);
      setItem(selectedItem);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to load return details"
      );

      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId, itemId]);

  const handleSubmit = async () => {
    try {
      if (!reason) {
        toast.error("Please select a return reason");
        return;
      }

      setSubmitting(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/return`,
        {
          orderId,
          orderItemId: itemId,
          quantity: 1,
          reason,
          comment,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message ||
          "Return request submitted successfully"
      );

      navigate("/returns");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to submit return request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !order || !item) {
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8f9f7]">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">

          <button
            onClick={() =>
              navigate(`/orders/${orderId}`)
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Order
          </button>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <RotateCcw
                  size={22}
                  className="text-orange-500"
                />

                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Return Product
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Tell us why you want to return this product.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">

              {/* PRODUCT */}

              <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package
                        size={25}
                        className="text-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  {item.variantName && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.variantName}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

              </div>

              {/* REASON */}

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Return reason
                </label>

                <div className="mt-3 space-y-2">

                  {returnReasons.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                        reason === option
                          ? "border-orange-300 bg-orange-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="returnReason"
                        value={option}
                        checked={reason === option}
                        onChange={(e) =>
                          setReason(e.target.value)
                        }
                        className="accent-orange-500"
                      />

                      <span className="text-sm text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}

                </div>
              </div>

              {/* COMMENT */}

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Additional details{" "}
                  <span className="font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us more..."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

              {/* INFO */}

              <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
                <p className="text-sm leading-5 text-orange-700">
                  Return requests are available only within 7
                  days from delivery.
                </p>
              </div>

            </div>

            <div className="flex justify-end border-t border-gray-100 px-6 py-4">

              <button
                onClick={handleSubmit}
                disabled={submitting || !reason}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Submit Return Request
              </button>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnRequest;