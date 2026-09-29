import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  Loader2,
  RefreshCcw,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const Exchange = () => {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const exchangeReasons = [
    "Product is damaged",
    "Product is defective",
    "Received wrong product",
    "Product has a different variant",
    "Product does not match description",
    "Other",
  ];

  // =====================================================
  // FETCH ORDER
  // =====================================================

  const fetchOrder = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      if (!orderId || !itemId) {
        toast.error("Invalid exchange request");
        navigate("/orders");
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
          "Exchange is available only for delivered orders"
        );

        navigate("/orders");
        return;
      }

      const selectedItem = fetchedOrder.items?.find(
        (orderItem) =>
          String(orderItem._id) === String(itemId)
      );

      if (!selectedItem) {
        toast.error("Product not found in this order");
        navigate("/orders");
        return;
      }

      setOrder(fetchedOrder);
      setItem(selectedItem);

      // Set the ordered product
      setProduct(selectedItem.productId);

      // Fetch the current product to get available variants
      await fetchProduct(selectedItem.productId);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to load exchange details"
      );

      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH SAME PRODUCT
  // =====================================================

  const fetchProduct = async (productId) => {
    try {
      const id =
        typeof productId === "object"
          ? productId?._id
          : productId;

      if (!id) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product/${id}`
      );

      const fetchedProduct =
        response.data.product ||
        response.data.data ||
        response.data;

      setProduct(fetchedProduct);

      const productVariants =
        fetchedProduct?.variants ||
        fetchedProduct?.Variants ||
        [];

      setVariants(productVariants);

      // Find the currently ordered variant
      if (item?.variantId && productVariants.length > 0) {
        const currentVariant = productVariants.find(
          (variant) =>
            String(variant._id) ===
            String(item.variantId)
        );

        if (currentVariant) {
          setSelectedVariant(currentVariant);
        }
      }
    } catch (err) {
      console.error(err);

      // Product details are not mandatory
      // for displaying the original ordered item.
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchOrder();
  }, [orderId, itemId]);

  // =====================================================
  // SUBMIT EXCHANGE
  // =====================================================

  const handleSubmit = async () => {
    try {
      if (!reason) {
        toast.error("Please select an exchange reason");
        return;
      }

      setSubmitting(true);

      /*
       * IMPORTANT:
       * Exchange is always for the SAME PRODUCT.
       *
       * Only the variant can change.
       */

      const exchangeProductId =
        item?.productId?._id ||
        item?.productId;

      const exchangeVariantId =
        selectedVariant?._id ||
        item?.variantId ||
        null;

      const exchangeName =
        item?.name || product?.name || "";

      const exchangeVariantName =
        selectedVariant?.name ||
        item?.variantName ||
        "";

      const exchangeSku =
        selectedVariant?.sku ||
        item?.sku ||
        "";

      const exchangeImage =
        selectedVariant?.images?.[0] ||
        selectedVariant?.image ||
        item?.image ||
        product?.images?.[0] ||
        "";

      /*
       * No price calculation here.
       *
       * Exchange is only product/variant replacement.
       */
      const exchangePrice =
        selectedVariant?.price ??
        item?.price ??
        item?.finalPrice ??
        0;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/exchange`,
        {
          orderId,
          orderItemId: itemId,

          // Same product
          exchangeProductId,

          // Only variant may change
          exchangeVariantId,

          exchangeName,
          exchangeVariantName,
          exchangeSku,
          exchangeImage,

          // Snapshot only, no payment transaction
          exchangePrice,

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
          "Exchange request submitted successfully"
      );

      navigate("/exchanges");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to submit exchange request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
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
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* Back */}
          <button
            onClick={() => navigate("/orders")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <RefreshCcw size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Exchange Product
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Exchange your ordered product for another
                  available variant.
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* PRODUCT */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Your Ordered Product
            </h2>

            <div className="flex gap-4 rounded-xl border border-gray-200 p-4">

              {/* Image */}

              <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item?.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <Package size={32} />
                  </div>
                )}
              </div>

              {/* Details */}

              <div className="min-w-0 flex-1">

                <h3 className="text-base font-semibold text-gray-900">
                  {item?.name}
                </h3>

                {item?.variantName && (
                  <p className="mt-1 text-sm text-gray-500">
                    Ordered Variant:{" "}
                    <span className="font-medium text-gray-700">
                      {item.variantName}
                    </span>
                  </p>
                )}

                {item?.sku && (
                  <p className="mt-1 text-xs text-gray-400">
                    SKU: {item.sku}
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-600">
                  Quantity: {item?.quantity}
                </p>

              </div>
            </div>

            {/* ================================================= */}
            {/* VARIANT */}
            {/* ================================================= */}

            {variants.length > 0 && (
              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select Variant
                </label>

                <div className="relative">

                  <select
                    value={selectedVariant?._id || ""}
                    onChange={(e) => {
                      const variant =
                        variants.find(
                          (v) =>
                            String(v._id) ===
                            e.target.value
                        );

                      setSelectedVariant(
                        variant || null
                      );
                    }}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select a variant
                    </option>

                    {variants.map((variant) => (
                      <option
                        key={variant._id}
                        value={variant._id}
                      >
                        {variant.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  You can change the variant only if another
                  variant is available for this product.
                </p>

              </div>
            )}

            {/* ================================================= */}
            {/* NO VARIANT */}
            {/* ================================================= */}

            {variants.length === 0 && (
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  This product does not have any other
                  exchangeable variants.
                </p>
              </div>
            )}

            {/* ================================================= */}
            {/* EXCHANGE POLICY */}
            {/* ================================================= */}

            <div className="mt-6 rounded-xl bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-800">
                Exchange Policy
              </p>

              <ul className="mt-2 space-y-1 text-xs leading-5 text-blue-700">
                <li>
                  • Exchange is available within 7 days
                  after delivery.
                </li>

                <li>
                  • Only the same product can be exchanged.
                </li>

                <li>
                  • Exchange is subject to product
                  availability.
                </li>

                <li>
                  • No additional payment or refund is
                  involved in the exchange.
                </li>
              </ul>

            </div>

          </div>

          {/* ================================================= */}
          {/* REASON + COMMENT */}
          {/* ================================================= */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Exchange Details
            </h2>

            {/* Reason */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Exchange Reason
              </label>

              <div className="relative">

                <select
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select a reason
                  </option>

                  {exchangeReasons.map(
                    (exchangeReason) => (
                      <option
                        key={exchangeReason}
                        value={exchangeReason}
                      >
                        {exchangeReason}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

              </div>
            </div>

            {/* Comment */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Additional Comment
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                rows={4}
                placeholder="Tell us more about the exchange..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/orders")}
              disabled={submitting}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitting ||
                !reason
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <RefreshCcw size={17} />
                  Submit Exchange Request
                </>
              )}
            </button>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Exchange;