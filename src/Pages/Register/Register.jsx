import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/register`,
          formData
        );


      toast.success(
        response.data.message
      );


      // Save user ID
      localStorage.setItem(
        "registrationUserId",
        response.data.userId
      );


      // Go to OTP page
      navigate("/verify-otp");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


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
          className="mb-10 flex justify-center items-center text-[30px] font-black tracking-[-1.5px] text-[#171717]"
        >
          <img src="\OstikLogo\OSTIK_PNG.png" alt="OSTIK" 
          className="w-[150px] h-auto object-contain"/>
        </Link>


        {/* Card */}

        <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:px-10 sm:py-10">

          {/* Heading */}

          <div className="mb-8 text-center">

            <h1 className="text-[30px] font-bold tracking-[-1px] text-[#171717]">
              Create an account
            </h1>

            <p className="mt-2 text-[15px] text-[#777777]">
              Join OSTIK and start exploring.
            </p>

          </div>


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#333333]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-[#171717] outline-none transition duration-200 placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-4 focus:ring-[#72C500]/10"
              />

            </div>


            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#333333]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-[#171717] outline-none transition duration-200 placeholder:text-gray-400 focus:border-[#00ff03] focus:ring-4 focus:ring-[#72C500]/10"
              />

            </div>


            {/* Password */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#333333]"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-[15px] text-[#171717] outline-none transition duration-200 placeholder:text-gray-400 focus:border-[#72C500] focus:ring-4 focus:ring-[#72C500]/10"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#72C500]"
                >

                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}

                </button>

              </div>

            </div>


            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00ff03] text-[15px] font-semibold text-white transition duration-200 hover:bg-[#00e603] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <span>
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </span>

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}

            </button>

          </form>


          {/* Login */}

          <p className="mt-7 text-center text-sm text-[#777777]">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-[#72C500] hover:text-[#00ff03]"
            >
              Sign in
            </Link>

          </p>

        </div>


        {/* Bottom */}

        <p className="mt-6 text-center text-xs text-[#999999]">
          By creating an account, you agree to our terms and privacy policy.
        </p>

      </div>

    </main>
  );
};

export default Register;