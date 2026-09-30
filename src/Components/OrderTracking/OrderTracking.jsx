import {
  Check,
  Clock3,
  Package,
  Box,
  Truck,
  MapPin,
  Home,
  X,
  RotateCcw,
  RefreshCw,
  CalendarDays,
  CircleCheck,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";

const OrderTracking = ({ order }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!order) return null;

  // =========================================================
  // ORDER STATUS
  // =========================================================

  const currentStatus = (
    order.orderStatus ||
    order.status ||
    "Pending"
  )
    .toLowerCase()
    .trim();

  const isCancelled =
    currentStatus === "cancelled" ||
    currentStatus === "canceled";

  // =========================================================
  // DELIVERY STEPS
  // =========================================================

  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      description: "Order received",
      icon: ShoppingBag,
    },
    {
      key: "processing",
      label: "Processing",
      description: "Preparing your order",
      icon: Package,
    },
    {
      key: "packed",
      label: "Packed",
      description: "Package is ready",
      icon: Box,
    },
    {
      key: "shipped",
      label: "Shipped",
      description: "On the way",
      icon: Truck,
    },
    {
      key: "out_for_delivery",
      label: "Out for Delivery",
      description: "Arriving soon",
      icon: MapPin,
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Order delivered",
      icon: Home,
    },
  ];

  const statusMap = {
    pending: "pending",
    processing: "processing",
    packed: "packed",
    shipped: "shipped",
    "out for delivery": "out_for_delivery",
    out_for_delivery: "out_for_delivery",
    delivered: "delivered",
  };

  const trackingStatus =
    statusMap[currentStatus] || "pending";

  const activeIndex = steps.findIndex(
    (step) => step.key === trackingStatus
  );

  const safeIndex = activeIndex < 0 ? 0 : activeIndex;

  const currentStep = steps[safeIndex];

  // =========================================================
  // EXPECTED DELIVERY
  // =========================================================

  const expectedDelivery =
    order.expectedDeliveryDate ||
    order.estimatedDeliveryDate ||
    order.deliveryDate ||
    null;

  const formatDate = (date) => {
    if (!date) return null;

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const deliveryDate = formatDate(expectedDelivery);

  // =========================================================
  // RETURN / EXCHANGE
  // =========================================================

  const items = order.items || order.orderItems || [];

  const returnStatuses = [
    order.returnStatus,
    ...items.map((item) => item.returnStatus),
  ]
    .filter(Boolean)
    .map((status) => status.toLowerCase().trim());

  const exchangeStatuses = [
    order.exchangeStatus,
    ...items.map((item) => item.exchangeStatus),
  ]
    .filter(Boolean)
    .map((status) => status.toLowerCase().trim());

  const isReturnCompleted = returnStatuses.some(
    (status) =>
      status === "returned" ||
      status === "return_completed" ||
      status === "return complete"
  );

  const isExchangeCompleted = exchangeStatuses.some(
    (status) =>
      status === "exchanged" ||
      status === "exchange_completed" ||
      status === "exchange complete"
  );

  const hasReturn =
    returnStatuses.length > 0;

  const hasExchange =
    exchangeStatuses.length > 0;

  // =========================================================
  // CURRENT MESSAGE
  // =========================================================

  const getCurrentMessage = () => {
    if (isCancelled) {
      return "This order has been cancelled.";
    }

    switch (trackingStatus) {
      case "pending":
        return "Your order has been placed successfully.";

      case "processing":
        return "We're preparing your order for shipment.";

      case "packed":
        return "Your order has been packed and is ready to ship.";

      case "shipped":
        return "Your package is on its way to you.";

      case "out_for_delivery":
        return "Your package is out for delivery.";

      case "delivered":
        return "Your order has been delivered successfully.";

      default:
        return "Your order is being processed.";
    }
  };

  // =========================================================
  // RETURN MESSAGE
  // =========================================================

  const getReturnMessage = () => {
    if (isReturnCompleted) {
      return "Your return has been completed successfully.";
    }

    const latest =
      returnStatuses[returnStatuses.length - 1];

    if (
      latest === "requested" ||
      latest?.includes("request")
    ) {
      return "Your return request has been received.";
    }

    if (
      latest === "approved" ||
      latest?.includes("approved")
    ) {
      return "Your return request has been approved.";
    }

    if (
      latest === "pickup_scheduled" ||
      latest?.includes("pickup")
    ) {
      return "Your return pickup is being arranged.";
    }

    return "Your return is currently being processed.";
  };

  // =========================================================
  // EXCHANGE MESSAGE
  // =========================================================

  const getExchangeMessage = () => {
    if (isExchangeCompleted) {
      return "Your exchange has been completed successfully.";
    }

    const latest =
      exchangeStatuses[exchangeStatuses.length - 1];

    if (
      latest === "requested" ||
      latest?.includes("request")
    ) {
      return "Your exchange request has been received.";
    }

    if (
      latest === "approved" ||
      latest?.includes("approved")
    ) {
      return "Your exchange request has been approved.";
    }

    return "Your replacement item is being prepared.";
  };

  // =========================================================
  // ICON ANIMATION
  // =========================================================

  const getCurrentIconAnimation = (stepKey) => {
    if (stepKey === "processing") {
      return "animate-order-pulse";
    }

    if (stepKey === "packed") {
      return "animate-order-bounce";
    }

    if (stepKey === "shipped") {
      return "animate-truck";
    }

    if (stepKey === "out_for_delivery") {
      return "animate-location";
    }

    if (stepKey === "delivered") {
      return "animate-success";
    }

    if (stepKey === "pending") {
      return "animate-soft-pulse";
    }

    return "";
  };

  return (
    <section className="space-y-5">

      {/* =====================================================
          MAIN TRACKING CARD
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                  <ShoppingBag
                    size={18}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Tracking
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Track your order status
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS BADGE */}

            <div
              className={`
                flex w-fit items-center gap-2 rounded-full
                border px-3.5 py-2
                ${
                  isCancelled
                    ? "border-red-100 bg-red-50"
                    : "border-green-100 bg-green-50"
                }
              `}
            >
              <span
                className={`
                  h-2 w-2 rounded-full
                  ${
                    isCancelled
                      ? "bg-red-500"
                      : "bg-green-500"
                  }
                `}
              />

              <span
                className={`
                  text-xs font-semibold
                  ${
                    isCancelled
                      ? "text-red-700"
                      : "text-green-700"
                  }
                `}
              >
                {isCancelled
                  ? "Cancelled"
                  : currentStep.label}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            CANCELLED STATE
        ==================================================== */}

        {isCancelled ? (
          <div className="px-5 py-10 sm:px-7 sm:py-12">

            <div className="mx-auto max-w-md text-center">

              {/* Animated cancel icon */}

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

                <div className="absolute inset-0 rounded-full bg-red-50 animate-cancel-ring" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
                  <X
                    size={30}
                    strokeWidth={2.5}
                    className="text-red-500 animate-cancel-icon"
                  />
                </div>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Order Cancelled
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                This order has been cancelled and will
                not be processed or delivered.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2.5">
                <CircleCheck
                  size={15}
                  className="text-gray-400"
                />

                <span className="text-xs text-gray-500">
                  No further delivery updates
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ===============================================
                EXPECTED DELIVERY
            ================================================ */}

            {deliveryDate &&
              trackingStatus !== "delivered" && (
                <div className="px-5 pt-5 sm:px-7">
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-green-100 bg-green-50/50 px-4 py-3.5">

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <CalendarDays
                          size={18}
                          className="text-green-600"
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Expected Delivery
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-gray-900">
                          {deliveryDate}
                        </p>
                      </div>
                    </div>

                    <span className="hidden text-[10px] font-medium text-green-600 sm:block">
                      On schedule
                    </span>
                  </div>
                </div>
              )}

            {/* ===============================================
                DESKTOP TIMELINE
            ================================================ */}

            <div className="hidden px-7 pb-10 pt-12 sm:block">

              <div className="relative">

                {/* Background connector */}

                <div className="absolute left-[8.5%] right-[8.5%] top-[30px] h-[3px] rounded-full bg-gray-100" />

                {/* Animated progress */}

                <div
                  className="absolute left-[8.5%] top-[30px] h-[3px] rounded-full bg-green-500 transition-all duration-[1200ms] ease-out"
                  style={{
                    width:
                      safeIndex === 0
                        ? "0%"
                        : `${(safeIndex / 5) * 83}%`,
                  }}
                />

                <div className="relative grid grid-cols-6">

                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    const completed =
                      index < safeIndex;

                    const current =
                      index === safeIndex;

                    return (
                      <div
                        key={step.key}
                        className={`
                          flex flex-col items-center text-center
                          transition-all duration-700
                          ${
                            visible
                              ? "translate-y-0 opacity-100"
                              : "translate-y-3 opacity-0"
                          }
                        `}
                        style={{
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >

                        {/* ICON */}

                        <div
                          className={`
                            relative z-10 flex h-[60px] w-[60px]
                            items-center justify-center
                            rounded-full border-[5px]
                            border-white
                            transition-all duration-500
                            ${
                              completed
                                ? "bg-green-500 text-white shadow-[0_5px_18px_rgba(34,197,94,0.22)]"
                                : current
                                ? "bg-green-500 text-white shadow-[0_0_0_8px_rgba(34,197,94,0.08),0_8px_25px_rgba(34,197,94,0.25)]"
                                : "bg-gray-100 text-gray-400"
                            }
                            ${
                              current
                                ? "scale-110"
                                : ""
                            }
                          `}
                        >

                          {/* current glow */}

                          {current && (
                            <span className="absolute inset-[-5px] rounded-full border border-green-300/50 animate-current-ring" />
                          )}

                          {/* completed */}

                          {completed ? (
                            <Check
                              size={22}
                              strokeWidth={3}
                              className="animate-check"
                            />
                          ) : (
                            <Icon
                              size={22}
                              className={`
                                relative
                                ${
                                  current
                                    ? getCurrentIconAnimation(
                                        step.key
                                      )
                                    : ""
                                }
                              `}
                            />
                          )}
                        </div>

                        {/* LABEL */}

                        <p
                          className={`
                            mt-4 text-xs font-semibold
                            ${
                              completed || current
                                ? "text-gray-900"
                                : "text-gray-400"
                            }
                          `}
                        >
                          {step.label}
                        </p>

                        {/* DESCRIPTION */}

                        <p
                          className={`
                            mt-1 max-w-[120px]
                            text-[10px] leading-4
                            ${
                              current
                                ? "text-gray-500"
                                : "text-gray-400"
                            }
                          `}
                        >
                          {step.description}
                        </p>

                        {/* STATUS */}

                        {completed && (
                          <span className="mt-2 text-[9px] font-medium text-green-600">
                            Completed
                          </span>
                        )}

                        {current && (
                          <span className="mt-2 rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-600">
                            Current
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ===============================================
                MOBILE TIMELINE
            ================================================ */}

            <div className="px-5 py-8 sm:hidden">

              <div className="relative">

                {/* line */}

                <div className="absolute bottom-6 left-[21px] top-6 w-[3px] rounded-full bg-gray-100" />

                {/* progress */}

                <div
                  className="absolute left-[21px] top-6 w-[3px] rounded-full bg-green-500 transition-all duration-[1200ms]"
                  style={{
                    height:
                      safeIndex === 0
                        ? "0%"
                        : `${(safeIndex / 5) * 100}%`,
                  }}
                />

                <div className="space-y-7">

                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    const completed =
                      index < safeIndex;

                    const current =
                      index === safeIndex;

                    return (
                      <div
                        key={step.key}
                        className={`
                          relative flex gap-4
                          transition-all duration-500
                          ${
                            visible
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-3 opacity-0"
                          }
                        `}
                        style={{
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >

                        {/* ICON */}

                        <div
                          className={`
                            relative z-10 flex h-[43px] w-[43px]
                            shrink-0 items-center justify-center
                            rounded-full border-4 border-white
                            ${
                              completed
                                ? "bg-green-500 text-white"
                                : current
                                ? "bg-green-500 text-white shadow-[0_0_0_6px_rgba(34,197,94,0.08)]"
                                : "bg-gray-100 text-gray-400"
                            }
                          `}
                        >

                          {completed ? (
                            <Check
                              size={17}
                              strokeWidth={3}
                            />
                          ) : (
                            <Icon
                              size={17}
                              className={
                                current
                                  ? getCurrentIconAnimation(
                                      step.key
                                    )
                                  : ""
                              }
                            />
                          )}
                        </div>

                        {/* CONTENT */}

                        <div className="pt-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <p
                              className={`
                                text-sm font-semibold
                                ${
                                  completed || current
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }
                              `}
                            >
                              {step.label}
                            </p>

                            {current && (
                              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-green-600">
                                Current
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            {step.description}
                          </p>

                          {completed && (
                            <p className="mt-1 text-[10px] font-medium text-green-600">
                              Completed
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ===============================================
                CURRENT STATUS
            ================================================ */}

            <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CircleCheck
                    size={17}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    {getCurrentMessage()}
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {trackingStatus === "delivered"
                      ? "Thank you for shopping with Ostik."
                      : "We'll keep you updated with every step."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          RETURN / EXCHANGE
      ====================================================== */}

      {(hasReturn || hasExchange) && !isCancelled && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* secondary header */}

          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              After-Sales Status
            </p>
          </div>

          <div className="divide-y divide-gray-100">

            {/* RETURN */}

            {hasReturn && (
              <div className="flex items-center gap-4 px-5 py-5 sm:px-6">

                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center
                    justify-center rounded-xl
                    ${
                      isReturnCompleted
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                    }
                  `}
                >
                  {isReturnCompleted ? (
                    <CircleCheck
                      size={21}
                      className="animate-check"
                    />
                  ) : (
                    <RotateCcw
                      size={20}
                      className="animate-return"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="text-sm font-semibold text-gray-900">
                      {isReturnCompleted
                        ? "Returned"
                        : "Return"}
                    </p>

                    <span
                      className={`
                        rounded-full px-2.5 py-1 text-[9px]
                        font-semibold uppercase tracking-wide
                        ${
                          isReturnCompleted
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }
                      `}
                    >
                      {isReturnCompleted
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {getReturnMessage()}
                  </p>
                </div>
              </div>
            )}

            {/* EXCHANGE */}

            {hasExchange && (
              <div className="flex items-center gap-4 px-5 py-5 sm:px-6">

                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center
                    justify-center rounded-xl
                    ${
                      isExchangeCompleted
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600"
                    }
                  `}
                >
                  {isExchangeCompleted ? (
                    <CircleCheck
                      size={21}
                      className="animate-check"
                    />
                  ) : (
                    <RefreshCw
                      size={20}
                      className="animate-exchange"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="text-sm font-semibold text-gray-900">
                      {isExchangeCompleted
                        ? "Exchanged"
                        : "Exchange"}
                    </p>

                    <span
                      className={`
                        rounded-full px-2.5 py-1 text-[9px]
                        font-semibold uppercase tracking-wide
                        ${
                          isExchangeCompleted
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }
                      `}
                    >
                      {isExchangeCompleted
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {getExchangeMessage()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes order-pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.12);
          }
        }

        @keyframes order-bounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes truck {
          0% {
            transform: translateX(-2px);
          }

          50% {
            transform: translateX(3px);
          }

          100% {
            transform: translateX(-2px);
          }
        }

        @keyframes location {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes success {
          0% {
            transform: scale(0.8);
          }

          60% {
            transform: scale(1.15);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes soft-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.8;
          }
        }

        @keyframes current-ring {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }

          70% {
            transform: scale(1.15);
            opacity: 0;
          }

          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }

        @keyframes check {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }

          70% {
            transform: scale(1.15);
            opacity: 1;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes cancel-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        @keyframes cancel-icon {
          0% {
            transform: scale(0.5) rotate(-10deg);
            opacity: 0;
          }

          70% {
            transform: scale(1.1) rotate(3deg);
            opacity: 1;
          }

          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes return {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes exchange {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        .animate-order-pulse {
          animation: order-pulse 1.8s ease-in-out infinite;
        }

        .animate-order-bounce {
          animation: order-bounce 1.5s ease-in-out infinite;
        }

        .animate-truck {
          animation: truck 1.6s ease-in-out infinite;
        }

        .animate-location {
          animation: location 1.4s ease-in-out infinite;
        }

        .animate-success {
          animation: success 0.8s ease-out;
        }

        .animate-soft-pulse {
          animation: soft-pulse 1.8s ease-in-out infinite;
        }

        .animate-current-ring {
          animation: current-ring 2s ease-out infinite;
        }

        .animate-check {
          animation: check 0.45s ease-out;
        }

        .animate-cancel-ring {
          animation: cancel-ring 1.8s ease-out infinite;
        }

        .animate-cancel-icon {
          animation: cancel-icon 0.5s ease-out;
        }

        .animate-return {
          animation: return 2.5s linear infinite;
        }

        .animate-exchange {
          animation: exchange 2.5s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default OrderTracking;