'use client';

import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ProductDetailResponse, VariantInfo } from '@/types/productDetail';
import { ShoppingCart } from 'lucide-react';

interface AddToCartBarProps {
    product: ProductDetailResponse;
    selectedVariant: VariantInfo | null;
    quantity: number;
}

export default function AddToCartBar({
    product,
    selectedVariant,
    quantity,
}: AddToCartBarProps) {
    const router = useRouter();
    const { addToCart } = useShop();

    const handleAddToCart = () => {
        if (!selectedVariant) {
            alert('Vui lòng chọn phân loại sản phẩm!');
            return;
        }

        if (quantity <= 0) {
            alert('Vui lòng chọn số lượng!');
            return;
        }

        addToCart({
            id: product.productId,
            name: product.name,
            price: selectedVariant.priceOverride ?? product.price,
            quantity,
            variantId: selectedVariant.variantId,
        });

        alert('Đã thêm vào giỏ hàng!');
    };

    const handleBuyNow = () => {
        if (!selectedVariant) {
            alert('Vui lòng chọn phân loại sản phẩm!');
            return;
        }

        if (quantity <= 0) {
            alert('Vui lòng chọn số lượng!');
            return;
        }

        // Navigate directly to checkout with buynow mode
        // Checkout page will handle the product data
        router.push(`/checkout?mode=buynow&variantId=${selectedVariant.variantId}&quantity=${quantity}`);
    };

    const isOutOfStock = !selectedVariant || selectedVariant.quantity === 0;

    return (
        <div className="flex gap-4 mt-6">
            <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
            </button>

            <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                Mua ngay
            </button>
        </div>
    );
}
