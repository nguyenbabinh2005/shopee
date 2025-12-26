// services/types/order.types.ts
// TypeScript types cho Order & Checkout

import type { VariantItem } from './cart.types';

/**
 * Request cho POST /api/orders/checkout
 */
export interface CheckoutRequest {
  variants: VariantItem[];
}

/**
 * Response từ POST /api/orders/checkout
 * Response từ POST /api/orders/checkout/select-shipping
 * Response từ POST /api/orders/checkout/select-voucher
 */
export interface CheckoutResponse {
  items: CheckoutItemResponse[];
  subtotal: number;
  shippingFee: number;
  orderDiscount: number;
  finalTotal: number;
  shippingMethods: ShippingMethodResponse[];
  selectedShipping: ShippingMethodResponse | null;
}

/**
 * Chi tiết sản phẩm trong checkout
 */
export interface CheckoutItemResponse {
  variantId: number;
  productName: string;
  attribution: string; // "Màu Đỏ - Size M"
  basePrice: number;
  itemDiscountTotal: number;
  discountedPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
}

/**
 * Phương thức vận chuyển
 */
export interface ShippingMethodResponse {
  id: number;
  name: string;
  baseFee: number;
  estimatedDays: number;
}

/**
 * Request cho POST /api/orders/checkout/select-shipping
 */
export interface SelectShippingRequest {
  variants: VariantItem[];
  shippingMethodId: number;
}

/**
 * Request cho POST /api/orders/checkout/select-voucher
 */
export interface SelectVoucherRequest {
  variants: VariantItem[];
  vouchercode: string | null; // null = bỏ voucher
}

/**
 * Request cho POST /api/orders/create
 */
export interface OrderCreateRequest {
  userId: number;
  paymentMethod: string; // "COD" | "VNPay" | "Card"
  note: string;
  addressRequest: AddressRequest;
  items: OrderItemRequest[];
  voucherCode?: string;
  shippingMethodId: number;
}

/**
 * Địa chỉ giao hàng
 */
export interface AddressRequest {
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

/**
 * Chi tiết sản phẩm trong đơn hàng
 */
export interface OrderItemRequest {
  variantId: number;
  quantity: number;
  price: number; // Price snapshot
}

/**
 * Response từ POST /api/orders/create
 */
export interface OrderResponse {
  orderId: number;
  status: string; // "CREATED" | "PENDING_PAYMENT" | "PROCESSING"
  message: string;
}