import type { ReactNode } from "react";
import { Socket } from "socket.io-client";
export interface User {
  id: string;
  username: string;
  avatar?: string;
  email? :string;
  password?:string;
    rememberMe?: boolean;
}


export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  chatId: string;
  createdAt: string;
  isCurrentUser?: boolean; // Client-side only
  username?: string; // Client-side only
  avatar?: string; // Client-side only
  time?: string; // Client-side only
}


export interface PostData {
  Title: string; 
  price: number;
  img: string[];
  address: string;
  bedroom: number;
  bathroom: number;
  city: string;
  latitude: string;
  longitude: string;
  type: "rent" | "buy";
  property: "apartment" | "house" | "villa" | "condo" | "townhouse" | "";
  userId: string;
}
interface PostFormData {
  title: string;
  price: string;
  address: string;
  bedroom: string;
  bathroom: string;
  city: string;
  type: string;
  propertyType: string;
  utilities: string;
  petAllowed: string;
  income: string;
  size: string;
  schools: string;
  busDistance: string;
  restaurants: string;
  latitude?: string;
  longitude?: string;
}
// Change the images state type to include both URL and file if needed
export interface ImageData {
  url: string;
  file?: File; // if you want to keep the file reference
}


export interface PostDetail {
  des: string;
  utilities: "included" | "not-included" | "some-included" | "";
  pet: "allowed" | "not-allowed" | "case-by-case" | "";
  income: "Required" | "Not Required";
  size: number;
  school: number;
  bus: number;
  restaurant: number;
}

export interface FormInputs {
  title: string;
  price: string;
  address: string;
  bedroom: string;
  bathroom: string;
  city: string;
  latitude?: string;
  longitude?: string;
  type: "rent" | "buy";
  propertyType: "apartment" | "house" | "villa" | "condo" | "townhouse" | "";
  utilities: "included" | "not-included" | "some-included" | "";
  petAllowed: "allowed" | "not-allowed" | "case-by-case" | "";
  income: "Required" | "Not Required";
  size: string;
  schools?: string;
  busDistance?: string;
  restaurants?: string;
  images?: FileList;
}


export interface SendMessageProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSendMessage: (message: string, chatId?: string) => void;
  onChatSelect: (chat: Chat) => void;
  onCloseChat: () => void;
  currentUserId: string;
}

export interface Chat {
  id: string;
  userIds: string[];
  users: User[];
  messages: Message[];
  seenBy: string[];
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  username?: string;
  avatar?: string;
  otherUser?: User;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

 interface Post {
  id: string;
  title?: string;
  [key: string]: any;
}

export interface ProfileLoaderData {
  user: UserData;
  userPosts: Post[];
  savedPosts: Post[];
  chats: Chat[];
}

export type Users = {
  id: string;
  username: string;
  email: string;
  avatar:  any;
} | null; 

export type AuthResponseSuccess = {
  message?: string; 
  token: string;    
  user: {          
    id: string;
    username: string;
    email: string;
    avatar: string | null;

  };
};


export type AuthContextType = {
  currentUser: Users;
  updateUser: (data: AuthResponseSuccess | Users | null) => void;
  Logout: () => void;
  authToken: string | null; 
};

export type AuthContextProviderProps = {
  children: ReactNode;
};
export interface OnlineUser {
  userId: string;
  socketId: string;
  username?: string;
  avatar?: string;
}

export interface SocketContextValue {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
  isConnected: boolean;
  sendMessage: (data: { receiverId: string; text: string }) => void;
}