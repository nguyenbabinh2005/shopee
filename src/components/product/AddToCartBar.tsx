"use client";

import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";

interface Props {
  product: {
    productId: number;
    name: string;
  };
  variant: {
    variantId: number;
    price: number;
    attributesJson: string;
    imageUrl?: string;
  };
  quantity: number;
}

export default function AddToCartBar({ product, variant, quantity }: Props) {
  const router = useRouter();
  const { addToCart, setBuyNowItem, user } = useShop();

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    await addToCart({
      id: product.productId,
      name: product.name,
      price: variant.price,
      quantity,
      variantId: variant.variantId,
      image: variant.imageUrl,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setBuyNowItem({
      itemId: -1, // fake, backend không dùng
      variantId: variant.variantId,
      productId: product.productId,
      productName: product.name,
      price: variant.price,
      quantity,
      attributesJson: variant.attributesJson,
      lineTotal: variant.price * quantity,
      image: variant.imageUrl,
    });

    router.push("/checkout?mode=buynow");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleAddToCart}
        className="flex-1 border-2 border-orange-500 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50"
      >
        Thêm vào giỏ hàng
      </button>

      <button
        onClick={handleBuyNow}
        className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
      >
        Mua ngay
      </button>
    </div>
  );
}
