// src/components/category/CategoryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Chuyển sang trang danh sách sản phẩm theo category
    navigate(`/products?category=${category.id}`);
    // Hoặc nếu bạn dùng slug: navigate(`/category/${category.slug}`);
  };

  return (
    <button className="my-category-btn" onClick={handleClick}>
      <div className="my-cat-img">
        <img src={category.image} alt={category.name} />
      </div>
      <p className="my-cat-name">{category.name}</p>
    </button>
  );
};

export default CategoryCard;