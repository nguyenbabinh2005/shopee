import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onViewDetail, onAddToCart }) => {
  return (
    <div className="product-card" onClick={() => onViewDetail(product)}>
      {/* Badge giảm giá (nếu có) */}
      {product.discount && (
        <div className="discount-badge">-{product.discount}%</div>
      )}

      {/* Hình ảnh */}
      <div className="product-image">
        <img src={product.imageUrl || "/images/placeholder.jpg"} alt={product.name} />
        <div className="quick-view">Nhấn để xem chi tiết</div>
      </div>

      {/* Thông tin */}
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="price-wrapper">
          {product.originalPrice && (
            <span className="original-price">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="current-price">
            ${product.price.toLocaleString()}
          </span>
        </div>

        {/* Nút thêm giỏ hàng (hiện khi hover) */}
        <button
          className="btn-add-cart"
          onClick={(e) => {
            e.stopPropagation(); // quan trọng: không trigger onViewDetail khi bấm nút
            onAddToCart(product);
          }}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;