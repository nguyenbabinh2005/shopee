// src/components/common/Navbar/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="sticky-navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          <li><NavLink to="/home" end className="nav-link">Trang chủ</NavLink></li>
          <li><NavLink to="/products" className="nav-link">Sản phẩm</NavLink></li>
          <li><NavLink to="/sale" className="nav-link">Khuyến mãi</NavLink></li>
          <li><NavLink to="/blog" className="nav-link">Tin tức</NavLink></li>
          <li><NavLink to="/contact" className="nav-link">Liên hệ</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;