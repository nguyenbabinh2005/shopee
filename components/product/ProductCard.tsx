'use client';

import Image from 'next/image';
import './ProductCard.css';

export interface Product {
  id?: number;
  name?: string;
  imageUrl?: string;
  originalPrice?: number | string;
  finalPrice?: number | string;
  discountAmount?: number | string;
  rating?: number | string;
}

interface Props {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetail,
  onAddToCart,
}: Props) {
  // LẤY DỮ LIỆU AN TOÀN TỪ BACKEND
  const originalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : null;

  const finalPrice = product.finalPrice
    ? Number(product.finalPrice)
    : null;

  const discountAmount = product.discountAmount
    ? Number(product.discountAmount)
    : 0;

  // TÍNH PHẦN TRĂM GIẢM GIÁ
  let discountPercent = 0;
  if (discountAmount > 0 && originalPrice && originalPrice > 0) {
    discountPercent = Math.round((discountAmount / originalPrice) * 100);
  } else if (originalPrice && finalPrice && originalPrice > finalPrice) {
    discountPercent = Math.round(
      ((originalPrice - finalPrice) / originalPrice) * 100
    );
  }

  const hasDiscount = discountPercent > 0;

  // Giá hiển thị
  const displayPrice = finalPrice || originalPrice || 0;

  // RATING
  const rating = product.rating ? Number(product.rating) : 0;

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'full' : 'empty'}`}>
        ★
      </span>
    ));

  return (
    <div
      className="product-card"
      onClick={() => onViewDetail(product)}
    >
      {/* Badge giảm giá */}
      {hasDiscount && (
        <div className="discount-badge">-{discountPercent}%</div>
      )}

      {/* Hình ảnh */}
      <div className="product-image">
        <Image
          src={product.imageUrl || '/images/placeholder.jpg'}
          alt={product.name || 'Sản phẩm'}
          width={300}
          height={300}
          className="object-cover"
        />
        <div className="quick-view">Nhấn để xem chi tiết</div>
      </div>

      {/* Thông tin */}
      <div className="product-info">
        <h3
          className="product-name"
          title={product.name || 'Sản phẩm'}
        >
          {product.name || 'Sản phẩm không tên'}
        </h3>

        {/* Rating */}
        <div className="rating-stars">
          {renderStars()}
          {rating > 0 && (
            <span className="rating-count">({rating})</span>
          )}
        </div>

        {/* Giá */}
        <div className="price-wrapper">
          {hasDiscount && originalPrice && (
            <span className="original-price">
              {originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
          <span className="current-price">
            {displayPrice > 0
              ? displayPrice.toLocaleString('vi-VN')
              : 'Liên hệ'}
            ₫
          </span>
        </div>

        {/* Thêm giỏ hàng */}
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
}
