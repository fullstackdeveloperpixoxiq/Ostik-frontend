import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/forgot-password`,
        {
          email,
        }
      );

      toast.success(response.data.message);

      // Save userId for OTP verification
      localStorage.setItem(
        "forgotPasswordUserId",
        response.data.userId
      );

      // Go to OTP page
      navigate("/forgot-password-otp");

    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7EF] flex items-center justify-center px-4 py-10 font-['Helvetica',_Arial,_sans-serif]">

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.07)] px-6 py-8 sm:px-9 sm:py-10">

        {/* Logo */}
        <div className="flex justify-center items-center mb-7">
          <Link to="/">
            <img
              src="/OstikLogo/OSTIK_PNG.png"
              alt="OSTIK"
              className="w-[120px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#222]">
            Forgot Password?
          </h1>

          <p className="mt-2 text-[14px] text-gray-500">
            Enter your registered email address and we'll
            send you an OTP to reset your password.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-[14px] font-semibold text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full h-[48px] px-4 rounded-lg border border-gray-200 bg-white text-[15px] text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400"
            />
          </div>

          {/* Send OTP */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full h-[48px] rounded-lg bg-[#00ff03] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#00e603] hover:shadow-[0_6px_18px_rgba(118,185,0,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Sending OTP..."
            ) : (
              <>
                Send OTP

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>

        </form>

        {/* Back to Login */}
        <div className="mt-7 pt-6 border-t border-gray-100 text-center">

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-gray-600 hover:text-[#00e603] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;