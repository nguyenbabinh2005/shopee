export interface CartItem {
  itemId: number;
  variantId: number;
  productId: number;
  productName: string;
  attributesJson: string;
  quantity: number;
  price: number; // For compatibility
  priceSnapshot: number;
  discountSnapshot: number;
  finalPrice: number;
  lineTotal: number;
  image?: string; // Optional: for Buy Now items
  imageUrl?: string; // Optional: from backend cart items
}

export interface CartDetail {
  cartId: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}
