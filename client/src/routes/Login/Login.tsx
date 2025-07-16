import React, { useContext, useState, type FormEvent } from "react";
import { FaGoogle, FaUser } from "react-icons/fa";
import { FaApple } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.js";
import apiRequest from "../../lib/apiRequest";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     setErrors({
      username: "",
      password: "",
    });
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
       updateUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("userId", res.data.user.id);
     
      navigate("/profile");
    } catch (err: any) {
      console.log(err);
      setErrors({
        username: "",
        password: err.response?.data?.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[740px] flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg mb-3">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-gray-600 text-base">
              Sign in to continue your journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button className="group flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-0.5">
              <FaGoogle
                className="text-red-500 group-hover:scale-110 transition-transform duration-200"
                size={18}
              />
              <span className="font-medium text-gray-700 text-sm">Google</span>
            </button>
            <button className="group flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-0.5">
              <FaApple
                className="group-hover:scale-110 transition-transform duration-200"
                size={18}
              />
              <span className="font-medium text-sm">Apple</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-xs text-gray-500 font-medium">
                or continue with email
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="space-y-4">
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  username
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
                    size={16}
                  />
                  <input
                    id="username"
                    name="username"
                    type="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                    required
                    placeholder="username"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white text-sm"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
                    size={16}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                    {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-gray-700 font-medium"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-5 border border-transparent rounded-lg shadow-md text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-semibold text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 my-2 mx-3 rounded-md max-h-[730px]  relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-100 transition-transform duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-20"></div>
        <div className="absolute bottom-8 left-8 text-white z-30 max-w-sm">
          <h3 className="text-2xl font-bold mb-3 leading-tight">
            Discover Your Dream Home
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">
            Explore our exclusive collection of premium properties and find the
            perfect place to call home.
          </p>
          <div className="mt-4 flex space-x-1.5">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
