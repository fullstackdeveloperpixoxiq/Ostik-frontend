import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";


const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <footer className="bg-white text-gray-800">

      {/* ================= NEWSLETTER ================= */}

      <section className="border-y border-gray-200 bg-[#f7faf3]">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">

          {/* Newsletter text */}

          <div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#00ff03]">
              Stay Connected
            </p>

            <h2 className="text-2xl font-bold text-[#171a1a] sm:text-3xl">
              Get the latest from OSTIK
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Sign up for exclusive offers, new product launches and
              technology updates.
            </p>

          </div>


          {/* Newsletter input */}

          <div className="flex w-full max-w-md">

            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-l-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00e603]"
            />

            <button
              type="button"
              className="rounded-r-lg bg-[#00ff03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#649f00]"
            >
              Subscribe
            </button>

          </div>

        </div>

      </section>


      {/* ================= MAIN FOOTER ================= */}

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">


          {/* ================= BRAND ================= */}

          <div className="lg:pr-8">

            {/* OSTIK Logo */}

            <div className="mb-5">

              <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
              className="w-[150px] h-auto object-contain"/>

            </div>


            {/* Description */}

            <p className="max-w-sm text-sm leading-7 text-gray-500">

              Smart technology and reliable accessories designed
              to make your everyday digital experience better.

            </p>


            {/* Social media */}

            <div className="mt-6 flex items-center gap-3">


              {/* Facebook */}

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#00ff03] hover:text-[#00ff03]"
              >
                <FaFacebookF size={15} />
              </a>


              {/* Instagram */}

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#00ff03] hover:text-[#00ff03]"
              >
                <FaInstagram size={16} />
              </a>


              {/* YouTube */}

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#00ff03] hover:text-[#00ff03]"
              >
                <FaYoutube size={17} />
              </a>


              {/* Twitter */}

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#00ff03] hover:text-[#00ff03]"
              >
                <FaTwitter size={15} />
              </a>

            </div>

          </div>



          {/* ================= INFORMATION ================= */}

          <div>

            <h3 className="mb-5 text-base font-bold text-[#171a1a]">
              Information
            </h3>


            <ul className="space-y-3 text-sm text-gray-500">

              <li>
                <a
                  href="/about"
                  className="transition hover:text-[#00ff03]"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="transition hover:text-[#00ff03]"
                >
                  Contact Us
                </a>
              </li>

              <li>
                <a
                  href="/products"
                  className="transition hover:text-[#00ff03]"
                >
                  Products
                </a>
              </li>

              <li>
                <a
                  href="/offers"
                  className="transition hover:text-[#00ff03]"
                >
                  Offers
                </a>
              </li>

              <li>
                <a
                  href="/blogs"
                  className="transition hover:text-[#00ff03]"
                >
                  Blogs
                </a>
              </li>

            </ul>

          </div>



          {/* ================= CUSTOMER SERVICE ================= */}

          <div>

            <h3 className="mb-5 text-base font-bold text-[#171a1a]">
              Customer Service
            </h3>


            <ul className="space-y-3 text-sm text-gray-500">

              <li>
                <a
                  href="/my-account"
                  className="transition hover:text-[#00ff03]"
                >
                  My Account
                </a>
              </li>

              <li>
                <a
                  href="/orders"
                  className="transition hover:text-[#00ff03]"
                >
                  Track Order
                </a>
              </li>

              <li>
                <a
                  href="/shipping"
                  className="transition hover:text-[#00ff03]"
                >
                  Shipping Policy
                </a>
              </li>

              <li>
                <a
                  href="/returns"
                  className="transition hover:text-[#00ff03]"
                >
                  Returns & Refunds
                </a>
              </li>

              <li>
                <a
                  href="/warranty"
                  className="transition hover:text-[#00ff03]"
                >
                  Warranty
                </a>
              </li>

            </ul>

          </div>



          {/* ================= CONTACT ================= */}

          <div>

            <h3 className="mb-5 text-base font-bold text-[#171a1a]">
              Contact Us
            </h3>


            <div className="space-y-4 text-sm text-gray-500">


              {/* Address */}

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#00ff03]"
                />

                <p className="leading-6">

                  OSTIK Electronics
                  <br />
                  Kerala, India

                </p>

              </div>


              {/* Phone */}

              <div className="flex items-center gap-3">

                <Phone
                  size={17}
                  className="shrink-0 text-[#00ff03]"
                />

                <a
                  href="tel:+919000000000"
                  className="hover:text-[#00ff03]"
                >
                  +91 90000 00000
                </a>

              </div>


              {/* Email */}

              <div className="flex items-center gap-3">

                <Mail
                  size={17}
                  className="shrink-0 text-[#00ff03]"
                />

                <a
                  href="mailto:support@ostik.com"
                  className="hover:text-[#00ff03]"
                >
                  support@ostik.com
                </a>

              </div>

            </div>

          </div>

        </div>



        {/* ================= BOTTOM ================= */}

        <div className="mt-12 border-t border-gray-200 pt-6">

          <div className="flex flex-col gap-5 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">


            {/* Policies */}

            <div className="flex flex-wrap gap-x-6 gap-y-2">

              <a
                href="/privacy-policy"
                className="transition hover:text-[#76B900]"
              >
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="transition hover:text-[#76B900]"
              >
                Terms of Service
              </a>

              <a
                href="/refund-policy"
                className="transition hover:text-[#76B900]"
              >
                Refund Policy
              </a>

            </div>


            {/* Copyright */}

            <p>
              © {new Date().getFullYear()} OSTIK. All rights reserved.
            </p>

          </div>

        </div>

      </div>



      {/* ================= BACK TO TOP ================= */}

      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#00ff03] text-white shadow-lg transition hover:bg-[#649f00]"
      >

        <ArrowUp size={19} />

      </button>

    </footer>
  );
};


export default Footer;