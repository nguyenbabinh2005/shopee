// src/app/(app)/home/TopSearch.tsx (hoặc đường dẫn tương ứng)
'use client';

import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import React, { useState, useRef } from "react";
import Link from "next/link";

import ProductCard from '@/components/card/ProductCard';
import { Product } from '@/types/product';

interface TopSearchProps {
    products: Product[];
}

export default function TopSearch({ products }: TopSearchProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemsPerView = 5;
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
                                    .map((product) => (
                                        <div
                                            key={product.productId}
                                            style={{
                                                width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 8 / itemsPerView}px)`
                                            }}
                                        >
                                            <ProductCard
                                                product={product}
                                                variant="carousel"
                                                showChoiceBadge={true}
                                                showStockStatus={true}
                                            />
                                        </div>
                                    ))}
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