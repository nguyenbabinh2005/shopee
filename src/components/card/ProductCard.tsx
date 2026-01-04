// src/components/card/ProductCard.tsx
'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { ProductSearchResponse } from '@/types/product';

interface ProductCardProps {
  product: ProductSearchResponse;
  variant?: 'carousel' | 'grid';
  showChoiceBadge?: boolean;
  showStockStatus?: boolean;
}

const toNumber = (value: number | string | null | undefined): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const calculateDiscount = (originalPrice: number, finalPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
};

export default function ProductCard({
  product,
  variant = 'grid',
  showChoiceBadge = false,
  showStockStatus = false,
}: ProductCardProps) {
  const finalPrice = toNumber(product.finalPrice);
  const originalPrice = toNumber(product.originalPrice);
  const hasDiscount = originalPrice > finalPrice && finalPrice > 0;
  const discountPercent = calculateDiscount(originalPrice, finalPrice);

  const productId = product.productId;
  const rating = product.rating ?? 4.5;
  const soldCount = product.soldCount ?? product.totalPurchaseCount ?? 0;
  const stock = product.stock ?? 0;

  const imageSrc = product.imageUrl || '/placeholder.png';

  /* ================= CAROUSEL ================= */
  if (variant === 'carousel') {
    return (
      <Link
        href={`/products/${productId}`}
        className="block bg-white border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-200 group h-full"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            unoptimized
          />

          {discountPercent > 0 && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 px-1.5 py-0.5 text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {showChoiceBadge && (
            <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-0.5 text-xs font-semibold">
              Choice
            </div>
          )}

          {showStockStatus && stock > 0 && stock <= 50 && (
            <div
              className={`absolute bottom-2 left-2 ${stock <= 10 ? 'bg-red-500' : 'bg-orange-500'
                } text-white px-2 py-1 text-xs font-bold rounded`}
            >
              {stock <= 10 ? `CHỈ CÒN ${stock}` : 'ĐANG BÁN CHẠY'}
            </div>
          )}
        </div>

        <div className="p-2">
          <h3 className="text-xs text-gray-800 line-clamp-2 h-8 mb-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-500 font-medium text-sm">
              ₫{finalPrice.toLocaleString('vi-VN')}
            </span>

            {hasDiscount && (
              <span className="text-gray-400 line-through text-xs">
                ₫{originalPrice.toLocaleString('vi-VN')}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>

            {soldCount > 0 && (
              <span>
                Đã bán{' '}
                {soldCount > 1000
                  ? `${(soldCount / 1000).toFixed(1)}k`
                  : soldCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* ================= GRID ================= */
  return (
    <Link
      href={`/products/${productId}`}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full"
    >
      <div className="relative h-40 bg-gray-200">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />

        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            -{discountPercent}%
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="text-sm h-10 overflow-hidden mb-2">
          {product.name}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-sm">
            ₫{finalPrice.toLocaleString('vi-VN')}
          </span>

          {hasDiscount && (
            <span className="text-gray-400 line-through text-xs">
              ₫{originalPrice.toLocaleString('vi-VN')}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
          {soldCount > 0 && <span>Đã bán {soldCount}</span>}
        </div>
      </div>
    </Link>
  );
}
