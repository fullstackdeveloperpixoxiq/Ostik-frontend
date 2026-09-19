import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPasswordOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    // Only allow numbers and maximum 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // Get userId saved from ForgotPassword page
    const userId = localStorage.getItem("forgotPasswordUserId");

    if (!userId) {
      toast.error("Session expired. Please try again.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verify-forgot-otp`,
        {
          userId,
          otp,
        }
      );

      toast.success(response.data.message);

      // OTP verified successfully
      navigate("/reset-password");

    } catch (error) {
      console.error("OTP verification error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F6] flex items-center justify-center px-4 py-10 font-['Helvetica',_Arial,_sans-serif]">

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
            Verify OTP
          </h1>

          <p className="mt-2 text-[14px] text-gray-500 leading-5">
            Enter the 6-digit OTP sent to your registered
            email address.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="block mb-2 text-[14px] font-semibold text-gray-700"
            >
              Enter OTP
            </label>

            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-full h-[48px] px-4 rounded-lg border border-gray-200 bg-white text-[17px] tracking-[5px] text-center text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400 placeholder:tracking-normal"
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full h-[48px] rounded-lg bg-[#00ff03] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#00e603] hover:shadow-[0_6px_18px_rgba(118,185,0,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Verify OTP

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>

        </form>

        {/* Back */}
        <div className="mt-7 pt-6 border-t border-gray-100 text-center">

          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-gray-600 hover:text-[#00e603] transition-colors"
          >
            <ArrowLeft size={16} />
            Change email
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordOTP;