export interface VoucherResponse {
    voucherId: number;
    code: string;
    discountType: string;
    discountAmount: number;
    minOrderValue: number;
    maxDiscount: number;
    startDate: string;        // LocalDateTime từ backend
    endDate: string;
    userVoucherStatus: string; // AVAILABLE | UNAVAILABLE
    isSaved: boolean;
}
