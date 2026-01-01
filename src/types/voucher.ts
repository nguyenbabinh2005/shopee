export interface VoucherResponse {
    voucherId: number;
    code: string;

    discountType: 'percentage' | 'fixed';
    discountAmount: number;

    minOrderValue: number;
    maxDiscount: number | null;

    startDate: string;
    endDate: string;

    // ✅ PHẢI GIỐNG BACKEND
    userVoucherStatus: 'unused' | 'used' | 'expired' | 'UNAVAILABLE' | ' AVAILABLE';

    isSaved: boolean;
}
