import { Plus, Edit3, Mail, User, Settings } from "lucide-react";
import { LuLogOut } from "react-icons/lu";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import Card from "./Card";
import { ProfilePictureUploader } from "../../components/Uploader";
import apiRequest from "../../lib/apiRequest";
import SendMessage from "./SendMessage";
import type { Chat, Message, ProfileLoaderData } from "../../types/type";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"myListings" | "saved">(
    "myListings"
  );
  const { currentUser, updateUser, Logout } = useContext(AuthContext);
  const [chat, setChat] = useState(null);
  const { socket } = useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const { user, userPosts, savedPosts, chats } =
    useLoaderData() as ProfileLoaderData;

  const formData = useMemo(
    () => ({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || "",
    }),
    [currentUser]
  );

  const currentPosts = useMemo(
    () => (activeTab === "myListings" ? userPosts : savedPosts),
    [activeTab, userPosts, savedPosts]
  );

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await apiRequest.post("/auth/logout");
      Logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = useCallback(
    async (message: Message, chatId: string) => {
      try {
        if (!socket || !currentUser || !activeChat) return;

        // Find the other user in the chat
        const otherUser = activeChat.users.find(
          (user) => user.id !== currentUser.id
        );
        if (!otherUser) return;

        // Optimistically update UI
        const tempMessage = {
          ...message,
          id: Date.now().toString(), // temporary ID
          chatId,
          senderId: currentUser.id,
          createdAt: new Date().toISOString(),
        };

        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, tempMessage],
              }
            : null
        );

        // Send to server
        const res = await apiRequest.post("/message/" + chatId, {
          text: message.text,
        });

        // Replace temp message with server response
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.map((m) =>
                  m.id === tempMessage.id ? res.data : m
                ),
              }
            : null
        );

        // Emit socket event
        socket.emit("sendMessage", {
          receiverId: otherUser.id,
          text: message.text,
          chatId: activeChat.id,
          messageId: res.data.id, // include the final message ID
        });

        return true;
      } catch (error) {
        console.error("Failed to send message:", error);
        setError("Failed to send message. Please try again.");

        // Remove the optimistic update if failed
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.filter((m) => m.id !== tempMessage.id),
              }
            : null
        );

        return false;
      }
    },
    [socket, currentUser, activeChat]
  );

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewMessage = (newMessage: Message) => {
      // Ignore our own messages (they're handled by sendMessage)
      if (newMessage.senderId === currentUser.id) return;

      // Update the active chat if it's the current one
      if (activeChat && activeChat.id === newMessage.chatId) {
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
              }
            : null
        );
      }

      // Otherwise, you might want to update the chats list
      // to show a notification badge or similar
    };

    socket.on("getMessage", handleNewMessage);

    return () => {
      socket.off("getMessage", handleNewMessage);
    };
  }, [socket, currentUser, activeChat]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const memberSinceDate = useMemo(
    () =>
      new Date(user?.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [user?.createdAt]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Profile Dashboard
          </h1>
          <p className="text-gray-600">Manage your information and listings</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* User Information Section */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
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
                    onClick={() => navigate("/profile/update")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    aria-label="Update profile"
                  >
                    <Edit3 className="w-4 h-4" />
                    Update Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    aria-label={isLoading ? "Logging out" : "Logout"}
                  >
                    <LuLogOut className="w-4 h-4" />
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <ProfilePictureUploader />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {formData.username}
                    </h3>
                    <p className="text-gray-600">
                      Member since {memberSinceDate}
                    </p>
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
                        {user.username}
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
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Listings Section */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      My Listings
                    </h3>
                    <p className="text-gray-600">Manage your properties</p>
                  </div>
                </div>

                <Link to="/profile/addpost">
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    aria-label="Add new post"
                  >
                    <Plus className="w-5 h-5" /> Add Post
                  </button>
                </Link>
              </div>

              <div>
                <nav className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "myListings"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("myListings")}
                    aria-current={
                      activeTab === "myListings" ? "page" : undefined
                    }
                  >
                    My Listings ({userPosts?.length || 0})
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "saved"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("saved")}
                    aria-current={activeTab === "saved" ? "page" : undefined}
                  >
                    Saved Listings ({savedPosts?.length || 0})
                  </button>
                </nav>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {currentPosts?.length > 0 ? (
                    currentPosts.map((item) => (
                      <Card
                        key={item.id}
                        item={item}
                        className="transform hover:scale-[1.02] transition-all duration-300"
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10">
                      <p className="text-gray-500 mb-4">
                        {activeTab === "myListings"
                          ? "You haven't created any listings yet."
                          : "You haven't saved any listings yet."}
                      </p>
                      <Link
                        to={
                          activeTab === "myListings" ? "/profile/addpost" : "/"
                        }
                        className="inline-block"
                      >
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                          {activeTab === "myListings"
                            ? "Create Your First Listing"
                            : "Browse Listings"}
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Messages Section */}
          <div className="space-y-8">
            <SendMessage
              chats={chats}
              activeChat={activeChat}
              onSendMessage={handleSendMessage}
              onChatSelect={setActiveChat}
              onCloseChat={() => setActiveChat(null)}
              currentUserId={currentUser.id}
            />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex justify-between items-start">
              <p>{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
                aria-label="Dismiss error message"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
