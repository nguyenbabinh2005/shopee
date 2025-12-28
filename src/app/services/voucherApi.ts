export async function fetchAvailableVouchers() {
    try {
        const res = await fetch("http://localhost:8080/api/vouchers/available", {
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
        console.error("Fetch available vouchers error:", error);
        return { success: false, data: [] };
    }
}

export async function saveVoucherForUser(voucherId: number, userId: number) {
    try {
        const res = await fetch(
            `http://localhost:8080/api/user-vouchers/${voucherId}?userId=${userId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );

        if (!res.ok) {
            return { success: false, message: "Lưu voucher thất bại" };
        }

        const data = await res.text();
        return { success: true, message: data };

    } catch (error) {
        console.error("Save voucher error:", error);
        return { success: false, message: "Network error" };
    }
}

export async function fetchUserVouchers(userId: number) {
    try {
        const res = await fetch(
            `http://localhost:8080/api/user-vouchers/user/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 0 }
            }
        );

        if (!res.ok) {
            return { success: false, data: [] };
        }

        const data = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch user vouchers error:", error);
        return { success: false, data: [] };
    }
}