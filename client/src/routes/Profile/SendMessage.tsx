import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { MessageCircle, Send, ChevronLeft } from "lucide-react";
import type {
  Chat,
  Message,
  ProfileLoaderData,
  SendMessageProps,
} from "../../types/type";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import { profilepageLoader } from "../../lib/loader";
import { useLoaderData } from "react-router-dom";

const MessageBubble = React.memo(({ message }: { message: Message }) => (
  <div
    className={`flex gap-3 items-start ${
      message.isCurrentUser ? "justify-end" : ""
    }`}
  >
    {!message.isCurrentUser && (
      <Avatar
        src={message.avatar}
        alt={message.username}
        borderColor="border-blue-100"
      />
    )}

    <div
      className={`flex-1 max-w-xs ${message.isCurrentUser ? "text-right" : ""}`}
    >
      {!message.isCurrentUser && (
        <p className="text-xs text-gray-500 mb-1">{message.username}</p>
      )}
      <div
        className={`px-4 py-3 rounded-2xl ${
          message.isCurrentUser
            ? "bg-gradient-to-r from-green-600 to-green-700 text-white rounded-tr-md ml-auto"
            : "bg-gray-100 rounded-tl-md"
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      <p
        className={`text-xs text-gray-500 mt-1 ${
          message.isCurrentUser ? "mr-2" : "ml-2"
        }`}
      >
        {message.time}
      </p>
    </div>

    {message.isCurrentUser && (
      <Avatar
        src={message.avatar}
        alt={message.username}
        borderColor="border-green-100"
      />
    )}
  </div>
));

const Avatar = React.memo(
  ({
    src,
    alt,
    borderColor,
  }: {
    src: string;
    alt: string;
    borderColor: string;
  }) => (
    <div className="flex-shrink-0">
      <div
        className={`rounded-full w-10 h-10 overflow-hidden border-2 ${borderColor} shadow-lg`}
      >
        <img
          src={src || "https://via.placeholder.com/40"}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  )
);

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SendMessage: React.FC<SendMessageProps> = ({
  chats,
  activeChat,
  onSendMessage,
  onChatSelect,
  onCloseChat,
  currentUserId,
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useContext(AuthContext);
  // const { chats } = useLoaderData() as ProfileLoaderData;
  const { socket } = useContext(SocketContext);

  const otherUser = useMemo(() => {
    if (!activeChat) return null;
    return (
      activeChat.users.find((user) => user.id !== currentUserId) ||
      activeChat.users[0]
    );
  }, [activeChat, currentUserId]);

  const formatMessage = useCallback(
    (message: Message, isCurrentUser: boolean): Message => ({
      ...message,
      id: message.id || Date.now().toString(),
      isCurrentUser,
      username: isCurrentUser ? "You" : otherUser?.username || "",
      avatar: isCurrentUser
        ? currentUser?.avatar || ""
        : otherUser?.avatar || "",
      time: formatTime(message.createdAt),
      chatId: activeChat?.id || "",
    }),
    [
      activeChat?.id,
      currentUser?.avatar,
      otherUser?.avatar,
      otherUser?.username,
    ]
  );

  const sendMessage = useCallback(
    ({ receiverId, text }: { receiverId: string; text: string }) => {
      if (!socket || !currentUser || !activeChat) return;

      socket.emit("sendMessage", {
        senderId: currentUser.id,
        receiverId,
        text,
        chatId: activeChat.id,
      });
    },
    [socket, currentUser, activeChat]
  );
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  useEffect(() => {
    if (!socket || !activeChat || !otherUser) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chatId === activeChat.id) {
        const formattedMessage = formatMessage(
          newMessage,
          newMessage.senderId === currentUserId
        );
        onSendMessage(formattedMessage, activeChat.id);
      }
    };

    socket.on("getMessage", handleNewMessage);

    return () => {
      socket.off("getMessage", handleNewMessage);
    };
  }, [
    socket,
    activeChat,
    otherUser,
    onSendMessage,
    formatMessage,
    currentUserId,
  ]);

  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim() || !activeChat || !currentUser || !otherUser)
      return;

    const tempMessage = formatMessage(
      {
        id: Date.now().toString(),
        text: currentMessage,
        userId: currentUser.id,
        chatId: activeChat.id,
        createdAt: new Date().toISOString(),
      },
      true
    );

    onSendMessage(tempMessage, activeChat.id);
    sendMessage({
      receiverId: otherUser.id,
      text: currentMessage,
    });

    setCurrentMessage("");
  }, [
    currentMessage,
    activeChat,
    currentUser,
    otherUser,
    onSendMessage,
    sendMessage,
    formatMessage,
  ]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  if (!activeChat) {
    return (
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-[800px] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex -space-x-1 overflow-hidden">
                <img
                  src={otherUser?.avatar || "https://via.placeholder.com/40"}
                  alt=""
                  className="inline-block size-6 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            </div>
            <p className="text-sm text-gray-600">
              {chats.length} {chats.length === 1 ? "chat" : "chats"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-12 h-12 mb-4" />
                <p>No chats yet</p>
              </div>
            ) : (
              chats.map((chat) => {
                const otherUser =
                  chat.users.find((user) => user.id !== currentUserId) ||
                  chat.users[0];
                const lastMessage = chat.messages[0]?.text || "No messages yet";
                const lastMessageTime = chat.messages[0]?.createdAt
                  ? formatTime(chat.messages[0].createdAt)
                  : "";

                return (
                  <div
                    key={chat.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !chat.seenBy.includes(currentUserId) ? "bg-blue-50" : ""
                    }`}
                    onClick={() => onChatSelect(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={otherUser?.avatar}
                        alt={otherUser?.username}
                        borderColor="border-blue-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {otherUser?.username}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {lastMessageTime}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-[800px] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50 flex items-center gap-4">
          <button
            onClick={onCloseChat}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to chats"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <Avatar
              src={otherUser.avatar}
              alt={otherUser.username}
              borderColor="border-blue-100"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {otherUser.username}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <>
              {activeChat.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={formatMessage(msg, msg.userId === currentUserId)}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
              aria-label="Type your message"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SendMessage);
