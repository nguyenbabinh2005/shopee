// src/router/UserRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRouteUser from "../guards/ProtectedRouteUser";
import LoginPage from "../pages/user/Auth/LoginPage";
import Home from "../pages/user/Home/Home";
// các page khác...
import ProductList from "../pages/user/ProductList/ProductList";
const UserRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRouteUser>
            <Home />
          </ProtectedRouteUser>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/products" element={<ProductList />} />
      {/* các route khác */}
    </Routes>
  );
};

export default UserRouter;