// src/guards/ProtectedRouteUser.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRouteUser = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRouteUser;