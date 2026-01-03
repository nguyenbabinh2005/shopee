'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import VoucherCard from '@/components/card/VoucherCard';
import Breadcrumb from '@/components/navigation/Breadcrumb';

import { saveVoucherForUser } from '@/services/voucherApi';
import { useVoucherPageData } from '@/hooks/useVoucherPageData';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';

export default function VoucherPage() {
    const { user } = useShop();
    const router = useRouter();

    // ✅ truyền userId vào hook
    const { vouchers, categories, loading, setVouchers } = useVoucherPageData(user?.userId || 0);

    const handleSaveVoucher = async (voucherId: number) => {
        if (!user || !user.userId) {
            alert('Vui lòng đăng nhập để lưu voucher!');
            router.push('/login');
            return;
        }

        const result = await saveVoucherForUser(voucherId, user.userId);

        if (result?.success) {
            alert('Đã lưu voucher thành công!');

            // ✅ cập nhật voucher đã lưu
            setVouchers(prev =>
                prev.map(v =>
                    v.voucherId === voucherId
                        ? { ...v, isSaved: true }
                        : v
                )
            );
        } else {
            alert(result?.message || 'Lưu voucher thất bại!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-2xl text-orange-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header

            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <Breadcrumb items={[{ label: 'Kho Voucher' }]} />
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Kho Voucher</h1>
                <p className="text-gray-600 mb-8">Lưu voucher để sử dụng khi mua sắm</p>

                {vouchers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Không có voucher nào khả dụng
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vouchers.map(voucher => (
                            <VoucherCard
                                key={voucher.voucherId} // ✅ dùng voucherId
                                voucher={voucher}
                                onSave={handleSaveVoucher}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
