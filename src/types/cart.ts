export interface CartItem {
  itemId: number;
  variantId: number;
  productId: number;
  productName: string;
  attributesJson: string;
  quantity: number;
  finalPrice: number;
  lineTotal: number;
}

export interface CartDetail {
  cartId: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}
