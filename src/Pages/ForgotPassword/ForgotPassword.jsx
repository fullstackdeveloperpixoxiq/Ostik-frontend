import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/forgot-password`,
        {
          email,
        }
      );

      toast.success(response.data.message);

      // Store user ID for OTP verification
      sessionStorage.setItem(
        "forgotPasswordUserId",
        response.data.userId
      );

      // Go to OTP page
      navigate("/forgot-password/otp");

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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password?
          </h1>

          <p className="mt-2 text-gray-500 text-sm">
            Enter your email address and we'll send you an OTP
            to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#76b900] focus:ring-1 focus:ring-[#76b900]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00ff03] cursor-pointer text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#00d603] transition disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-[#76b900] transition"
          >
            ← Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;