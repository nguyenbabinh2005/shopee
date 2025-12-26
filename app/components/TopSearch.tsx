'use client';

import {ChevronLeft, ChevronRight, Star} from 'lucide-react';
import React from "react";

interface TopSearchProps {
    products: any[];
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function TopSearch({ products, currentIndex, onPrev, onNext }: TopSearchProps) {
    return (
        <div className="bg-white rounded-lg p-6 mb-6 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-orange-500 font-bold uppercase">Tìm kiếm hàng đầu</h2>
                <button className="text-orange-500 hover:text-orange-600 text-sm">Xem tất cả →</button>
            </div>

            {currentIndex > 0 && (
                <button
                    onClick={onPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
            )}

            {currentIndex < products.length - 6 && (
                <button
                    onClick={onNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
            )}

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / 6)}%)` }}
                >
                    {products.map((item: any, idx: number) => (
                        <div key={item.rank || idx} className="min-w-[16.666%] px-2">
                            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group">
                                <div className="h-32 relative bg-gray-200">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    )}
                                    {item.discount && (
                                        <span className="absolute top-0 right-0 bg-yellow-400 text-xs px-2 py-1 font-bold">
                                                    {item.discount}%
                                                </span>
                                    )}
                                </div>
                                <div className="p-2 bg-white">
                                    <div className="text-sm text-center truncate group-hover:text-orange-500">
                                        {item.keyword}
                                    </div>
                                    {/* Info */}
                                    <div className="p-3">
                                        <div className="text-sm h-10 overflow-hidden mb-2">{item.name}</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-orange-500 font-bold">{item.finalPrice.toLocaleString("vi-VN")}₫
</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span>{item.rating || 4.5}</span>
                                            </div>
                                            <span>Đã bán {item.totalPurchaseCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}