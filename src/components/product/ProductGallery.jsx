import React from "react";
import ProductCard from "../product/ProductCard"; // điều chỉnh đường dẫn nếu cần
import "./ProductGallery.css";

const ProductGallery = ({ products, onViewDetail, onAddToCart }) => {
  // Nếu không có sản phẩm → hiện thông báo đẹp
  if (!products || products.length === 0) {
    return (
      <div className="empty-gallery">
        <p>Chưa có sản phẩm nào trong danh mục này</p>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetail={onViewDetail}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGallery;