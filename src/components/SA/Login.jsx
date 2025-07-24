import { useEffect, useState } from "react";
import { AuthLogin } from "../../api/SuperAdmin/LoginApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/img/nykaacore2.png";
import { Eye, EyeOff } from "lucide-react";
import LoginBanner from "../../assets/img/LoginBanner.jpg";
import yuvaLogo from "../../assets/img/yuva.png";

import mobLoginBanner from "../../assets/img/mobLoginBanner.jpg";
import { useMediaQuery } from "react-responsive";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const backgroundImage = isMobile ? mobLoginBanner : LoginBanner;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthLogin(username, password);
      if (response.data.Status) {
        toast.success(response.data.Message || "Login successful!");
        localStorage.setItem("token", response.data.Token);
        localStorage.setItem("Role", response.data.Role);
        localStorage.setItem("Username", username);
        navigate("/dashboard");
      } else {
        toast.error(response.data.Message || "Login failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col justify-center  px-4 py-12 overflow-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        minHeight: "100vh", // Optional - ensure it's visible
      }}
    >
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <img
            src={Logo}
            alt="Your Company"
            className="mx-auto h-20 w-auto sm:h-24 lg:h-28"
          />
          <h2 className="mt-2 text-2xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="bg-white px-6 py-8 shadow rounded-2xl  sm:px-12 ">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-gray-100 px-3 py-2 text-base text-gray-900 border border-gray-200 focus:border-[#E80071] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-gray-100 px-3 py-2 text-base text-gray-900 border border-gray-200 focus:border-[#E80071] focus:outline-none pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 top-6 right-3 flex items-center justify-center text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-[#E80071] px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#D53C2F] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#E80071]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd6UlsJEmb0E5FpopouOjm_A2BML1oUcjOiL-D2PJ0CLrv_sA/viewform"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Apply to join the Wait List
            </a>
          </p>
        </div>
      </div>
      <img
        src={yuvaLogo}
        alt="Your Company"
        className="mx-auto mt-6 h-12 w-auto sm:h-16 md:h-20"
      />
    </div>
  );
}
