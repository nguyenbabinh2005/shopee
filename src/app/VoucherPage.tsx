'use client';

import React, { useState, useEffect } from 'react';
import { fetchAvailableVouchers, saveVoucherForUser } from './services/voucherApi';
import Header from './components/Header';
import PageHeader from './components/PageHeader';
import VoucherCard from './components/VoucherCard';
import { fetchActiveCategories } from './services/categoriesApi';

interface VoucherPageProps {
    userId?: number;
    isLoggedIn: boolean;
    userInfo: any;
    onLoginClick: () => void;
    onLogout: () => void;
}

export default function VoucherPage({ userId, isLoggedIn, userInfo, onLoginClick, onLogout }: VoucherPageProps) {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [vouchersRes, categoriesRes] = await Promise.all([
                fetchAvailableVouchers(),
                fetchActiveCategories()
            ]);

            if (vouchersRes.success) setVouchers(vouchersRes.data);
            if (categoriesRes.success) setCategories(categoriesRes.data);

            setLoading(false);
        }
        loadData();
    }, []);

    const handleSaveVoucher = async (voucherId: number) => {
        if (!isLoggedIn || !userId) {
            alert("Vui lòng đăng nhập để lưu voucher!");
            onLoginClick();
            return;
        }

        const result = await saveVoucherForUser(voucherId, userId);
        if (result.success) {
            alert("Đã lưu voucher thành công!");
        } else {
            alert("Lưu voucher thất bại!");
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
                onLoginClick={onLoginClick}
                onLogout={onLogout}
            />

            <PageHeader title="Kho Voucher" />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vouchers.map((voucher, idx) => (
                        <VoucherCard
                            key={voucher.id || idx}
                            voucher={voucher}
                            onSave={handleSaveVoucher}
                        />
                    ))}
                </div>

                {vouchers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Không có voucher nào khả dụng
                    </div>
                )}
            </div>
        </div>
    );
}