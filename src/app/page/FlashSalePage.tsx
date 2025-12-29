'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BannerSlider from '@/components/home/BannerSlider';
import FlashSaleCard from '@/components/card/FlashSaleCard';

import { useFlashSalePageData } from '@/hooks/useFlashSalePageData';
import { useAuth } from '@/hooks/useAuth';

export default function FlashSalePage() {
    const { isLoggedIn, userInfo, logout } = useAuth();
    const { activeFlashSales, upcomingFlashSales, categories, loading } =
        useFlashSalePageData();

    const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-2xl text-orange-500">Đang tải...</div>
            </div>
        );
    }

    const displayFlashSales =
        activeTab === 'active' ? activeFlashSales : upcomingFlashSales;

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                categories={categories}
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                onLoginClick={() => {}}
                onLogout={logout}
            />

            {/* Title */}
            <div className="bg-white py-6 shadow-sm">
                <h1 className="text-3xl font-bold text-center text-orange-500">
                    ⚡ FLASH SALE
                </h1>
            </div>

            {/* Banner */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <BannerSlider />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 py-4 font-semibold transition ${
                                activeTab === 'active'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Đang Diễn Ra ({activeFlashSales.length})
                        </button>

                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 py-4 font-semibold transition ${
                                activeTab === 'upcoming'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Sắp Diễn Ra ({upcomingFlashSales.length})
                        </button>
                    </div>
                </div>

                {/* Flash sale list */}
                {displayFlashSales.map((flashSale, index) => (
                    <FlashSaleCard
                        key={flashSale.flashSaleId || index}
                        flashSale={flashSale}
                        isActive={activeTab === 'active'}
                    />
                ))}

                {displayFlashSales.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {activeTab === 'active'
                            ? 'Hiện không có Flash Sale nào đang diễn ra'
                            : 'Không có Flash Sale nào sắp diễn ra'}
                    </div>
                )}
            </div>
        </div>
    );
}
