import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export const LayoutPage = () => {
  return (
    <>
      <div className="bg-green-900">
        <NavBar />
      </div>
      <div className="mx-auto">
        <Outlet /> 
      </div>
    </>
  );
};


export const RequireAuth = () => {
  const { currentUser } = useContext(AuthContext);
   console.log('RequireAuth - currentUser:', currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};


