export interface ImageInfo {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface VariantInfo {
  variantId: number;
  quantity: number;
  attributesJson: string;
  priceOverride: number | null;
  status: string;
  createdAt: string;
}

export interface ReviewInfo {
  reviewId: number;
  rating: number;
  title?: string;
  content: string;
  status: string;
  userName: string;
  createdAt: string;
}

export interface ProductDetailResponse {
  productId: number;
  name: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
  variants: VariantInfo[];
  reviews: ReviewInfo[];
  totalReviews: number;
}
