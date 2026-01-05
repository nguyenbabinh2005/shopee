import { CartDetail } from "@/types/cart";

const BASE_URL = "http://localhost:8080/api/cart";

export const cartApi = {
  async getCart(cartId: number): Promise<CartDetail> {
    const res = await fetch(`${BASE_URL}/${cartId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Không lấy được giỏ hàng");
    }

    return res.json();
  },

  async addToCart(
    cartId: number,
    variantId: number,
    quantity: number
  ): Promise<CartDetail> {
    const res = await fetch(`${BASE_URL}/${cartId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    return res.json();
  },

  async updateQuantity(
    cartId: number,
    variantId: number,
    action: "increase" | "decrease"
  ) {
    const res = await fetch(
      `${BASE_URL}/${cartId}/update-quantity?variantId=${variantId}&action=${action}`,
      { method: "PUT" }
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Update quantity failed");
    }

    return res.json();
  },

  async removeItem(cartId: number, variantId: number): Promise<CartDetail> {
    const res = await fetch(
      `${BASE_URL}/${cartId}/remove/${variantId}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      throw new Error("Remove item failed");
    }

    return res.json();
  },
};
