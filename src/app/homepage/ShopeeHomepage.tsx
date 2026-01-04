'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// hooks
import { useHomepageData } from '@/hooks/useHomepageData';
import { useFlashSaleTimer } from '@/hooks/useFlashSaleTimer';
import { useAuth } from '@/hooks/useAuth';

// services
import { fetchProducts } from '@/services/productsApi';

// components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Categories from '@/components/home/Categories';
import FlashSale from '@/components/home/FlashSale';
import TopSearch from '@/components/home/TopSearch';
import ProductGrid from '@/components/home/ProductGrid';
import BannerSlider from '@/components/home/BannerSlider';
import PopupModal from '@/components/modal/PopupModal';

export default function ShopeeHomepage() {
    const router = useRouter();

    // Popup
    const [showPopup, setShowPopup] = useState(false);

    // Homepage data
    const {
        categories,
        flashSaleProducts,
        topSearchProducts,
        products,
        setProducts,
        loading,
    } = useHomepageData();

    // Flash sale
    const flashSaleEndTime = flashSaleProducts[0]?.endTime; // Lấy endTime từ flash sale đầu tiên
    const { timeLeft } = useFlashSaleTimer(flashSaleEndTime);
    const [flashSaleIndex, setFlashSaleIndex] = useState(0);

    // Product grid
    const [visibleProducts, setVisibleProducts] = useState(18);

    // Auth
    const { isLoggedIn, userInfo, logout } = useAuth();

    // Popup delay
    useEffect(() => {
        const timer = setTimeout(() => setShowPopup(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Load more products
    const loadMoreProducts = async () => {
        const nextPage = Math.floor(visibleProducts / 18) + 1;
        const res = await fetchProducts(nextPage, 18);

        if (res.success) {
            setProducts(prev => [...prev, ...res.data]);
            setVisibleProducts(prev => prev + 18);
        }
    };

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-2xl text-orange-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <PopupModal
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
            />

            <Header

            />

            <div className="bg-gray-100 py-4" />

            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <BannerSlider page='home' />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 flex-1">
                <Categories categories={categories} />

                <FlashSale
                    products={flashSaleProducts}
                    timeLeft={timeLeft}
                    currentIndex={flashSaleIndex}
                    onPrev={() =>
                        flashSaleIndex > 0 &&
                        setFlashSaleIndex(prev => prev - 1)
                    }
                    onNext={() =>
                        flashSaleIndex < flashSaleProducts.length - 6 &&
                        setFlashSaleIndex(prev => prev + 1)
                    }
                />

                {/* Sản phẩm bán chạy */}
                <TopSearch products={topSearchProducts} />

                {/* Gợi ý hôm nay */}
                <ProductGrid
                    products={products}
                    visibleCount={visibleProducts}
                    onLoadMore={loadMoreProducts}
                />
            </div>

            <Footer />
        </div>
    );
}
