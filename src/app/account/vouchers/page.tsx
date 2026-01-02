'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import AccountSidebar from '@/components/account/AccountSidebar';

import { fetchAvailableVouchers } from '@/services/voucherApi';
import { VoucherResponse } from '@/types/voucher';

import { Ticket, Calendar, ShoppingCart, Tag } from 'lucide-react';

type FilterType = 'all' | 'unused' | 'used' | 'expired';

export default function VouchersPage() {
    const { user } = useShop();
    const router = useRouter();

    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadVouchers();
    }, [user]);

    const loadVouchers = async () => {
        if (!user?.userId) return;

        try {
            setLoading(true);
            const res = await fetchAvailableVouchers(user.userId);

            if (res.success) {
                setVouchers(res.data);
            } else {
                setVouchers([]);
            }
        } catch (error) {
            console.error('Failed to load vouchers:', error);
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    };

    /* ================= FILTER ================= */
    const filteredVouchers = vouchers.filter(v => {
        if (filter === 'all') return true;
        if (filter === 'unused') return v.userVoucherStatus === 'unused';
        if (filter === 'used') return v.userVoucherStatus === 'used';
        if (filter === 'expired') return v.userVoucherStatus === 'expired';
        return true;
    });

    /* ================= HELPERS ================= */
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN');

    const formatDiscount = (voucher: VoucherResponse) => {
        if (voucher.discountType === 'percentage') {
            return `Giảm ${voucher.discountAmount}%`;
        }
        return `Giảm ${voucher.discountAmount.toLocaleString('vi-VN')}₫`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'unused':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Có thể dùng
                    </span>
                );
            case 'used':
                return (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                        Đã sử dụng
                    </span>
                );
            case 'expired':
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                        Hết hạn
                    </span>
                );
            default:
                return null;
        }
    };

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <AccountSidebar user={user} avatarPreview={user.avatar ?? null} />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">

                            {/* Header */}
                            <div className="border-b pb-4 mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Ticket className="w-6 h-6 text-orange-500" />
                                    Kho Voucher
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Quản lý voucher giảm giá của bạn
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 overflow-x-auto">
                                {[
                                    { key: 'all', label: 'Tất cả', count: vouchers.length },
                                    {
                                        key: 'unused',
                                        label: 'Có thể dùng',
                                        count: vouchers.filter(v => v.userVoucherStatus === 'unused').length
                                    },
                                    {
                                        key: 'used',
                                        label: 'Đã sử dụng',
                                        count: vouchers.filter(v => v.userVoucherStatus === 'used').length
                                    },
                                    {
                                        key: 'expired',
                                        label: 'Hết hạn',
                                        count: vouchers.filter(v => v.userVoucherStatus === 'expired').length
                                    },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilter(tab.key as FilterType)}
                                        className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                                            filter === tab.key
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            {/* Empty */}
                            {!loading && filteredVouchers.length === 0 && (
                                <div className="text-center py-12">
                                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">Không có voucher nào</p>
                                </div>
                            )}

                            {/* List */}
                            {!loading && filteredVouchers.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredVouchers.map(voucher => (
                                        <div
                                            key={voucher.voucherId}
                                            className={`border-2 rounded-lg p-4 ${
                                                voucher.userVoucherStatus === 'unused'
                                                    ? 'border-orange-200 bg-orange-50'
                                                    : 'border-gray-200 bg-gray-50 opacity-70'
                                            }`}
                                        >
                                            <div className="flex justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                                        <Tag className="text-white w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{voucher.code}</p>
                                                        <p className="text-xs text-gray-500">Mã voucher</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(voucher.userVoucherStatus)}
                                            </div>

                                            <p className="text-2xl font-bold text-orange-600 mb-2">
                                                {formatDiscount(voucher)}
                                            </p>

                                            {voucher.minOrderValue && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Đơn tối thiểu {voucher.minOrderValue.toLocaleString('vi-VN')}₫
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                HSD: {formatDate(voucher.endDate)}
                                            </div>

                                            {voucher.userVoucherStatus === 'unused' && (
                                                <button
                                                    onClick={() => router.push('/cart')}
                                                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg cursor-pointer"
                                                >
                                                    Dùng ngay
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
