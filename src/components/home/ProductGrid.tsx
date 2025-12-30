// src/components/home/ProductGrid.tsx (hoặc đường dẫn tương ứng)
'use client';

import ProductCard from '@/components/card/ProductCard';

interface ProductGridProps {
    products: any[];
    visibleCount: number;
    onLoadMore: () => void;
}

export default function ProductGrid({
                                        products,
                                        visibleCount,
                                        onLoadMore
                                    }: ProductGridProps) {
    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-gray-500 uppercase text-sm mb-4">
                Gợi Ý Hôm Nay
            </h2>

            <div className="grid grid-cols-6 gap-4">
                {products.slice(0, visibleCount).map((product, index) => (
                    <ProductCard
                        key={`${product.productId ?? 'no-id'}-${index}`}
                        product={product}
                        variant="grid"
                    />
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