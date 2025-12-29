export interface Product {
    productId: number;
    name: string;
    originalPrice: number;
    finalPrice: number;
    imageUrl?: string;
    totalPurchaseCount?: number;
    rating?: number;
    discount?: number;
    stock?: number;
    soldCount?: number;
}