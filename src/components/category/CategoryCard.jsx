// src/components/category/CategoryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      className="perfect-cat-card"
      onClick={() => navigate(`/products?category=${category.category_id || category.id}`)}
    >
      <div className="perfect-cat-img">
        <img src={category.image || "/images/default-cat.jpg"} alt={category.name} />
      </div>
      <div className="perfect-cat-name">{category.name}</div>
    </div>
  );
};

export default CategoryCard;