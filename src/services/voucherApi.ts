import { VoucherResponse } from "@/types/voucher";

const API_BASE_URL = "http://localhost:8080/api";

/* =====================================================
   1️⃣ Lấy voucher khả dụng (TRUYỀN userId – code cũ của bạn)
   ===================================================== */
export async function fetchAvailableVouchers(userId: number) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/vouchers/available?userId=${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            return { success: false, data: [] as VoucherResponse[] };
        }

        const data: VoucherResponse[] = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch available vouchers error:", error);
        return { success: false, data: [] as VoucherResponse[] };
    }
}

/* =====================================================
   2️⃣ Lấy voucher khả dụng (TỰ LẤY userId từ localStorage)
   – gộp từ code của bạn bạn
   ===================================================== */
export async function fetchAvailableVouchersFromStorage() {
    try {
        if (typeof window === "undefined") {
            return { success: false, data: [] as VoucherResponse[] };
        }

        const userStr = localStorage.getItem("user");
        if (!userStr) {
            console.warn("User not logged in");
            return { success: false, data: [] as VoucherResponse[] };
        }

        const user = JSON.parse(userStr);
        if (!user.userId) {
            console.warn("User ID not found");
            return { success: false, data: [] as VoucherResponse[] };
        }

        return await fetchAvailableVouchers(user.userId);

    } catch (error) {
        console.error("Fetch vouchers from storage error:", error);
        return { success: false, data: [] as VoucherResponse[] };
    }
}

/* =====================================================
   3️⃣ Lưu voucher cho user
   ===================================================== */
export async function saveVoucherForUser(
    voucherId: number,
    userId: number
) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/user-vouchers/${voucherId}?userId=${userId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const message = await res.text();

        if (!res.ok) {
            return { success: false, message };
        }

        return { success: true, message };

    } catch (error) {
        console.error("Save voucher error:", error);
        return { success: false, message: "Network error" };
    }
}

/* =====================================================
   4️⃣ Lấy danh sách voucher của user
   ===================================================== */
export async function fetchUserVouchers(userId: number) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/user-vouchers/user/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            return { success: false, data: [] as VoucherResponse[] };
        }

        const data: VoucherResponse[] = await res.json();
        return { success: true, data };

    } catch (error) {
        console.error("Fetch user vouchers error:", error);
        return { success: false, data: [] as VoucherResponse[] };
    }
}

/* =====================================================
   5️⃣ Helper: Tính tiền giảm (UI)
   ===================================================== */
export function calculateVoucherDiscount(
    voucher: VoucherResponse,
    subtotal: number
): number {
    if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
        return 0;
    }

    let discount = 0;

    if (voucher.discountType === "percentage") {
        discount = (subtotal * voucher.discountAmount) / 100;

        if (voucher.maxDiscount && discount > voucher.maxDiscount) {
            discount = voucher.maxDiscount;
        }
    } else {
        discount = voucher.discountAmount;
    }

    return Math.min(discount, subtotal);
}

/* =====================================================
   6️⃣ Helper: Kiểm tra voucher có dùng được không
   ===================================================== */
export function isVoucherUsable(
    voucher: VoucherResponse,
    cartTotal: number
): boolean {
    if (
        voucher.userVoucherStatus === "used" ||
        voucher.userVoucherStatus === "expired" ||
        voucher.userVoucherStatus === "UNAVAILABLE"
    ) {
        return false;
    }

    if (voucher.minOrderValue && cartTotal < voucher.minOrderValue) {
        return false;
    }

    const now = new Date();
    const endDate = new Date(voucher.endDate);

    return endDate >= now;
}
