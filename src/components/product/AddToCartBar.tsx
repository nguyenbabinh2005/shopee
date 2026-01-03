"use client";

import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { ProductDetailResponse, VariantInfo } from "@/types/productDetail";

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
    const { addToCart, setBuyNowItem, user } = useShop();

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            alert("Vui lòng chọn phiên bản sản phẩm!");
            return;
        }

        if (quantity < 1) {
            alert("Số lượng phải lớn hơn 0!");
            return;
        }

        if (quantity > selectedVariant.quantity) {
            alert(`Chỉ còn ${selectedVariant.quantity} sản phẩm trong kho!`);
            return;
        }


        await addToCart({
            id: product.productId,
            name: product.name,
            price: selectedVariant.priceOverride ?? product.price,
            variantId: selectedVariant.variantId,
            quantity: quantity,
            image: product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl,
        });
    };

    const handleBuyNow = () => {
        if (!user) {
            const confirm = window.confirm(
                "Bạn cần đăng nhập để mua hàng. Đăng nhập ngay?"
            );
            if (confirm) router.push("/login");
            return;
        }

        if (!selectedVariant) {
            alert("Vui lòng chọn phiên bản sản phẩm!");
            return;
        }

        if (quantity < 1) {
            alert("Số lượng phải lớn hơn 0!");
            return;
        }

        if (quantity > selectedVariant.quantity) {
            alert(`Chỉ còn ${selectedVariant.quantity} sản phẩm trong kho!`);
            return;
        }

        // Set buy now item with all necessary information
        const buyNowItem = {
            itemId: 0, // Temporary ID for buy now
            variantId: selectedVariant.variantId,
            productId: product.productId,
            productName: product.name,
            price: selectedVariant.priceOverride ?? product.price,
            quantity: quantity,
            attributesJson: selectedVariant.attributesJson,
            lineTotal: (selectedVariant.priceOverride ?? product.price) * quantity,
            image: product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl,
        };

        setBuyNowItem(buyNowItem);
        router.push("/checkout?mode=buynow");
    };

    return (
        <div className="flex gap-4 mt-6">
            <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-100 text-orange-600 border-2 border-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedVariant || quantity < 1}
            >
                <span className="flex items-center justify-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    Thêm vào giỏ hàng
                </span>
            </button>

            <button
                onClick={handleBuyNow}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedVariant || quantity < 1}
            >
                Mua ngay
            </button>
        </div>
    );
}
