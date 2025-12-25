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