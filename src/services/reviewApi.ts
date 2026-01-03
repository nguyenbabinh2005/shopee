// Review API Service
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ReviewCreateRequest {
    userId: number;
    productId: number;
    orderId: number;
    rating: number; // 1-5
    title?: string;
    content?: string;
}

export interface ReviewResponse {
    reviewId: number;
    productId: number;
    productName: string;
    userId: number;
    username: string;
    rating: number;
    title: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const reviewApi = {
    /**
     * Create a new review
     */
    async createReview(data: ReviewCreateRequest): Promise<ReviewResponse> {
        const response = await fetch(`${API_BASE}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create review');
        }

        return response.json();
    },

    /**
     * Check if user can review a product from an order
     */
    async canReview(userId: number, productId: number, orderId: number): Promise<boolean> {
        const response = await fetch(
            `${API_BASE}/api/reviews/can-review?userId=${userId}&productId=${productId}&orderId=${orderId}`
        );

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.canReview;
    },

    /**
     * Get all reviews by a user
     */
    async getUserReviews(userId: number): Promise<ReviewResponse[]> {
        const response = await fetch(`${API_BASE}/api/reviews/user/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch user reviews');
        }

        return response.json();
    },

    /**
     * Get all reviews for a product
     */
    async getProductReviews(productId: number): Promise<ReviewResponse[]> {
        const response = await fetch(`${API_BASE}/api/reviews/product/${productId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch product reviews');
        }

        return response.json();
    },
};
