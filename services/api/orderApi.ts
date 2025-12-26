// services/api/orderApi.ts
// API Service cho Order & Checkout

import type {
  CheckoutRequest,
  CheckoutResponse,
  SelectShippingRequest,
  SelectVoucherRequest,
  OrderCreateRequest,
  OrderResponse,
} from '../types/order.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 1. LẤY THÔNG TIN CHECKOUT
 * POST /api/orders/checkout
 */
export async function getCheckoutInfo(
  request: CheckoutRequest,
  userId: number
): Promise<CheckoutResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/checkout?userId=${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error('Không thể lấy thông tin checkout');
  }

  return response.json();
}

/**
 * 2. CHỌN PHƯƠNG THỨC VẬN CHUYỂN
 * POST /api/orders/checkout/select-shipping
 */
export async function selectShipping(
  request: SelectShippingRequest
): Promise<CheckoutResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/checkout/select-shipping`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error('Không thể chọn phương thức vận chuyển');
  }

  return response.json();
}

/**
 * 3. ÁP DỤNG/BỎ VOUCHER
 * POST /api/orders/checkout/select-voucher
 */
export async function selectVoucher(
  request: SelectVoucherRequest
): Promise<CheckoutResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/checkout/select-voucher`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error('Không thể áp dụng voucher');
  }

  return response.json();
}

/**
 * 4. TẠO ĐƠN HÀNG
 * POST /api/orders/create
 */
export async function createOrder(
  request: OrderCreateRequest
): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Không thể tạo đơn hàng');
  }

  return response.json();
}