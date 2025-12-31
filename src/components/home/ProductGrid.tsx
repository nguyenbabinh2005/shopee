'use client';

import ProductCard from '@/components/card/ProductCard';

interface ProductGridProps {
    products: any[];
    visibleCount?: number; // Optional
    onLoadMore?: () => void; // Optional
}

export default function ProductGrid({
                                        products,
                                        visibleCount = 50,
                                        onLoadMore
                                    }: ProductGridProps) {
    // Lọc trùng trước khi render
    const uniqueProducts = products.filter((product, index, self) =>
        index === self.findIndex((p) => p.productId === product.productId)
    );

    const displayCount = visibleCount || uniqueProducts.length;

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-gray-500 uppercase text-sm mb-4">
                Gợi Ý Hôm Nay
            </h2>

            <div className="grid grid-cols-6 gap-4">
                {uniqueProducts.slice(0, displayCount).map((product, index) => (
                    <ProductCard
                        key={product.productId || index}
                        product={product}
                        variant="grid"
                    />
                ))}
            </div>

            {onLoadMore && displayCount < uniqueProducts.length && (
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