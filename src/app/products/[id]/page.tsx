"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetailById } from "@/services/productDetailApi";
import { ProductDetailResponse, VariantInfo } from "@/types/productDetail";

import ProductDetailHeader from "@/components/layout/ProductDetailHeader";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import VariantSelector from "@/components/product/VariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import ReviewList from "@/components/product/ReviewList";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import AddToCartBar from "@/components/product/AddToCartBar";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantInfo | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductDetailById(productId).then(setProduct);
  }, [productId]);

  if (!product) {
    return <div className="p-6 text-center">Đang tải sản phẩm...</div>;
  }

  const finalPrice =
    selectedVariant?.priceOverride ?? product.price;

  return (
    <>
      <ProductDetailHeader />
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb items={[
          { label: 'Sản phẩm', href: '/' },
          { label: product.name }
        ]} />
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

            {/* Add to cart / Buy now */}
            <AddToCartBar
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
            />
          </div>
        </div>

        {/* Đánh giá */}
        <ReviewList
          reviews={product.reviews}
          total={product.totalReviews}
        />
      </div>
    </>
  );
}
