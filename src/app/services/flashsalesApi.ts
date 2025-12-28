export async function fetchActiveFlashSales() {
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
        console.error("Fetch active flash sales error:", error);
        return { success: false, data: [] };
    }
}

export async function fetchUpcomingFlashSales() {
    try {
        const res = await fetch("http://localhost:8080/api/flash-sales/upcoming", {
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
        console.error("Fetch upcoming flash sales error:", error);
        return { success: false, data: [] };
    }
}