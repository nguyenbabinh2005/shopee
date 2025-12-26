'use client';

import ProductCard, {
  Product,
} from '../ProductCard/ProductCard';
import './ProductGallery.css';

interface Props {
  products: Product[];
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductGallery({
  products,
  onViewDetail,
  onAddToCart,
}: Props) {
  // Không có sản phẩm
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
}
