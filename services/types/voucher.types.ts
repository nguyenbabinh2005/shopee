// services/types/voucher.types.ts
// TypeScript types cho Voucher

/**
 * Response từ GET /api/vouchers/available
 */
export interface VoucherResponse {
  voucherId: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  startTime: string; // ISO DateTime
  endTime: string;
}

/**
 * Response từ GET /api/user-vouchers/user/{userId}
 */
export interface UserVoucherResponse {
  voucherId: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  startTime: string;
  endTime: string;
  userVoucherStatus: 'unused' | 'used' | 'expired';
  redeemedAt: string;
}