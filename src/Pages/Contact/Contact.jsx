import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";

const Contact = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error(
        "Please fill in all required fields"
      );

      return;
    }


    try {

      setLoading(true);


      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        formData,
        {
      headers: {
      "Content-Type": "application/json",
    },
  }
      );


      const data = response.data;


      toast.success(
        data.message ||
          "Your message has been sent successfully"
      );


      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });


    } catch (err) {

      console.error(
        "Contact form error:",
        err
      );

      toast.error(
        err.response?.data?.message
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-[#F3F7EF] text-gray-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="border-b border-gray-200 bg-gray-50">

        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-10 lg:py-20">


          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:mt-5 sm:text-4xl">

            Get in Touch

          </h1>


          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">

            Have a question about our products,
            orders or anything else? We're here
            to help.

          </p>

        </div>

      </section>


      {/* =====================================================
          CONTACT CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">


          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div>

            <span className="text-sm font-bold uppercase tracking-wider text-[#00cc00]">
              Contact Us
            </span>


            <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">

              We'd love to hear
              from you.

            </h2>


            <p className="mt-4 text-sm leading-7 text-gray-500">

              Whether you need help with a
              product, have a question about
              your order, or simply want to
              get in touch, send us a message
              and our team will get back to you.

            </p>


            {/* CONTACT DETAILS */}

            <div className="mt-7 space-y-5 sm:mt-8 sm:space-y-6">


              {/* EMAIL */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff03]/15">

                  <Mail className="h-5 w-5 text-black" />

                </div>


                <div>

                  <p className="text-sm font-bold">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    support@ostik.in
                  </p>

                </div>

              </div>


              {/* PHONE */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff03]/15">

                  <Phone className="h-5 w-5 text-black" />

                </div>


                <div>

                  <p className="text-sm font-bold">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    +91 85904 973558
                  </p>

                </div>

              </div>


              {/* ADDRESS */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff03]/15">

                  <MapPin className="h-5 w-5 text-black" />

                </div>


                <div>

                  <p className="text-sm font-bold">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Ostik Electronics,
                    Kerala, India
                  </p>

                </div>

              </div>


              {/* WORKING HOURS */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff03]/15">

                  <Clock3 className="h-5 w-5 text-black" />

                </div>


                <div>

                  <p className="text-sm font-bold">
                    Working Hours
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Monday – Saturday
                  </p>

                  <p className="text-sm text-gray-500">
                    9:00 AM – 6:00 PM
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE - FORM
          ================================================== */}

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-7 lg:p-8">

            <div className="mb-6 sm:mb-7">

              <h2 className="text-xl font-bold">
                Send us a message
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Fill in the form and we'll get
                back to you as soon as possible.
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* NAME + EMAIL */}

              <div className="grid gap-5 sm:grid-cols-2">


                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>


                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-2 focus:ring-[#00ff03]/20"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Email
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>


                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-2 focus:ring-[#00ff03]/20"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Phone
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>


                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-2 focus:ring-[#00ff03]/20"
                />

              </div>


              {/* SUBJECT */}

              <div>

                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Subject
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>


                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What can we help you with?"
                  className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-2 focus:ring-[#00ff03]/20"
                />

              </div>


              {/* MESSAGE */}

              <div>

                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Message
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>


                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={6}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-2 focus:ring-[#00ff03]/20"
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black px-6 text-sm font-bold text-white transition hover:bg-[#00ff03] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}

              </button>


              <p className="text-center text-xs text-gray-400">
                We usually respond within 1–2
                business days.
              </p>

            </form>

          </div>

        </div>

      </section>

    </main>
    <Footer/>
    </>
  );
};

export default Contact;