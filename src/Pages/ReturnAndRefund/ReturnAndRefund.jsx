import {
  CheckCircle2,
  Clock3,
  Package,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Mail,
  XCircle,
  IndianRupee,
} from "lucide-react";

const ReturnRefundPolicy = () => {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Return Eligibility" },
    { id: "non-returnable", label: "Non-Returnable Items" },
    { id: "request", label: "How to Request a Return" },
    { id: "inspection", label: "Return Inspection" },
    { id: "replacement", label: "Replacement & Exchange" },
    { id: "refund", label: "Refund Policy" },
    { id: "refund-timeline", label: "Refund Timeline" },
    { id: "cancellation", label: "Order Cancellation" },
    { id: "damaged", label: "Damaged or Defective Products" },
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
              <RefreshCcw size={16} />
              Ostik Returns & Refunds
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Return & Refund Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              We want you to have a smooth experience with every Ostik
              purchase. This policy explains when a product may be returned,
              how returns are processed, and how refunds are handled.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Last updated: October 2026
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK INFO
      ========================================================== */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-200 px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <RefreshCcw size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Returns</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                Eligible Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <Package size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                Original Condition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Verification</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                Quality Check
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-7 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f8e7] text-[#00ff03]">
              <IndianRupee size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Refund</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                Original Payment Method
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
                  At Ostik, we aim to provide quality products and a smooth
                  shopping experience. If you receive a product that qualifies
                  for return under this policy, you may contact our support
                  team to request a return or replacement.
                </p>

                <p>
                  All return requests are subject to verification and the
                  applicable conditions described below.
                </p>

                <p>
                  Products must generally be returned in the condition in
                  which they were received, along with the applicable
                  accessories, packaging, manuals, and other items supplied
                  with the original order.
                </p>
              </div>
            </section>

            {/* RETURN ELIGIBILITY */}
            <section
              id="eligibility"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <CheckCircle2 size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Return Eligibility
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  A return request may be considered when the product falls
                  under an eligible return reason and satisfies the applicable
                  return conditions.
                </p>

                <p>Examples of situations that may qualify include:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Product received in a damaged condition.
                  </li>

                  <li>
                    Product received with a manufacturing or functional
                    defect.
                  </li>

                  <li>
                    Product received is different from the product ordered.
                  </li>

                  <li>
                    An item is missing from the delivered order.
                  </li>

                  <li>
                    Another issue that is specifically covered by the
                    applicable product or order policy.
                  </li>
                </ul>

                <p>
                  Eligibility is determined after reviewing the information
                  provided by the customer and, where necessary, inspecting
                  the returned product.
                </p>
              </div>

              <div className="mt-6 flex gap-3 rounded-xl bg-[#f7fbf3] p-5">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#00ff03]"
                  size={20}
                />

                <p className="text-sm leading-6 text-gray-600">
                  Please keep your order number, original packaging, and
                  product accessories available until your return request has
                  been completely resolved.
                </p>
              </div>
            </section>

            {/* NON RETURNABLE */}
            <section
              id="non-returnable"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <XCircle size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Non-Returnable Situations
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  A return may not be accepted in situations where the product
                  does not meet the applicable return conditions.
                </p>

                <p>Examples may include:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Products that show signs of misuse, abuse, or accidental
                    damage caused after delivery.
                  </li>

                  <li>
                    Products modified, repaired, or altered by an
                    unauthorized person.
                  </li>

                  <li>
                    Products returned without essential accessories or
                    components supplied with the original order.
                  </li>

                  <li>
                    Products returned without the required original packaging
                    where the packaging is necessary for safe return.
                  </li>

                  <li>
                    Products that cannot be verified as belonging to the
                    original order.
                  </li>

                  <li>
                    Return requests that do not satisfy the applicable return
                    requirements.
                  </li>
                </ul>
              </div>
            </section>

            {/* REQUEST */}
            <section
              id="request"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <RefreshCcw size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  How to Request a Return
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00ff03] text-sm font-bold text-white">
                    1
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Contact Us
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Contact Ostik support with your order number and the
                    reason for your return request.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00ff03] text-sm font-bold text-white">
                    2
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Share Details
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Provide photographs, videos, or other information if
                    required to understand the issue.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00ff03] text-sm font-bold text-white">
                    3
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Follow Instructions
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    If your request is approved, our support team will provide
                    the next steps for returning the product.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[#dcebcf] bg-[#f7fbf3] p-5">
                <p className="text-sm leading-6 text-gray-600">
                  <strong className="text-gray-900">Important:</strong> Please
                  do not send a product back without first contacting Ostik
                  support and receiving return instructions.
                </p>
              </div>
            </section>

            {/* INSPECTION */}
            <section
              id="inspection"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <ShieldCheck size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Return Inspection
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Returned products may be inspected after they reach our
                  designated return facility or service location.
                </p>

                <p>
                  The inspection may include checking the product condition,
                  serial number or identifying information, accessories,
                  packaging, and the reported issue.
                </p>

                <p>
                  The outcome of the inspection will determine whether the
                  return, replacement, exchange, or refund can be approved.
                </p>
              </div>
            </section>

            {/* REPLACEMENT */}
            <section
              id="replacement"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <RefreshCcw size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Replacement & Exchange
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Depending on the nature of the issue and product
                  availability, Ostik may provide a replacement or exchange
                  instead of a refund.
                </p>

                <p>
                  Replacement availability depends on stock and the specific
                  product involved.
                </p>

                <p>
                  If a replacement is not available or cannot be provided,
                  another applicable resolution may be offered after reviewing
                  the return request.
                </p>
              </div>
            </section>

            {/* REFUND */}
            <section
              id="refund"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <IndianRupee size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Refund Policy
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  If a return is approved for a refund, the eligible refund
                  amount will be processed after the return has been reviewed
                  and approved.
                </p>

                <p>
                  Wherever possible, refunds for online payments will be
                  processed through the original payment method used to place
                  the order.
                </p>

                <p>
                  The final refund amount may depend on the nature of the
                  return, the order, applicable charges, and the resolution
                  approved by Ostik.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    <IndianRupee size={19} className="text-[#00ff03]" />

                    <h3 className="font-semibold text-gray-900">
                      Online Payments
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Approved refunds are generally processed back through the
                    payment method used for the order.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    <Package size={19} className="text-[#00ff03]" />

                    <h3 className="font-semibold text-gray-900">
                      Cash on Delivery
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    For eligible COD refunds, our support team may request
                    appropriate bank or payment details to process the refund.
                  </p>
                </div>
              </div>
            </section>

            {/* REFUND TIMELINE */}
            <section
              id="refund-timeline"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Clock3 size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Refund Timeline
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Refund processing begins after the return has been received
                  and successfully reviewed, where a return is required.
                </p>

                <p>
                  After Ostik initiates the refund, the time taken for the
                  amount to appear in your account may depend on the payment
                  provider, bank, or financial institution.
                </p>

                <p>
                  If the refund has been confirmed by Ostik but the amount has
                  not yet appeared in your account, please allow additional
                  processing time before contacting your bank or payment
                  provider.
                </p>
              </div>

              <div className="mt-6 flex gap-3 rounded-xl bg-[#f7fbf3] p-5">
                <Clock3
                  className="mt-0.5 shrink-0 text-[#00ff03]"
                  size={20}
                />

                <p className="text-sm leading-6 text-gray-600">
                  Refund timelines can vary depending on the payment method
                  and financial institution. We recommend keeping your refund
                  confirmation until the amount is credited.
                </p>
              </div>
            </section>

            {/* CANCELLATION */}
            <section
              id="cancellation"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <XCircle size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Cancellation
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  Cancellation requests should be made as early as possible
                  after placing an order.
                </p>

                <p>
                  An order may not be cancellable once it has been processed,
                  packed, shipped, or otherwise moved beyond the cancellation
                  stage.
                </p>

                <p>
                  If an eligible prepaid order is successfully cancelled, the
                  applicable refund will be processed according to the
                  payment method and refund process.
                </p>

                <p>
                  If an order has already been shipped, you may need to follow
                  the applicable return or delivery resolution process instead
                  of cancellation.
                </p>
              </div>
            </section>

            {/* DAMAGED / DEFECTIVE */}
            <section
              id="damaged"
              className="mt-6 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Damaged or Defective Products
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  If you receive a product that appears damaged or does not
                  function as expected, please contact Ostik support as soon
                  as possible.
                </p>

                <p>
                  Please provide your order number along with clear
                  photographs or videos showing the product and the reported
                  issue when requested.
                </p>

                <p>
                  Our team may ask for additional information or troubleshooting
                  steps before approving a replacement, return, or refund.
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
                      Keep the product and packaging
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please do not discard the product, accessories, or
                      original packaging while your complaint or return
                      request is being reviewed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* WRONG / MISSING */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f8e7] text-[#00ff03]">
                  <Package size={21} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Wrong or Missing Product
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                <p>
                  If you receive a product that is different from the item
                  shown in your order, or if a product is missing from your
                  shipment, please contact our support team with your order
                  number.
                </p>

                <p>
                  We may request photographs of the product, package, shipping
                  label, and other relevant information to investigate the
                  issue.
                </p>

                <p>
                  After verification, Ostik will provide the applicable
                  resolution based on the circumstances of the order.
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
                    Can I return any product I purchase?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Returns are subject to the applicable return conditions
                    and eligibility requirements. Not every situation or
                    product may qualify for a return.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    What if I receive a damaged product?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Contact Ostik support as soon as possible and provide your
                    order details along with photographs or videos of the
                    damage when requested.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    How will I receive my refund?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Approved refunds for online payments are generally
                    processed through the original payment method. COD refunds
                    may require appropriate payment details.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    How long does a refund take?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Refund processing begins after the applicable return or
                    cancellation has been approved. The time for the amount to
                    reach your account may depend on your bank or payment
                    provider.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Can I cancel an order after it has shipped?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Cancellation may not be possible after an order has been
                    processed or shipped. In such cases, the applicable return
                    or delivery process may need to be followed.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900">
                    What happens if my return is rejected?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    If a returned product does not satisfy the applicable
                    return conditions, the return or refund may be rejected.
                    Our support team can provide information regarding the
                    applicable resolution.
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
                  Need Help With a Return or Refund?
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-base">
                  If you have received a damaged, defective, incorrect, or
                  incomplete order, or if you have a question about a refund,
                  our support team can help.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00ff03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00ae01]"
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
                Return and refund requests are reviewed according to the
                applicable conditions of the order and product. Ostik may
                update this policy from time to time to reflect changes in its
                return, replacement, and refund processes.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;