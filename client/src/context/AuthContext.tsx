import { useEffect, useState, createContext, type ReactNode } from "react";
type User = {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
} | null; 

type AuthResponseSuccess = {
  message?: string; 
  token: string;    
  user: {          
    id: string;
    username: string;
    email: string;
    avatar: string | null;

  };
};


type AuthContextType = {
  currentUser: User;
  updateUser: (data: AuthResponseSuccess | User | null) => void;
  Logout: () => void;
  authToken: string | null; 
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  updateUser: () => {},
  Logout: () => {},
  authToken: null,
});


type AuthContextProviderProps = {
  children: ReactNode;
};


export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
 
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) {
       
        const parsedUser: User = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      }
      if (storedToken) {
       
        setAuthToken(storedToken);
      }
    } catch (error) {
      
      console.error("Failed to parse user or token from localStorage:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setCurrentUser(null);
      setAuthToken(null);
    }
  }, []);


  useEffect(() => {
  
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);


  const updateUser = (data: AuthResponseSuccess | User | null) => {
  if (data === null) {
    setCurrentUser(null);
    localStorage.removeItem("user");
  } else if ("token" in data && "user" in data) {
    setCurrentUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  } else {
    setCurrentUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  }
};

  const Logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, Logout ,authToken}}>
      {children}
    </AuthContext.Provider>
  );
};
