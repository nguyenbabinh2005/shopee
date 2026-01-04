'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FlashSaleProps {
    products: any[];
    timeLeft: { hours: number; minutes: number; seconds: number };
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function FlashSale({ products, timeLeft, currentIndex, onPrev, onNext }: FlashSaleProps) {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-6 relative shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center gap-2">
                        ⚡ FLASH SALE
                    </h2>
                    <div className="flex gap-1">
                        <span className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-mono min-w-[2.5rem] text-center shadow-md">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-white font-bold">:</span>
                        <span className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-mono min-w-[2.5rem] text-center shadow-md">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-white font-bold">:</span>
                        <span className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-mono min-w-[2.5rem] text-center shadow-md">
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/flashsales')}
                    className="text-white hover:text-yellow-200 font-semibold transition-colors duration-300 flex items-center gap-1 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
                >
                    Xem tất cả →
                </button>
            </div>

            {currentIndex > 0 && (
                <button
                    onClick={onPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-orange-100 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6 text-orange-500" />
                </button>
            )}

            {currentIndex < products.length - 6 && (
                <button
                    onClick={onNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-orange-100 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6 text-orange-500" />
                </button>
            )}

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / 6)}%)` }}
                >
                    {products.map((product, idx) => (
                        <div key={product.productId || idx} className="min-w-[16.666%] px-2">
                            <div className="bg-white border-2 border-white rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                                <div className="h-32 relative bg-gray-100">
                                    {product.primaryImageUrl && (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    )}
                                    {product.discount && (
                                        <span className="absolute top-2 right-2 bg-yellow-400 text-red-600 text-xs px-2 py-1 font-black rounded-full shadow-md">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="text-orange-500 font-black text-lg">
                                        {(product.flashPrice ?? 0).toLocaleString("vi-VN")}₫
                                    </div>
                                    <div className="h-8 overflow-hidden mt-2">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full inline-block shadow-sm">
                                            🔥 Đã bán {product.totalPurchaseCount || 0}
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