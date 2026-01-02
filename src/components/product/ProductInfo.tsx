"use client";

import { ProductDetailResponse } from "@/types/productDetail";
import { Star, TrendingUp, Package, Shield } from "lucide-react";

interface ProductInfoProps {
  product: ProductDetailResponse;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  // ✅ RATING TỪ BACKEND
  const rating = product.rating ?? 0;

  // ✅ ĐÃ BÁN TỪ BACKEND
  const soldCount = product.totalPurchaseCount ?? 0;

  const hasDiscount = product.discountAmount > 0;

  return (
      <div className="space-y-6">
        {/* Product name */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          </h1>
          {product.status === "active" && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                <Package className="w-4 h-4" />
                Còn hàng
              </div>
          )}
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center gap-6 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                if (i + 1 <= Math.floor(rating)) {
                  return (
                      <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                  );
                }

                if (i < rating) {
                  return (
                      <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400/50 text-yellow-400"
                      />
                  );
                }

                return (
                    <Star
                        key={i}
                        className="w-5 h-5 fill-gray-200 text-gray-200"
                    />
                );
              })}
            </div>

            <span className="text-lg font-semibold text-gray-900">
            {rating.toFixed(1)}
          </span>
            <span className="text-gray-500">
            ({product.totalReviews.toLocaleString()} đánh giá)
          </span>
          </div>

          <div className="h-5 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-gray-600">Đã bán</span>
            <span className="text-lg font-semibold text-gray-900">
            {soldCount.toLocaleString()}
          </span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-end gap-4">
          <span className="text-4xl font-bold text-orange-600">
            ₫{product.finalPrice.toLocaleString("vi-VN")}
          </span>

            {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
              ₫{product.price.toLocaleString("vi-VN")}
            </span>
            )}
          </div>

          {hasDiscount && (
              <div className="mt-2 text-sm text-green-700 font-medium">
                Giảm ₫{product.discountAmount.toLocaleString("vi-VN")}
              </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-orange-200/50">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Giao hàng toàn quốc</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
          <span className="text-sm text-gray-600">Trạng thái:</span>
          <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
              }`}
          >
          <span
              className={`w-2 h-2 rounded-full ${
                  product.status === "active"
                      ? "bg-green-500"
                      : "bg-red-500"
              }`}
          />
            {product.status === "active" ? "Đang bán" : "Ngừng bán"}
        </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Mô tả sản phẩm
          </h3>
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>
        </div>
      </div>
  );
}
