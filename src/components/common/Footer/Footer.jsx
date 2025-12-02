// src/components/common/Footer/Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <h3>MyShop</h3>
          <p>© 2025 MyShop. Tất cả quyền được bảo lưu.</p>
        </div>

        <div className="footer-right">
          <a href="/about">Giới thiệu</a>
          <a href="/contact">Liên hệ</a>
          <a href="/privacy">Chính sách bảo mật</a>
          <a href="/terms">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;