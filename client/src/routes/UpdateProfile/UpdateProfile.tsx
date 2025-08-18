import { Eye, EyeOff, Lock } from "lucide-react";
import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import type { User } from "../../types/type";

const UpdateProfile = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User>({
    id: currentUser?.id,
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    password: "",
    rememberMe: false,
  });
  const token = localStorage.getItem("token");

  const contextId = currentUser?.id;
  console.log("userid (from context):", contextId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!currentUser?.id) {
      setError("User ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar,
      };
      const res = await apiRequest.put(`/user/${currentUser?.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("token", token);
      updateUser({
        ...res.data,
        id: res.data.id || formData.id,
      });
      navigate("/profile");
    } catch (err: any) {
      console.error("Update error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
      >
        <div className="space-y-5">
          <div className="group">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <FaUser
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
                size={18}
              />
              <input
                id="username"
                name="username"
                type="text"
                onChange={handleInputChange}
                required
                defaultValue={formData.username}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="group">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <FaUser
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
                size={18}
              />
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleInputChange}
                required
                defaultValue={formData.email}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="group">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
                size={18}
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
