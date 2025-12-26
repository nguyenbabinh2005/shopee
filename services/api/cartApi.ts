// services/api/cartApi.ts
// API Service cho Cart

import type {
  CartDetailResponse,
  CartQuantityResponse,
  VariantItem,
} from '../types/cart.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 1. LẤY CHI TIẾT GIỎ HÀNG
 * GET /api/cart/{cartId}
 */
export async function getCartDetail(cartId: number): Promise<CartDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/cart/${cartId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể tải giỏ hàng');
  }

  return response.json();
}

/**
 * 2. CẬP NHẬT SỐ LƯỢNG SẢN PHẨM
 * PUT /api/cartitem/update-quantity
 */
export async function updateCartQuantity(
  cartId: number,
  variantId: number,
  action: 'increase' | 'decrease'
): Promise<CartQuantityResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/cartitem/update-quantity?cartId=${cartId}&variantId=${variantId}&action=${action}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Không thể cập nhật số lượng');
  }

  return response.json();
}

/**
 * 3. XÓA SẢN PHẨM KHỎI GIỎ HÀNG
 * DELETE /api/cartitem/item
 */
export async function deleteCartItem(
  cartId: number,
  variantId: number
): Promise<CartDetailResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/cartitem/item?cartId=${cartId}&variantId=${variantId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Không thể xóa sản phẩm');
  }

  return response.json();
}

/**
 * 4. THÊM SẢN PHẨM VÀO GIỎ HÀNG
 * POST /api/cartitem/add
 */
export async function addToCart(
  cartId: number,
  item: VariantItem
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/cartitem/add?cartId=${cartId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    }
  );

  if (!response.ok) {
    throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
  }

  return response.text();
}