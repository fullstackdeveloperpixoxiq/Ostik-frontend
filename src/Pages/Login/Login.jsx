import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";


const Login = () => {
  const navigate= useNavigate()

  const [formData,setFormData]= useState({
    email:"",
    password:""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes 
  const handleChange = (e) => { 
  const { name, value } = e.target; 

  setFormData((prev) => ({ 
  ...prev, 
  [name]: value, 
 })); };

 //handle login
 const handleSubmit= async(e)=>{
  e.preventDefault()

  setLoading(true);

  try { 
  const response = await axios.post( `${import.meta.env.VITE_API_URL}/api/user/login`, 
    formData ); 

    // Show backend success message 
    toast.success(response.data.message); 
    
    // Save JWT token 
  localStorage.setItem( "token", response.data.token ); 
  
  // Save user details 
  localStorage.setItem( "user", 
  JSON.stringify(response.data.user) 
); 

// Go to home page 
navigate("/"); 
} 
catch (error) { 
  console.error("Login error:", error); 
  
  // Show backend error message 
toast.error( error.response?.data?.message || "Something went wrong. Please try again." ); 
} 
finally { 
  setLoading(false); 
} 

 }
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-10 font-['Helvetica',_Arial,_sans-serif]">

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.07)] px-6 py-8 sm:px-9 sm:py-10 animate-[fadeUp_0.5s_ease-out]">

        {/* Logo */}
        <div className="flex justify-center items-center mb-7">
          <Link
            to="/"
            className="text-[29px] font-black tracking-[-1.5px] text-[#171717]"
          >
            <img src="\OstikLogo\OSTIK_PNG.png" alt="OSTIK" 
            className="w-[120px] h-auto object-contain"/>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#222]">
            Welcome back
          </h1>

          <p className="mt-2 text-[14px] text-gray-500">
            Sign in to continue to your Ostik account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="block mb-2 text-[14px] font-semibold text-gray-700">
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
              className="w-full h-[48px] px-4 rounded-lg border border-gray-200 bg-white text-[15px] text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[14px] font-semibold text-gray-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-[13px] font-medium text-[#00ff03] hover:text-[#00e603] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full h-[48px] mt-2 rounded-lg bg-[#00ff03] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#00e603] hover:shadow-[0_6px_18px_rgba(118,185,0,0.25)] active:scale-[0.98]"
          >
            {loading ? 
            ( "Signing in..." ) : 
            ( 
            <> 
            Sign In

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
            </>
            )}
          </button>

        </form>

        {/* Register */}
        <div className="mt-7 pt-6 border-t border-gray-100 text-center">
          <p className="text-[14px] text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#00ff03] hover:text-[#00e603] transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>

      </div>

      {/* Small Animation */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
};

export default Login;