export interface ProductSearchResponse {
  productId: number;
  name: string;

  finalPrice: number | string;
  originalPrice: number | string;

  imageUrl?: string | null;

  rating?: number;
  soldCount?: number;
  totalPurchaseCount?: number;
  stock?: number;
}
