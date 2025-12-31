export interface ImageInfo {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface VariantInfo {
  variantId: number;
  quantity: number;
  attributesJson: string;
  priceOverride: number | null;
  imageUrl: string | null;
  status: string;
  createdAt: string;
}

export interface ReviewInfo {
  reviewId: number;
  rating: number;
  comment: string;
  username: string;
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
