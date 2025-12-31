"use client";

import { useEffect, useState } from "react";
import { cartApi } from "@/services/cartApi";
import { CartDetail } from "@/types/cart";
import { parseAttributes } from "@/utils/parseAttributes";

export default function CartPage() {
  // ✅ Lấy cartId ngay khi render
  const [cartId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("cartId");
    return stored ? Number(stored) : null;
  });

  const [cart, setCart] = useState<CartDetail | null>(null);
  const [error, setError] = useState(false);

  // ✅ Effect CHỈ dùng cho API
  useEffect(() => {
    if (!cartId) return;

    cartApi
      .getCart(cartId)
      .then(setCart)
      .catch(() => {
        localStorage.removeItem("cartId");
        setError(true);
      });
  }, [cartId]);

  /* ================= UI LOGIC ================= */

  // ⏳ ĐANG LOAD (chưa có cartId hoặc chưa có cart)
  if (cartId && !cart && !error) {
    return <div className="p-6 text-center">Đang tải giỏ hàng...</div>;
  }

  // 🛒 CHƯA CÓ GIỎ
  if (!cartId || error || !cart) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
        <button
          onClick={() => (window.location.href = "/products")}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
        >
          Mua sắm ngay
        </button>
      </div>
    );
  }

  // 🛍️ CÓ GIỎ HÀNG
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">🛒 Giỏ hàng</h1>

      {cart.items.map((item) => (
        <div
          key={item.itemId}
          className="flex justify-between items-start border p-4 mb-4 rounded"
        >
          <div>
            <h3 className="font-medium">{item.productName}</h3>
            <p className="text-sm text-gray-500">
              {parseAttributes(item.attributesJson)}
            </p>

            <div className="flex gap-3 items-center mt-3">
              <button
                onClick={() =>
                  cartApi
                    .updateQuantity(cart.cartId, item.variantId, "decrease")
                    .then(setCart)
                }
                className="px-2 border"
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  cartApi
                    .updateQuantity(cart.cartId, item.variantId, "increase")
                    .then(setCart)
                }
                className="px-2 border"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-orange-500 font-semibold">
              ₫{item.lineTotal.toLocaleString("vi-VN")}
            </p>

            <button
              onClick={() =>
                cartApi
                  .removeItem(cart.cartId, item.variantId)
                  .then(setCart)
              }
              className="text-red-500 text-sm mt-2"
            >
              Xóa
            </button>
          </div>
        </div>
      ))}

      <div className="text-right mt-6 border-t pt-4">
        <p className="text-lg">
          Tổng thanh toán:
          <span className="text-orange-500 font-bold ml-2">
            ₫{cart.totalAmount.toLocaleString("vi-VN")}
          </span>
        </p>

        <button
          onClick={() => (window.location.href = "/checkout")}
          className="mt-4 bg-orange-500 text-white px-6 py-3 rounded"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
