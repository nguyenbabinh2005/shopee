export async function fetchActiveCategories() {
    try {
        const res = await fetch("http://localhost:8080/api/categories/active", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 0 } // tránh cache khi dev
        });

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const rawData = await res.json();

        // Transform backend response to match frontend Category interface
        // Keep all original fields and add 'id' field
        const data = rawData.map((cat: any) => ({
            ...cat, // Keep all original fields (name, icon, categoryId, etc.)
            id: cat.categoryId || cat.id, // Add id field from categoryId
        }));

        return { success: true, data };

    } catch (error) {
        console.error("Fetch categories error:", error);
        return { success: false, data: [] };
    }
}
