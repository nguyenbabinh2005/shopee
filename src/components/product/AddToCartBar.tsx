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
    const { addToCart, setBuyNowItem } = useShop();

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

        // Alert is already shown in ShopContext, no need for duplicate
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

        // Get primary image
        const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl || '';
        const finalPrice = selectedVariant.priceOverride ?? product.price;

        // Set buyNowItem in context before navigation
        setBuyNowItem({
            itemId: 0, // Temporary ID for buy now items
            productId: product.productId,
            variantId: selectedVariant.variantId,
            productName: product.name,
            price: finalPrice,
            priceSnapshot: finalPrice,
            quantity: quantity,
            attributesJson: selectedVariant.attributesJson,
            discountSnapshot: 0,
            finalPrice: finalPrice,
            lineTotal: finalPrice * quantity,
            image: primaryImage,
        });

        // Navigate to checkout with buynow mode
        router.push(`/checkout?mode=buynow`);
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
