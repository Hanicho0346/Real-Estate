import {
  Plus,
  Edit3,
  Mail,
  User,
  MessageCircle,
  Send,
  Settings,
} from "lucide-react";
import Card from "./Card";
import { listData } from "../../lib/dummydata";
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { ProfilePictureUploader } from "../../components/Uploader";
import apiRequest from "../../lib/apiRequest.js";
import { jwtDecode } from "jwt-decode";

interface FormData {
  username: string;
  email: string;
}
const ProfilePage = () => {
  const navigate = useNavigate();
  const [err, seterrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, updateUser, Logout } = useContext(AuthContext);
  const [formData, setFormData] = useState<FormData>({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });

  const contextId = currentUser?.id;
  console.log("userid (from context):", contextId);

  const token = localStorage.getItem("token");

  let decodedUserId: string | undefined;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      decodedUserId = decoded.id;
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }
  console.log("token id", decodedUserId);
  useEffect(() => {
    if (decodedUserId && contextId && decodedUserId !== contextId) {
      console.error("ID mismatch detected - logging out for security");
      Logout();
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      if (!decodedUserId) return;
      setIsLoading(true);
      try {
        const res = await apiRequest.get(`/user/${contextId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        updateUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [decodedUserId]);

  const handleLogout = async () => {
    seterrors("");
    setIsLoading(true);
    try {
      await apiRequest.post("/auth/logout");
      Logout();
      navigate("/");
    } catch (error) {
      console.log(error);
      seterrors("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    navigate("/profile/update");
  };

  if (!currentUser) {
    return <div>Loading user data...</div>;
  }
  // const handleProfilePictureUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append("avatar", file);

  //   try {
  //     const res = await axios.post(
  //       `http://localhost:8800/api/users/${currentUser?.id}/avatar`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer `,
  //         },
  //       }
  //     );
  //     updateUser(res.data);
  //   } catch (error) {
  //     console.error("Error uploading avatar:", error);
  //   }
  // };
  return (
    currentUser && (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profile Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your information and listings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      User Information
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                      Update Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center cursor-pointer justify-center gap-1 p-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <LuLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <ProfilePictureUploader />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {formData.username}
                      </h3>
                      <p className="text-gray-600">Premium Member</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 font-medium">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Username
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-800 font-medium">
                          {formData.username}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-800 font-medium">
                          {formData.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Settings className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        My Listings
                      </h3>
                      <p className="text-gray-600">
                        {listData.length} active properties
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center gap-6">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Plus className="w-5 h-5" />
                      New Listing
                    </button>
                    <div>
                      <Link to={"/profile/addpost"}>
                        <button className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                          <Plus className="w-5 h-5" /> Add Post
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {listData.map((item) => (
                    <div
                      key={item.id}
                      className="transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <Card item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-[800px] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Messages
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    3 unread conversations
                  </p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0">
                      <div className="rounded-full w-10 h-10 overflow-hidden border-2 border-blue-100 shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-md">
                        <p className="text-gray-800 text-sm">
                          Hey, how are you doing? I'm interested in your
                          apartment listing!
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 ml-2">
                        10:30 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start justify-end">
                    <div className="flex-1 max-w-xs">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-2xl rounded-tr-md ml-auto">
                        <p className="text-white text-sm">
                          I'm good, thanks for asking! Yes, the apartment is
                          still available. Would you like to schedule a viewing?
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 mr-2 text-right">
                        10:32 AM
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="rounded-full w-10 h-10 overflow-hidden border-2 border-green-100 shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400"
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0">
                      <div className="rounded-full w-10 h-10 overflow-hidden border-2 border-blue-100 shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-md">
                        <p className="text-gray-800 text-sm">
                          That would be perfect! When are you available?
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 ml-2">
                        10:35 AM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                    />
                    <button className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfilePage;
