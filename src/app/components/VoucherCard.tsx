'use client';

import { Ticket, Clock } from 'lucide-react';

interface VoucherCardProps {
    voucher: {
        voucherId: number;
        code: string;
        discountType: string; // 'percentage' | 'fixed'
        discountValue: number;
        maxDiscount?: number;
        minOrderValue?: number;
        usageLimit: number;
        usedCount: number;
        startTime: string;
        endTime: string;
    };
    onSave: (voucherId: number) => void;
}

export default function VoucherCard({ voucher, onSave }: VoucherCardProps) {
    const remainingQuantity = voucher.usageLimit - voucher.usedCount;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Ticket className="w-6 h-6" />
                    <span className="font-bold text-lg">{voucher.code}</span>
                </div>
                <div className="text-2xl font-bold">
                    {voucher.discountType === 'percentage'
                        ? `Giảm ${voucher.discountValue}%`
                        : `Giảm ${voucher.discountValue.toLocaleString()}đ`
                    }
                </div>
                {voucher.maxDiscount && voucher.discountType === 'percentage' && (
                    <div className="text-sm opacity-90">
                        Tối đa {voucher.maxDiscount.toLocaleString()}đ
                    </div>
                )}
            </div>

            <div className="p-4">
                {voucher.minOrderValue && (
                    <div className="mb-3">
                        <div className="text-sm text-gray-600 mb-1">Điều kiện:</div>
                        <div className="text-sm font-medium">
                            Đơn tối thiểu {voucher.minOrderValue.toLocaleString()}đ
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>HSD: {new Date(voucher.endTime).toLocaleDateString('vi-VN')}</span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                    Số lượng còn lại: {remainingQuantity}
                </div>

                <button
                    onClick={() => onSave(voucher.voucherId)}
                    disabled={remainingQuantity <= 0}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                        remainingQuantity > 0
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {remainingQuantity > 0 ? 'Lưu Voucher' : 'Hết lượt'}
                </button>
            </div>
        </div>
    );
}