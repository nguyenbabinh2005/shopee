// ============================================
// ✅ FILE: app/services/productApi.ts (MERGED)
// ============================================

const API_URL = 'http://localhost:8080/api';

/* =======================
   📦 INTERFACES
======================= */

export interface ProductSearchResponse {
    productId: number;
    name: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    imageUrl: string | null;
    totalPurchaseCount: number | null;
    rating: number;
}

export interface VariantInfo {
    variantId: number;
    sku: string;
    quantity: number;
    attributesJson: string;
    priceOverride: number | null;
    status: string;
    createdAt: string;
}

export interface ImageInfo {
    imageId: number;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface BrandInfo {
    brandId: number;
    name: string;
    slug: string;
    logoUrl: string;
    website: string;
    description: string;
}

export interface ProductDetailResponse {
    productId: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    brand?: BrandInfo;
    images: ImageInfo[];
    variants: VariantInfo[];
    reviews: any[];
    totalReviews: number;
}

/* =======================
   🔹 FETCH FUNCTIONS (Home page)
======================= */

/**
 * Lấy sản phẩm bán chạy (Home)
 */
export async function fetchProducts(
    page: number = 1,
    limit: number = 18
) {
    try {
        const res = await fetch(
            `${API_URL}/products/top-selling?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                next: { revalidate: 0 },
            }
        );

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error('Fetch products error:', error);
        return { success: false, data: [] };
    }
}


/**
 * Lấy sản phẩm flash sale
 */
export async function fetchFlashSaleProducts() {
    try {
        const res = await fetch(`${API_URL}/flash-sales/active`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error('Fetch flash sale error:', error);
        return { success: false, data: [] };
    }
}

/**
 * Lấy top sản phẩm được tìm kiếm
 */
export async function fetchTopSearchProducts() {
    try {
        const res = await fetch(`${API_URL}/products/top`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error('Fetch top search error:', error);
        return { success: false, data: [] };
    }
}

/* =======================
   🔹 PRODUCT API SERVICE
======================= */

export const productApiService = {
    /**
     * Lấy toàn bộ sản phẩm (filter)
     */
    async getAllProducts(): Promise<ProductSearchResponse[]> {
        const response = await fetch(`${API_URL}/products/filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch all products');
        }

        return response.json();
    },

    /**
     * Lấy top 50 sản phẩm
     */
    async getTop50Products(): Promise<ProductSearchResponse[]> {
        const response = await fetch(`${API_URL}/products/top`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ [API] Error:', error);
            throw new Error(`Failed to fetch top products: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Lấy sản phẩm bán chạy
     */
    async getTopSellingProducts(): Promise<ProductSearchResponse[]> {
        const response = await fetch(`${API_URL}/products/top-selling`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ [API] Error:', error);
            throw new Error(`Failed to fetch top selling: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Tìm kiếm sản phẩm
     */
    async searchProducts(keyword: string): Promise<ProductSearchResponse[]> {
        const response = await fetch(
            `${API_URL}/products/search?keyword=${encodeURIComponent(keyword)}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ [API] Error:', error);
            throw new Error(`Search failed: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Lấy chi tiết sản phẩm (an toàn lỗi 500)
     */
    async getProductById(id: number): Promise<ProductDetailResponse | null> {
        try {
            const response = await fetch(`${API_URL}/products/id/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('❌ [API] Error:', error);
                return null;
            }

            return response.json();

        } catch (error) {
            console.error('❌ [API] Exception:', error);
            return null;
        }
    },
};
