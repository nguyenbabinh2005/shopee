'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import VoucherCard from '@/components/card/VoucherCard';

import { saveVoucherForUser } from '@/services/voucherApi';
import { useVoucherPageData } from '@/hooks/useVoucherPageData';
import { useAuth } from '@/hooks/useAuth';

export default function VoucherPage() {
    const { isLoggedIn, userInfo, userId, login, logout } = useAuth();

    // ✅ truyền userId vào hook
    const { vouchers, categories, loading, setVouchers } = useVoucherPageData(userId || 0);

    const handleSaveVoucher = async (voucherId: number) => {
        if (!isLoggedIn || !userId) {
            alert('Vui lòng đăng nhập để lưu voucher!');
            login();
            return;
        }

        const result = await saveVoucherForUser(voucherId, userId);

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
                categories={categories}
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                onLoginClick={login}
                onLogout={logout}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
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
