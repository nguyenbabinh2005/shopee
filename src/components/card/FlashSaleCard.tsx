'use client';

import { Clock } from 'lucide-react';

interface FlashSaleCardProps {
    flashSale: {
        flashSaleId: number;
        flashPrice: number;
        quantity: number;
        sold: number;
        startTime: string;
        endTime: string;
        status: string;

        // flat fields từ backend
        productId: number;
        productName: string;
        imageUrl?: string;
        originalPrice: number;
    };
    isActive: boolean;
}

export default function FlashSaleCard({ flashSale, isActive }: FlashSaleCardProps) {
    const remainingQuantity = flashSale.quantity - flashSale.sold;
    const soldPercentage =
        flashSale.quantity > 0
            ? (flashSale.sold / flashSale.quantity) * 100
            : 0;

    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
            {/* IMAGE */}
            <div className="h-40 relative bg-gray-200">
                {flashSale.imageUrl && (
                    <img
                        src={flashSale.imageUrl}
                        alt={flashSale.productName}
                        className="w-full h-full object-cover"
                    />
                )}

                {isActive && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 font-bold">
                        🔥 FLASH SALE
                    </span>
                )}
            </div>

            {/* INFO */}
            <div className="p-3">
                <div className="text-sm h-10 overflow-hidden mb-2">
                    {flashSale.productName}
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-500 font-bold text-lg">
                        ₫{flashSale.flashPrice.toLocaleString('vi-VN')}
                    </span>

                    <span className="text-gray-400 line-through text-sm">
                        ₫{flashSale.originalPrice.toLocaleString('vi-VN')}
                    </span>
                </div>

                {/* PROGRESS */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Đã bán {flashSale.sold}</span>
                        <span>Còn {remainingQuantity}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${soldPercentage}%` }}
                        />
                    </div>
                </div>

                {/* TIME */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                        {new Date(flashSale.startTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(flashSale.endTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}
