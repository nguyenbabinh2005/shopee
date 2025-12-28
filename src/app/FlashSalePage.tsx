'use client';

import React, { useState, useEffect } from 'react';
import { fetchActiveFlashSales, fetchUpcomingFlashSales } from './services/flashsalesApi';
import { fetchActiveCategories } from './services/categoriesApi';
import Header from './components/Header';
import PageHeader from './components/PageHeader';
import BannerSlider from './components/BannerSlider'; // ✅ Thêm import
import FlashSaleCard from './components/FlashSaleCard';

interface FlashSalePageProps {
    isLoggedIn: boolean;
    userInfo: any;
    onLoginClick: () => void;
    onLogout: () => void;
}

export default function FlashSalePage({ isLoggedIn, userInfo, onLoginClick, onLogout }: FlashSalePageProps) {
    const [activeFlashSales, setActiveFlashSales] = useState<any[]>([]);
    const [upcomingFlashSales, setUpcomingFlashSales] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [activeResult, upcomingResult, categoriesRes] = await Promise.all([
                fetchActiveFlashSales(),
                fetchUpcomingFlashSales(),
                fetchActiveCategories()
            ]);

            if (activeResult.success) setActiveFlashSales(activeResult.data);
            if (upcomingResult.success) setUpcomingFlashSales(upcomingResult.data);
            if (categoriesRes.success) setCategories(categoriesRes.data);

            setLoading(false);
        }
        loadData();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-2xl text-orange-500">Đang tải...</div>
            </div>
        );
    }

    const displayFlashSales = activeTab === 'active' ? activeFlashSales : upcomingFlashSales;

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                categories={categories}
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                onLoginClick={onLoginClick}
                onLogout={onLogout}
            />

            {/* Title Flash Sale */}
            <div className="bg-white py-6 shadow-sm">
                <h1 className="text-3xl font-bold text-center text-orange-500">
                    ⚡ FLASH SALE
                </h1>
            </div>

            {/* ✅ Thêm BannerSlider */}
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

                {/* Flash Sales */}
                {displayFlashSales.map((flashSale, fsIdx) => (
                    <FlashSaleCard
                        key={flashSale.flashSaleId || fsIdx}
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