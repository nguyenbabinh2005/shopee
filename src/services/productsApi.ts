export async function fetchProducts(page: number = 1, limit: number = 18) {
    try {
        const res = await fetch(`http://localhost:8080/api/products/top-selling`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch products error:", error);
        return { success: false, data: [] };
    }
}

export async function fetchFlashSaleProducts() {
    try {
        const res = await fetch("http://localhost:8080/api/flash-sales/active", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch flash sale error:", error);
        return { success: false, data: [] };
    }
}

export async function fetchTopSearchProducts() {
    try {
        const res = await fetch("http://localhost:8080/api/products/top", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch top search error:", error);
        return { success: false, data: [] };
    }
}
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

export interface ProductDetailResponse {
    productId: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    reviews: unknown[];
    totalReviews: number;
}
export const productApiService = {
    async getAllProducts(): Promise<ProductSearchResponse[]> {
  const url = 'http://localhost:8080/api/products/filter';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
        const url = `http://localhost:8080/api/products/top`;
        console.log('📡 [API] Calling:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ [API] Error:', error);
            throw new Error(`Failed to fetch top products: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [API] Top products:', data.length);
        return data;
    },

    /**
     * Lấy sản phẩm bán chạy
     */
    async getTopSellingProducts(): Promise<ProductSearchResponse[]> {
        const url = `http://localhost:8080/api/products/top-selling`;
        console.log('📡 [API] Calling:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ [API] Error:', error);
            throw new Error(`Failed to fetch top selling: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [API] Top selling:', data.length);
        return data;
    },

    /**
     * Tìm kiếm sản phẩm
     */
    async searchProducts(keyword: string): Promise<ProductSearchResponse[]> {
        const url = `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}`;
        console.log('📡 [API] Calling:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ [API] Error:', error);
            throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [API] Search results:', data.length);
        return data;
    },

    /**
     * ✅ FIX: Lấy chi tiết sản phẩm - XỬ LÝ LỖI 500
     */
    async getProductById(id: number): Promise<ProductDetailResponse | null> {
        const url = `http://localhost:8080/api/products/id/${id}`;
        console.log('📡 [API] Calling:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('❌ [API] Error:', error);
                console.error('❌ [API] Status:', response.status);
                return null; // ✅ Trả về null thay vì throw error
            }

            const data = await response.json();
            console.log('✅ [API] Product detail:', data);
            return data;

        } catch (error) {
            console.error('❌ [API] Exception:', error);
            return null; // ✅ Trả về null nếu có exception
        }
    },
};
