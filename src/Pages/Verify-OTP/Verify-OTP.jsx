import { useEffect, useRef, useState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // Focus first input when page loads
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Only keep one digit
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);

    // Move to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) {
      return;
    }

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus after the last pasted digit
    const nextIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // Handle OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    // Check OTP
    if (enteredOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    // Get userId saved during registration
    const userId = localStorage.getItem(
      "registrationUserId"
    );

    if (!userId) {
      toast.error(
        "Registration session not found. Please register again."
      );

      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/user/verify-otp`,
        {
          userId,
          otp: enteredOtp,
        }
      );

      // Show backend success message
      toast.success(response.data.message);

      // Remove temporary registration userId
      localStorage.removeItem(
        "registrationUserId"
      );

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      // Show backend error message
      toast.error(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8F5] px-5 py-10 font-['Helvetica',_Arial,_sans-serif] flex items-center justify-center">

      <div className="w-full max-w-[460px]">

        {/* Logo */}
        <Link
          to="/"
          className="mb-10 block text-center text-[30px] font-black tracking-[-1.5px] text-[#171717]"
        >
          OST<span className="text-[#72C500]">I</span>K
        </Link>

        {/* Card */}
        <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:px-10 sm:py-10">

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF6D8] text-[#72C500]">
              <MailCheck size={30} strokeWidth={1.8} />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">

            <h1 className="text-[29px] font-bold tracking-[-1px] text-[#171717]">
              Verify your email
            </h1>

            <p className="mx-auto mt-3 max-w-[340px] text-[15px] leading-6 text-[#777777]">
              We&apos;ve sent a 6-digit verification
              code to your email address.
            </p>

          </div>

          {/* OTP Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* OTP Inputs */}
            <div
              className="flex justify-center gap-2.5 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  required
                  aria-label={`OTP digit ${index + 1}`}
                  className="h-12 w-11 rounded-xl border border-gray-200 bg-white text-center text-xl font-semibold text-[#171717] outline-none transition-all duration-200 focus:border-[#72C500] focus:ring-4 focus:ring-[#72C500]/10 sm:h-14 sm:w-12"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#72C500] text-[15px] font-semibold text-white transition duration-200 hover:bg-[#63AE00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {loading
                  ? "Verifying..."
                  : "Verify email"}
              </span>

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}
            </button>

          </form>

          {/* Help Text */}
          <div className="mt-7 text-center">

            <p className="text-sm text-[#777777]">
              Didn&apos;t receive the code?
            </p>

            <p className="mt-1 text-xs text-[#999999]">
              Please check your spam or junk folder.
            </p>

          </div>

          {/* Login Link */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">

            <p className="text-sm text-[#777777]">
              Already verified?{" "}

              <Link
                to="/login"
                className="font-semibold text-[#72C500] hover:text-[#63AE00]"
              >
                Sign in
              </Link>
            </p>

          </div>

        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-xs text-[#999999]">
          Your verification code is valid for 10
          minutes.
        </p>

      </div>

    </main>
  );
};

export default VerifyOTP;