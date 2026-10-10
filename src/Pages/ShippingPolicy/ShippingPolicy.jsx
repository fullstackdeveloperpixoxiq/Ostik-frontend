import {
  CheckCircle2,
  Clock3,
  Package,
  MapPin,
  Truck,
  Search,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react";

const ShippingPolicy = () => {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "charges", label: "Shipping Charges" },
    { id: "processing", label: "Order Processing" },
    { id: "delivery", label: "Delivery Time" },
    { id: "tracking", label: "Order Tracking" },
    { id: "address", label: "Delivery Address" },
    { id: "delays", label: "Delays & Delivery Issues" },
    { id: "damaged", label: "Damaged Packages" },
    { id: "missing", label: "Missing or Incorrect Items" },
    { id: "contact", label: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="border-b border-gray-200 bg-gradient-to-br from-[#f3faeb] via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8ebc5] bg-white px-4 py-2 text-sm font-medium text-[#808080] shadow-sm">
              <Truck size={16} />
              Ostik Shipping Information
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Shipping Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              We want your Ostik order to reach you safely and on time. This
              policy explains our shipping charges, delivery timelines,
              tracking process, and what to do if you experience a delivery
              issue.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Last updated: October 2026
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK SHIPPING INFO
      ========================================================== */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-200 px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          {/* Free Shipping */}
          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <Package size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Free Shipping</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                100000+
              </p>
            </div>
          </div>

          {/* Shipping Charge */}
          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <Truck size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Below 100000</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ₹70 Shipping
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <Clock3 size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                4–8 Days
              </p>
            </div>
          </div>

          {/* Carrier */}
          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <MapPin size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Shipping Partner</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                India Post
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* =====================================================
              TABLE OF CONTENTS
          ====================================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">
                On this page
              </h3>

              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-[#f3faeb] hover:text-[#659800]"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* =====================================================
              POLICY CONTENT
          ====================================================== */}
          <main className="min-w-0">
            {/* OVERVIEW */}
            <section
              id="overview"
              className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <ShieldCheck size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Overview
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  At Ostik, we aim to make the delivery process simple,
                  transparent, and convenient. Once your order is successfully
                  placed, our team processes the order and prepares it for
                  shipment.
                </p>

                <p>
                  Delivery timelines may vary depending on the destination,
                  product availability, courier operations, weather
                  conditions, public holidays, and other circumstances beyond
                  our control.
                </p>

                <p>
                  The estimated delivery date shown during checkout or in your
                  order details is an estimate and should not be considered a
                  guaranteed delivery date.
                </p>
              </div>
            </section>

            {/* SHIPPING CHARGES */}
            <section
              id="charges"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Truck size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Charges
                </h2>
              </div>

              <p className="mb-6 text-[15px] leading-7 text-gray-600">
                Shipping charges are calculated based on the order subtotal.
                The applicable shipping charge will be displayed during
                checkout before you place the order.
              </p>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="grid grid-cols-2 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-900">
                  <span>Order Subtotal</span>
                  <span>Shipping Charge</span>
                </div>

                <div className="grid grid-cols-2 border-t border-gray-200 px-5 py-4 text-sm text-gray-600">
                  <span>Below 100000</span>
                  <span className="font-semibold text-gray-900">₹70</span>
                </div>

                <div className="grid grid-cols-2 border-t border-gray-200 px-5 py-4 text-sm text-gray-600">
                  <span>100000 and above</span>
                  <span className="font-semibold text-[#00d803]">
                    Free Shipping
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3 rounded-xl bg-[#f8fbf4] p-4">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#00ff03]"
                  size={19}
                />

                <p className="text-sm leading-6 text-gray-600">
                  The shipping charge is calculated on the order subtotal
                  according to the applicable shipping rule at the time of
                  placing the order.
                </p>
              </div>
            </section>

            {/* ORDER PROCESSING */}
            <section
              id="processing"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Package size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Processing
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  After you place an order successfully, the order is
                  registered in our system and prepared for processing.
                </p>

                <p>
                  Orders are checked and packed before being handed over to
                  the shipping carrier. The delivery timeline starts after the
                  order has been processed for shipment.
                </p>

                <p>
                  During periods of high order volume, promotions, holidays,
                  or other operational circumstances, processing may take
                  longer than usual.
                </p>
              </div>
            </section>

            {/* DELIVERY TIME */}
            <section
              id="delivery"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Clock3 size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Delivery Time
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Orders are generally expected to reach the delivery address
                  within approximately <strong>4 to 8 days</strong> after
                  processing, depending on the destination and courier
                  service.
                </p>

                <p>
                  The estimated delivery period displayed on your order may
                  vary depending on your location and shipping conditions.
                </p>

                <p>
                  Delivery estimates are not guaranteed. Delays may occur due
                  to weather conditions, transportation issues, public
                  holidays, service disruptions, incorrect address details, or
                  other circumstances outside Ostik's direct control.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step 1
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    Order Placed
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Your order is successfully created.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step 2
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    Order Processed
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Your products are prepared for shipment.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step 3
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    Delivered
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    The shipment reaches your address.
                  </p>
                </div>
              </div>
            </section>

            {/* TRACKING */}
            <section
              id="tracking"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Search size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Tracking
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Once your order is processed and tracking information is
                  available, you can view the shipment status from your order
                  details.
                </p>

                <p>
                  Your order may initially show a pending or processing status
                  before the shipment is handed over to the delivery carrier.
                </p>

                <p>
                  Tracking updates depend on the information received from
                  the shipping carrier and may not appear immediately after
                  shipment.
                </p>
              </div>

              <div className="mt-6 flex gap-3 rounded-xl border border-[#dcebcf] bg-[#f7fbf3] p-5">
                <Search
                  className="mt-0.5 shrink-0 text-[#00ff03]"
                  size={20}
                />

                <div>
                  <p className="font-semibold text-gray-900">
                    Where can I track my order?
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Log in to your Ostik account and open your order details
                    to view the latest available order and shipment status.
                  </p>
                </div>
              </div>
            </section>

            {/* ADDRESS */}
            <section
              id="address"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <MapPin size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Please make sure that your delivery address, phone number,
                  and other contact details are correct before placing your
                  order.
                </p>

                <p>
                  Incorrect or incomplete address information may result in
                  delivery delays, unsuccessful delivery attempts, or the
                  shipment being returned.
                </p>

                <p>
                  Once an order has been processed or shipped, changes to the
                  delivery address may not always be possible.
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <AlertTriangle
                    className="mt-0.5 shrink-0 text-amber-600"
                    size={20}
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Please check your address carefully
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Ostik may not be responsible for delays or failed
                      deliveries caused by incorrect or incomplete address
                      information provided by the customer.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* DELAYS */}
            <section
              id="delays"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Clock3 size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Delays & Delivery Issues
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Although we work to deliver orders within the estimated
                  timeframe, certain circumstances may cause delays.
                </p>

                <p>Possible reasons include:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Adverse weather conditions</li>
                  <li>Transportation or logistics disruptions</li>
                  <li>Public holidays or regional holidays</li>
                  <li>Incorrect or incomplete delivery information</li>
                  <li>Courier service disruptions</li>
                  <li>Unexpected operational circumstances</li>
                </ul>

                <p>
                  If your order appears to be delayed beyond the expected
                  delivery period, please contact our support team with your
                  order details so that we can assist you.
                </p>
              </div>
            </section>

            {/* DAMAGED */}
            <section
              id="damaged"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <AlertTriangle size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Damaged or Tampered Packages
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Please inspect the package when you receive your order. If
                  the package appears visibly damaged, opened, or tampered
                  with, please take appropriate photographs or videos before
                  opening it whenever possible.
                </p>

                <p>
                  If the product inside the package is damaged, contact Ostik
                  support as soon as possible with your order details and
                  supporting photographs or videos.
                </p>

                <p>
                  Our team will review the issue and guide you through the
                  applicable resolution process.
                </p>
              </div>
            </section>

            {/* MISSING / INCORRECT */}
            <section
              id="missing"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Package size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Missing or Incorrect Items
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  If you receive an item that is different from what you
                  ordered, or if an item appears to be missing from your
                  shipment, please contact us as soon as possible.
                </p>

                <p>
                  Please provide your order number and relevant details so our
                  team can investigate the issue and provide the appropriate
                  assistance.
                </p>

                <p>
                  Keeping the original packaging and product materials may
                  help us review and resolve the issue more efficiently.
                </p>
              </div>
            </section>

            {/* SERVICEABILITY */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <MapPin size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Serviceability
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Orders are delivered to serviceable locations supported by
                  our shipping network and delivery partners.
                </p>

                <p>
                  Availability of delivery may depend on the destination
                  address and the serviceability of the shipping carrier.
                </p>

                <p>
                  If a location is not serviceable, the order may not be
                  available for delivery to that address.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <HelpCircle size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Is shipping free on all orders?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Orders with a subtotal of ₹100000 or above are eligible for
                    free shipping. Orders below ₹100000 have a shipping charge of
                    ₹70.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    How long will my order take to arrive?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Orders are generally expected to arrive within
                    approximately 4–8 days, depending on the destination and
                    courier operations.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    How can I track my order?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    You can view the available order and shipment status from
                    your order details after logging into your Ostik account.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    What should I do if my order is delayed?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    If your order has gone beyond the estimated delivery
                    period, contact our support team with your order number so
                    we can assist you.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    What should I do if I receive a damaged package?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Take photographs or videos of the package and contact
                    Ostik support with your order details as soon as possible.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTACT */}
            <section
              id="contact"
              className="mt-6 scroll-mt-24 overflow-hidden rounded-2xl bg-[#1f1f1f] p-6 text-white shadow-sm sm:p-8"
            >
              <div className="max-w-2xl">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00ff03] text-white">
                  <HelpCircle size={22} />
                </div>

                <h2 className="text-2xl font-bold">
                  Need Help With Your Order?
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-base">
                  If you have questions about shipping, delivery, tracking, or
                  an issue with your order, our support team is here to help.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00ff03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#659f00]"
                  >
                    <Mail size={17} />
                    Contact Support
                  </a>

                  <a
                    href="/orders"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <Package size={17} />
                    View My Orders
                  </a>
                </div>
              </div>
            </section>

            {/* FINAL NOTE */}
            <div className="mt-8 flex gap-3 rounded-xl border border-gray-200 bg-white p-5">
              <CheckCircle2
                className="mt-0.5 shrink-0 text-[#00ff03]"
                size={19}
              />

              <p className="text-sm leading-6 text-gray-500">
                By placing an order on Ostik, you acknowledge the shipping
                information described in this policy. Shipping terms may be
                updated from time to time to reflect changes in our delivery
                process or services.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;