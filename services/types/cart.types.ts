// services/types/cart.types.ts
// TypeScript types mapping từ Java DTOs

/**
 * Response từ GET /api/cart/{cartId}
 */
export interface CartDetailResponse {
  cartId: number;
  userId: number;
  sessionId: string;
  isActive: boolean;
  currency: string;
  expiresAt: string; // ISO DateTime
  createdAt: string;
  updatedAt: string;
  items: CartItemResponse[];
  totalAmount: number;
}

/**
 * Chi tiết từng sản phẩm trong giỏ hàng
 */
export interface CartItemResponse {
  itemId: number;
  variantId: number;
  productId: number;
  productName: string;
  attributesJson: string; // JSON string: {"color": "red", "size": "M"}
  quantity: number;
  priceSnapshot: number;
  discountSnapshot: number;
  finalPrice: number;
  lineTotal: number; // finalPrice * quantity
}

/**
 * Response từ PUT /api/cartitem/update-quantity
 */
export interface CartQuantityResponse {
  cartId: number;
  variantId: number;
  quantity: number;
  lineTotal: number;
  totalAmount: number;
}

/**
 * Request body cho POST /api/cartitem/add
 */
export interface VariantItem {
  variantId: number;
  quantity: number;
}

/**
 * Parsed attributes từ attributesJson
 */
export interface ProductAttributes {
  color?: string;
  size?: string;
  [key: string]: string | undefined;
}