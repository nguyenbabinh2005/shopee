'use client';

import { Star } from 'lucide-react';

interface ProductGridProps {
    products: any[];
    visibleCount: number;
    onLoadMore: () => void;
}

export default function ProductGrid({ products, visibleCount, onLoadMore }: ProductGridProps) {
    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-gray-500 uppercase text-sm mb-4">Gợi Ý Hôm Nay</h2>
            <div className="grid grid-cols-6 gap-4">
                {products.slice(0, visibleCount).map((product, idx) => (
                    <div
                        key={product.productId || idx}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                    >
                        <div className="h-40 bg-gray-200">
                            {product.primaryImageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="p-3">
                            <div className="text-sm h-10 overflow-hidden mb-2">{product.name}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-orange-500 font-bold">
{product.finalPrice.toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{product.rating || 4.5}</span>
                                </div>
                                <span>Đã bán {product.totalPurchaseCount || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < products.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={onLoadMore}
                        className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition font-medium"
                    >
                        Xem Thêm
                    </button>
                </div>
            )}
        </div>
    );
}