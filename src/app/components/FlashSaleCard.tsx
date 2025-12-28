'use client';

import { Clock, Star } from 'lucide-react';

interface FlashSaleCardProps {
    flashSale: {
        flashSaleId: number;
        product: {
            productId: number;
            name: string;
            imageUrl?: string;
        };
        flashPrice: number;
        quantity: number;
        sold: number;
        startTime: string;
        endTime: string;
        status: string;
    };
    isActive: boolean;
}

export default function FlashSaleCard({ flashSale, isActive }: FlashSaleCardProps) {
    const remainingQuantity = flashSale.quantity - flashSale.sold;
    const soldPercentage = (flashSale.sold / flashSale.quantity) * 100;

    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
            <div className="h-40 relative bg-gray-200">
                {flashSale.product.imageUrl && (
                    <img
                        src={flashSale.product.imageUrl}
                        alt={flashSale.product.name}
                        className="w-full h-full object-cover"
                    />
                )}
                {isActive && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 font-bold">
                        🔥 FLASH SALE
                    </span>
                )}
            </div>
            <div className="p-3">
                <div className="text-sm h-10 overflow-hidden mb-2">
                    {flashSale.product.name}
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-500 font-bold text-lg">
                        {flashSale.flashPrice.toLocaleString()}đ
                    </span>
                </div>

                {/* Progress bar */}
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

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                        {new Date(flashSale.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(flashSale.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
}