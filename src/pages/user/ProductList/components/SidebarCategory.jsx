// src/pages/user/ProductList/components/SidebarCategory.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./SidebarCategory.css";

const SidebarCategory = ({ categories, currentId, onSelect }) => {
  const navigate = useNavigate();

  const renderCat = (cats, level = 0) => {
    return cats.map((cat) => (
      // FIX WARNING KEY PROP: thêm key={cat.category_id} ở div bao ngoài
      <div key={cat.category_id} className="cat-item-wrapper">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(cat.category_id);
          }}
          className={`cat-item ${currentId === cat.category_id ? "active" : ""}`}
          style={{ paddingLeft: level * 24 + 16 + "px" }}
        >
          {cat.name}
          {cat.children && cat.children.length > 0 && (
            <span className="cat-arrow">›</span>
          )}
        </div>
        {cat.children && cat.children.length > 0 && renderCat(cat.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="sidebar-cat">
      <h3 className="sidebar-title">Danh mục</h3>
      <div
        onClick={(e) => {
          e.stopPropagation();
          navigate("/products");
        }}
        className={`cat-item ${currentId == null ? "active" : ""}`}
      >
        Tất cả sản phẩm
      </div>
      <div className="cat-list">{renderCat(categories)}</div>
    </div>
  );
};

export default SidebarCategory;