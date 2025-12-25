// src/components/common/Header/Header.jsx
import React, { useState } from "react"; // THÊM useState
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // THÊM STATE CHO Ô TÌM KIẾM
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // HÀM XỬ LÝ TÌM KIẾM
  const handleSearch = (e) => {
    e.preventDefault(); // ngăn reload trang
    if (searchKeyword.trim()) {
      // Chuyển sang trang productlist với query ?keyword=...
      navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchKeyword(""); // xóa ô tìm kiếm sau khi tìm (tùy chọn)
    }
  };

  return (
    <header className="fixed-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/home")}>
          <h1>MyShop</h1>
        </div>

        {/* Thanh tìm kiếm – CÓ XỬ LÝ TÌM KIẾM */}
        <div className="search-bar">
          <form onSubmit={handleSearch} style={{ width: "100%", display: "flex" }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M21.7 20.3l-5.5-5.5c1.2-1.7 1.9-3.8 1.9-6.1 0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10c2.3 0 4.4-0.8 6.1-1.9l5.5 5.5c0.4 0.4 1 0.4 1.4 0s0.4-1 0-1.4zM4 8.1c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Giỏ hàng + User (góc phải) */}
        <div className="header-actions">
          {/* Giỏ hàng */}
          <div className="action-item" onClick={() => navigate("/cart")}>
            <div className="icon-cart">
              <span className="cart-count">0</span>
            </div>
            <span>Giỏ hàng</span>
          </div>

          {/* User */}
          <div className="action-item user-dropdown">
            <div className="icon-user"></div>
            <span>{user ? `Hi, ${user.username}` : "Tài khoản"}</span>

            <div className="dropdown-menu">
              {user ? (
                <>
                  <button onClick={() => navigate("/profile")}>Trang cá nhân</button>
                  <button onClick={handleLogout} className="logout-btn">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <button onClick={() => navigate("/login")}>Đăng nhập</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;