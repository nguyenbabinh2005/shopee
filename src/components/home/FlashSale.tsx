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
        <div className="bg-white rounded-lg p-6 mb-6 relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-orange-500">FLASH SALE</h2>
                    <div className="flex gap-1">
                            <span className="bg-black text-white px-2 py-1 rounded text-sm font-mono min-w-[2rem] text-center">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </span>
                            <span className="text-black">:</span>
                            <span className="bg-black text-white px-2 py-1 rounded text-sm font-mono min-w-[2rem] text-center">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </span>
                            <span className="text-black">:</span>
                            <span className="bg-black text-white px-2 py-1 rounded text-sm font-mono min-w-[2rem] text-center">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/flashsales')}
                    className="text-orange-500 hover:text-orange-600"
                >
                    Xem tất cả →
                </button>
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
                    {products.map((product, idx) => (
                        <div key={product.productId || idx} className="min-w-[16.666%] px-2">
                            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                                <div className="h-32 relative bg-gray-200">
                                    {product.primaryImageUrl && (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    )}
                                    {product.discount && (
                                        <span className="absolute top-0 right-0 bg-yellow-400 text-xs px-2 py-1 font-bold">
                                            {product.discount}%
                                        </span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="text-orange-500 font-bold text-lg">
                                        {(product.flashPrice ??  0).toLocaleString("vi-VN")}₫
                                    </div>
                                    <div className="h-8 overflow-hidden">
                                        <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-sm inline-block">
                                            Đã bán {product.totalPurchaseCount || 0}
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