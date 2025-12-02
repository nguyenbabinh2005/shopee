// src/pages/user/Auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra để trống
    if (!username.trim() || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await login(username.trim(), password);

      if (result.success) {
        navigate("/home", { replace: true });
      } else {
        setError(result.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      // Nếu có lỗi mạng, server sập, v.v.
      setError("Không thể kết nối đến server. Vui lòng thử lại!");
    } finally {
      setLoading(false); // ĐẢM BẢO loading tắt dù đúng hay sai
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-header">
        <h1>MyShop</h1>
        <p>Chào mừng quay lại! Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <div className="login-container">
        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="extra-buttons">
            <button
              type="button"
              className="btn-admin"
              onClick={() => navigate("/admin/login")}
            >
              Đăng nhập với tư cách Admin
            </button>

            <p className="register-text">
              Chưa có tài khoản?{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;