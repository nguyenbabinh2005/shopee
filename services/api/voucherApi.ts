// services/api/voucherApi.ts
// API Service cho Voucher

import type {
  VoucherResponse,
  UserVoucherResponse,
} from '../types/voucher.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 1. LẤY DANH SÁCH VOUCHER KHẢ DỤNG
 * GET /api/vouchers/available
 */
export async function getAvailableVouchers(): Promise<VoucherResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/vouchers/available`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách voucher');
  }

  return response.json();
}

/**
 * 2. LƯU VOUCHER VÀO TÀI KHOẢN
 * POST /api/user-vouchers/{voucherId}
 */
export async function saveVoucher(
  userId: number,
  voucherId: number
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/user-vouchers/${voucherId}?userId=${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Không thể lưu voucher');
  }

  return response.text();
}

/**
 * 3. LẤY DANH SÁCH VOUCHER ĐÃ LƯU CỦA USER
 * GET /api/user-vouchers/user/{userId}
 */
export async function getUserVouchers(
  userId: number
): Promise<UserVoucherResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/user-vouchers/user/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách voucher đã lưu');
  }

  return response.json();
}