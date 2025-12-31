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

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantInfo | null>(null);
  const [quantity, setQuantity] = useState(1);

    useEffect(() => {
     getProductDetailById(productId).then(setProduct);
    }, [productId]);


  if (!product) return <div>Đang tải...</div>;

  const finalPrice =
    selectedVariant?.priceOverride ?? product.price;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
        <ProductGallery images={product.images} />

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <ProductInfo product={product} price={finalPrice} />

          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />

          <QuantitySelector
            quantity={quantity}
            max={selectedVariant?.quantity ?? 0}
            onChange={setQuantity}
          />

          {/* Add to cart / Buy now */}
        </div>
      </div>

      <ReviewList reviews={product.reviews} total={product.totalReviews} />
    </div>
  );
}
