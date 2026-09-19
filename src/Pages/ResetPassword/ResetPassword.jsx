import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newpassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (formData.newpassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Get userId saved during forgot password flow
    const userId = localStorage.getItem("forgotPasswordUserId");

    if (!userId) {
      toast.error("Session expired. Please try again.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/reset-password`,
        {
          userId,
          newpassword: formData.newpassword,
        }
      );

      toast.success(response.data.message);

      // Remove temporary forgot password data
      localStorage.removeItem("forgotPasswordUserId");

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error("Reset password error:", error);

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
            Reset Password
          </h1>

          <p className="mt-2 text-[14px] text-gray-500">
            Create a new password for your Ostik account.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* New Password */}
          <div>
            <label
              htmlFor="newpassword"
              className="block mb-2 text-[14px] font-semibold text-gray-700"
            >
              New password
            </label>

            <div className="relative">
              <input
                id="newpassword"
                name="newpassword"
                type={showPassword ? "text" : "password"}
                value={formData.newpassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                className="w-full h-[48px] px-4 pr-12 rounded-lg border border-gray-200 bg-white text-[15px] text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#76B900] transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-[14px] font-semibold text-gray-700"
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                className="w-full h-[48px] px-4 pr-12 rounded-lg border border-gray-200 bg-white text-[15px] text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#76B900] transition-colors"
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full h-[48px] rounded-lg bg-[#00ff03] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#00e603] hover:shadow-[0_6px_18px_rgba(118,185,0,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Resetting..."
            ) : (
              <>
                Reset Password

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
            className="text-[14px] font-semibold text-gray-600 hover:text-[#00e603] transition-colors"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;