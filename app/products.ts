export async function fetchProducts(page: number = 1, limit: number = 18) {
    try {
        const res = await fetch(`http://localhost:8081/api/products?page=${page}&limit=${limit}`, {
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
        const res = await fetch("http://localhost:8081/api/products/flash-sale", {
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
        const res = await fetch("http://localhost:8081/api/products/top-search", {
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