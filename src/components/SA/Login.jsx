import { useState } from "react";
import { AuthLogin } from "../../api/SuperAdmin/LoginApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo.png";
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await AuthLogin(username, password);
    if (response.data.Status) {
      toast.success(response.data.Message || "Login successful!");
      console.log("Login successful:", response);
      localStorage.setItem("token", response.data.Token);
      localStorage.setItem("Role", response.data.Role);
      localStorage.setItem("Username", username);
      navigate("/dashboard");
      setUsername("");
      setPassword("");
      setLoading(false);
    } else {
      console.error("Login failed:", response);
      toast.error(response.data.Message || "Login failed!");
      setUsername("");
      setPassword("");
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex bg-gradient-to-br from-[#E80071] via-[#EF3F8F] to-[#D53C2F] min-h-screen flex-1 flex-col justify-center py-12 px-10 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src={Logo}
            className="mx-auto h-20 w-auto mb-5"
          />
          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-5  sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm rounded-2xl sm:px-12">
            <form
              action="#"
              method="POST"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E80071] sm:text-sm/6 "
                  />
                </div>
              </div>

              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E80071] sm:text-sm/6 pr-10"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-[#E80071] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#D53C2F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {loading ? "Siggning in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
