import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  Check,
  ChevronRight,
  Package,
  MapPin,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // FETCH ORDER
  // --------------------------------------------------

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data?.order || null);
    } catch (error) {
      console.log("Fetch order error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CONFETTI
  // --------------------------------------------------

  const launchConfetti = () => {
    const duration = 2200;
    const animationEnd = Date.now() + duration;

    const colors = [
      "#16a34a",
      "#22c55e",
      "#000000",
      "#6b7280",
    ];

    const frame = () => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return;
      }

      const particleCount = 5;

      confetti({
        particleCount,
        angle: 60,
        spread: 70,
        origin: {
          x: 0,
          y: 0.65,
        },
        colors,
      });

      confetti({
        particleCount,
        angle: 120,
        spread: 70,
        origin: {
          x: 1,
          y: 0.65,
        },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  // --------------------------------------------------
  // ON PAGE LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchOrder();

    // Small delay makes the celebration feel smoother
    const timer = setTimeout(() => {
      launchConfetti();
    }, 300);

    return () => clearTimeout(timer);
  }, [orderId]);

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-5"></div>

          <p className="text-gray-600 text-sm">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ORDER NOT FOUND
  // --------------------------------------------------

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Package size={28} className="text-gray-500" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Order not found
          </h1>

          <p className="text-gray-500 text-sm mb-7">
            We couldn't find the order you're looking for.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shortOrderId = order._id
    ? order._id.slice(-8).toUpperCase()
    : "";

  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="shrink-0 px-10 flex items-center justify-center">
            <img src="\OstikLogo\OSTIK_PNG.png" alt="OSTIK"
            className="w-[150px] h-auto object-contain" />
          </div>

          {/* Secure label */}
          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
            <ShieldCheck
              size={17}
              className="text-green-600"
            />

            <span className="hidden sm:block">
              Secure Shopping
            </span>
          </div>

        </div>
      </header>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* ==================================================
            SUCCESS HERO
        ================================================== */}

        <section className="text-center">

          {/* Success circle */}

          <div className="relative inline-flex mb-7">

            <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-60"></div>

            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-600/20">

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 rounded-full flex items-center justify-center">

                <Check
                  size={42}
                  strokeWidth={3}
                  className="text-white"
                />

              </div>

            </div>

          </div>


          {/* Heading */}

          <p className="text-green-600 font-semibold text-sm uppercase tracking-[0.18em] mb-3">
            Order Confirmed
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-950">
            Thank you for your order! 🎉
          </h1>

          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-7">
            Your order has been successfully placed.
            We’ll make sure your OSTIK products reach you
            safely and on time.
          </p>


          {/* Order ID */}

          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-3 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-sm">

            <span className="text-xs text-gray-500">
              Order ID
            </span>

            <span className="font-semibold text-sm text-gray-900 tracking-wide">
              #{shortOrderId}
            </span>

          </div>

        </section>


        {/* ==================================================
            ORDER STATUS STRIP
        ================================================== */}

        <section className="mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">

          <div className="grid grid-cols-3 gap-2 sm:gap-6">

            {/* Order placed */}

            <div className="text-center">

              <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check
                  size={20}
                  className="text-green-600"
                  strokeWidth={2.5}
                />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                Order Placed
              </p>

              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                {formatDate(order.placedAt)}
              </p>

            </div>


            {/* Processing */}

            <div className="text-center relative">

              <div className="hidden sm:block absolute top-5 right-[58%] w-full h-px bg-gray-200"></div>

              <div className="relative w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock3
                  size={19}
                  className="text-gray-500"
                />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                Processing
              </p>

              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                Coming next
              </p>

            </div>


            {/* Delivery */}

            <div className="text-center relative">

              <div className="hidden sm:block absolute top-5 right-[58%] w-full h-px bg-gray-200"></div>

              <div className="relative w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck
                  size={19}
                  className="text-gray-500"
                />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                Delivery
              </p>

              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                We'll keep you updated
              </p>

            </div>

          </div>

        </section>


        {/* ==================================================
            CONTENT GRID
        ================================================== */}

        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6 mt-6">


          {/* ==================================================
              ORDER DETAILS
          ================================================== */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  Order Summary
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {order.items?.length || 0} item
                  {order.items?.length === 1 ? "" : "s"}
                </p>
              </div>

              <ShoppingBag
                size={21}
                className="text-gray-400"
              />

            </div>


            {/* Items */}

            <div className="divide-y divide-gray-100">

              {order.items?.map((item, index) => (

                <div
                  key={`${item.variantId || item.productId}-${index}`}
                  className="p-5 sm:px-6 flex gap-4"
                >

                  {/* Product image */}

                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package
                          size={25}
                          className="text-gray-300"
                        />
                      </div>
                    )}

                  </div>


                  {/* Product information */}

                  <div className="flex-1 min-w-0">

                    <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                      {item.name}
                    </h3>

                    {item.variantName && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variantName}
                      </p>
                    )}

                    {item.sku && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        SKU: {item.sku}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">

                      <p className="text-xs sm:text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="font-semibold text-sm sm:text-base text-gray-900">
                        {formatPrice(
                          item.finalPrice * item.quantity
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* Price breakdown */}

            <div className="border-t border-gray-100 p-5 sm:p-6">

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>


                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span className="font-medium text-green-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}


                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium text-green-600">
                    {order.shippingFee > 0
                      ? formatPrice(order.shippingFee)
                      : "FREE"}
                  </span>
                </div>

              </div>


              <div className="border-t border-gray-100 mt-5 pt-5 flex items-center justify-between">

                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-950">
                  {formatPrice(order.total)}
                </span>

              </div>

            </div>

          </section>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <div className="space-y-6">


            {/* ==================================================
                PAYMENT
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Payment
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Payment method selected
                  </p>
                </div>

              </div>


              <div className="bg-gray-50 rounded-xl p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Method
                  </span>

                  <span className="font-semibold text-sm text-gray-900">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Razorpay"}
                  </span>

                </div>


                <div className="flex items-center justify-between mt-3">

                  <span className="text-sm text-gray-500">
                    Status
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">

                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>

                    {order.paymentMethod === "cod"
                      ? "Pay on Delivery"
                      : order.paymentStatus}

                  </span>

                </div>

              </div>

            </section>


            {/* ==================================================
                DELIVERY ADDRESS
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <MapPin
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Delivery Address
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Your order will be delivered here
                  </p>
                </div>

              </div>


              <div className="text-sm leading-6">

                <p className="font-semibold text-gray-900">
                  {shippingAddress.fullName}
                </p>

                <p className="text-gray-500 mt-1">
                  {shippingAddress.address}
                </p>

                <p className="text-gray-500">
                  {shippingAddress.city},{" "}
                  {shippingAddress.state}
                </p>

                <p className="text-gray-500">
                  PIN - {shippingAddress.pincode}
                </p>

                <p className="text-gray-500 mt-2">
                  {shippingAddress.phone}
                </p>

              </div>

            </section>


            {/* ==================================================
                NEXT STEPS
            ================================================== */}

            <section className="bg-black rounded-2xl p-5 sm:p-6 text-white">

              <div className="flex gap-4">

                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Package size={20} />
                </div>

                <div>

                  <h3 className="font-semibold">
                    What happens next?
                  </h3>

                  <p className="text-gray-400 text-xs leading-5 mt-2">
                    We'll process your order and prepare
                    your products for dispatch. You can
                    track your order once it is shipped.
                  </p>

                </div>

              </div>

            </section>

          </div>

        </div>


        {/* ==================================================
            BUTTONS
        ================================================== */}

        <section className="mt-8 text-center">

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-black/10"
          >
            Continue Shopping

            <ChevronRight size={17} />
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Thank you for choosing OSTIK.
          </p>

        </section>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-gray-200 bg-white mt-4">

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} OSTIK. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            Secure & trusted shopping
          </div>

        </div>

      </footer>

    </div>
  );
};

export default OrderSuccess;