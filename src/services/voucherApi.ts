import { VoucherResponse } from "@/types/voucher";

/**
 * Lấy danh sách voucher khả dụng cho user
 * GET /api/vouchers/available?userId=
 */
export async function fetchAvailableVouchers(userId: number) {
    try {
        const res = await fetch(
            `http://localhost:8080/api/vouchers/available?userId=${userId}`,
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

/**
 * User bấm "Lưu voucher"
 * POST /api/user-vouchers/{voucherId}?userId=
 */
export async function saveVoucherForUser(
    voucherId: number,
    userId: number
) {
    try {
        const res = await fetch(
            `http://localhost:8080/api/user-vouchers/${voucherId}?userId=${userId}`,
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

/**
 * Lấy danh sách voucher của user
 * GET /api/user-vouchers/user/{userId}
 */
export async function fetchUserVouchers(userId: number) {
    try {
        const res = await fetch(
            `http://localhost:8080/api/user-vouchers/user/${userId}`,
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
