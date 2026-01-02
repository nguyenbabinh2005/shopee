"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetailById } from "@/services/productDetailApi";
import { ProductDetailResponse, VariantInfo } from "@/types/productDetail";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import VariantSelector from "@/components/product/VariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import ReviewList from "@/components/product/ReviewList";
import AddToCartBar from "@/components/product/AddToCartBar";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantInfo | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) return;

    const fetchProduct = async () => {
      const res = await getProductDetailById(productId);
      if (!res) return;

      setProduct(res);
      setSelectedVariant(res.variants?.[0] ?? null);
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div className="p-6 text-center">Đang tải sản phẩm...</div>;
  }

  const finalPrice =
    selectedVariant?.priceOverride ?? product.price;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
        {/* Ảnh sản phẩm */}
        <ProductGallery images={product.images} />

        {/* Thông tin + mua hàng */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <ProductInfo product={product} />


          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={(variant) => {
              setSelectedVariant(variant);
              setQuantity(1); // reset số lượng khi đổi variant
            }}
          />

          <QuantitySelector
            quantity={quantity}
            max={selectedVariant?.quantity ?? 0}
            onChange={setQuantity}
          />

          {/* Thanh thêm giỏ / mua ngay */}
          {selectedVariant && (
            <AddToCartBar
              product={{
                productId: product.productId,
                name: product.name,
              }}
              variant={{
                variantId: selectedVariant.variantId,
                price: finalPrice,
                attributesJson: selectedVariant.attributesJson,
                imageUrl: product.images?.[0]?.imageUrl,
              }}
              quantity={quantity}
            />
          )}
        </div>
      </div>

      {/* Đánh giá */}
      <ReviewList
        reviews={product.reviews}
        total={product.totalReviews}
      />
    </div>
  );
}
