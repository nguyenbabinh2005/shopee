'use client';

import { ChevronLeft, ChevronRight, Star, TrendingUp, Flame } from 'lucide-react';
import React, { useState, useRef } from "react";
import Link from "next/link";

import { Product } from '@/types/product';

interface TopSearchProps {
    products: Product[];
}

const calculateDiscount = (originalPrice: number, finalPrice: number): number => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
};

const getStockStatus = (stock?: number) => {
    if (!stock) return null;
    if (stock <= 10) return { text: `CHỈ CÒN ${stock}`, color: 'bg-red-500' };
    if (stock <= 50) return { text: 'ĐANG BÁN CHẠY', color: 'bg-orange-500' };
    return null;
};

export default function TopSearch({ products }: TopSearchProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemsPerView = 5; // ✅ Hiển thị 5 sản phẩm
    const totalPages = Math.ceil(products.length / itemsPerView);

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    const canScrollLeft = currentPage > 0;
    const canScrollRight = currentPage < totalPages - 1;

    if (products.length === 0) return null;

    return (
        <div className="bg-white rounded-sm mb-4">
            {/* Header */}
            <div className="border-b-4 border-orange-500">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-orange-500 text-lg font-semibold uppercase flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Sản Phẩm Bán Chạy
                        </h2>
                    </div>
                    <Link
                        href="/flash-sale"
                        className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
                    >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Products Carousel */}
            <div
                className="relative px-4 py-6"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={handlePrev}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-sm flex items-center justify-center hover:bg-gray-50 transition-all ${
                            isHovering ? 'opacity-100' : 'opacity-0'
                        }`}
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={handleNext}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-sm flex items-center justify-center hover:bg-gray-50 transition-all ${
                            isHovering ? 'opacity-100' : 'opacity-0'
                        }`}
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {/* Products Container */}
                <div className="overflow-hidden mx-10">
                    <div
                        ref={scrollContainerRef}
                        className="flex transition-transform duration-300 ease-out"
                        style={{
                            transform: `translateX(-${currentPage * 100}%)`,
                        }}
                    >
                        {/* Chia thành từng page */}
                        {Array.from({ length: totalPages }).map((_, pageIndex) => (
                            <div
                                key={pageIndex}
                                className="flex-shrink-0 flex gap-2"
                                style={{
                                    width: '100%',
                                    minWidth: '100%'
                                }}
                            >
                                {products
                                    .slice(pageIndex * itemsPerView, (pageIndex + 1) * itemsPerView)
                                    .map((product) => {
                                        const discount = calculateDiscount(product.originalPrice, product.finalPrice);
                                        const stockStatus = getStockStatus(product.stock);

                                        return (
                                            <Link
                                                key={product.productId}
                                                href={`/page/${product.productId}`}
                                                className="flex-shrink-0 bg-white border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-200 group"
                                                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 8 / itemsPerView}px)` }}
                                            >
                                                {/* Image Container */}
                                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />

                                                    {/* Discount Badge */}
                                                    {discount > 0 && (
                                                        <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 px-1.5 py-0.5 text-xs font-bold">
                                                            -{discount}%
                                                        </div>
                                                    )}

                                                    {/* Choice Badge */}
                                                    <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-0.5 text-xs font-semibold">
                                                        Choice
                                                    </div>

                                                    {/* Stock Status Badge */}
                                                    {stockStatus && (
                                                        <div className={`absolute bottom-2 left-2 ${stockStatus.color} text-white px-2 py-1 text-xs font-bold rounded flex items-center gap-1`}>
                                                            <Flame className="w-3 h-3" />
                                                            {stockStatus.text}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-2">
                                                    <h3 className="text-xs text-gray-800 line-clamp-2 h-8 mb-1">
                                                        {product.name}
                                                    </h3>

                                                    {/* Price */}
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {/* Giá sau sale */}
                                                        <span className="text-orange-500 font-medium text-sm">₫{product.finalPrice.toLocaleString('vi-VN')}
    </span>

                                                        {/* Giá gốc */}
                                                        {product.originalPrice > product.finalPrice && (
                                                            <span className="text-gray-400 line-through text-xs">₫{product.originalPrice.toLocaleString('vi-VN')}
        </span>
                                                        )}
                                                    </div>


                                                    {/* Rating and Sold */}
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            <span>{product.rating}</span>
                                                        </div>
                                                        {product.soldCount && (
                                                            <span>Đã bán {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`h-2 rounded-full transition-all ${
                                currentPage === index
                                    ? 'w-6 bg-orange-500'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}