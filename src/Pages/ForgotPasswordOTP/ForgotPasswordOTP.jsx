import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPasswordOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = sessionStorage.getItem("forgotPasswordUserId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!userId) {
      toast.error("Password reset session expired");
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

      navigate("/reset-password");
    } catch (error) {
      console.error("OTP verification error:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify OTP
          </h1>

          <p className="mt-2 text-gray-500 text-sm">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#76b900]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#76b900] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#65a300] transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-gray-600 hover:text-[#76b900]"
          >
            ← Back to Forgot Password
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordOTP;