'use client';

import { useEffect, useState } from 'react';
import { fetchAvailableVouchers } from '@/services/voucherApi';
import { fetchActiveCategories } from '@/services/categoriesApi';
import { VoucherResponse } from '@/types/voucher';

export function useVoucherPageData(userId: number) {
    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            const [vouchersRes, categoriesRes] = await Promise.all([
                fetchAvailableVouchers(userId || 0), // ✅ Vẫn gọi API dù userId = 0
                fetchActiveCategories(),
            ]);

            if (vouchersRes?.success) {
                setVouchers(vouchersRes.data);
            }

            if (categoriesRes?.success) {
                setCategories(categoriesRes.data);
            }

            setLoading(false);
        }

        loadData();
    }, [userId]); // ✅ Bỏ điều kiện if (!userId) return;

    return {
        vouchers,
        categories,
        loading,
        setVouchers,
    };
}