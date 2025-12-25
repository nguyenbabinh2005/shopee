// src/components/product/ProductCard/ProductCard.jsx
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onViewDetail, onAddToCart }) => {
  // LẤY DỮ LIỆU AN TOÀN TỪ BACKEND
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const finalPrice = product.finalPrice ? Number(product.finalPrice) : null;
  const discountAmount = product.discountAmount ? Number(product.discountAmount) : 0;

  // TÍNH PHẦN TRĂM GIẢM GIÁ CHÍNH XÁC (DỰA VÀO discountAmount)
  let discountPercent = 0;
  if (discountAmount > 0 && originalPrice > 0) {
    discountPercent = Math.round((discountAmount / originalPrice) * 100);
  } else if (originalPrice && finalPrice && originalPrice > finalPrice) {
    discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }

  const hasDiscount = discountPercent > 0;

  // Giá hiển thị: ưu tiên finalPrice
  const displayPrice = finalPrice || originalPrice || 0;

  // RATING – LẤY TỪ BACKEND (INTEGER TỪ 0-5)
  const rating = product.rating ? Number(product.rating) : 0;

  // Render 5 sao: sao đầy = rating, sao rỗng = 5 - rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "full" : "empty"}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="product-card" onClick={() => onViewDetail(product)}>
      {/* Badge giảm giá */}
      {hasDiscount && (
        <div className="discount-badge">-{discountPercent}%</div>
      )}

      {/* Hình ảnh */}
      <div className="product-image">
        <img 
          src={product.imageUrl || "/images/placeholder.jpg"} 
          alt={product.name || "Sản phẩm"} 
        />
        <div className="quick-view">Nhấn để xem chi tiết</div>
      </div>

      {/* Thông tin */}
      <div className="product-info">
        <h3 className="product-name" title={product.name || "Sản phẩm"}>
          {product.name || "Sản phẩm không tên"}
        </h3>

        {/* PHẦN SAO ĐÁNH GIÁ – HIỆN ĐÚNG SỐ SAO TỪ RATING */}
        <div className="rating-stars">
          {renderStars()}
          {rating > 0 && (
            <span className="rating-count">({rating})</span>
          )}
        </div>

        <div className="price-wrapper">
          {hasDiscount && originalPrice && (
            <span className="original-price">
              {originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
          <span className="current-price">
            {displayPrice > 0 ? displayPrice.toLocaleString('vi-VN') : 'Liên hệ'}₫
          </span>
        </div>

        {/* Nút thêm giỏ hàng */}
        <button
          className="btn-add-cart"
          onClick={(e) => {
            e.stopPropagation();
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