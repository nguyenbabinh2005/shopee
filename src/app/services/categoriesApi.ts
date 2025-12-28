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

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch categories error:", error);
        return { success: false, data: [] };
    }
}
