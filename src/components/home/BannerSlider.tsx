'use client';

import { useState, useEffect } from 'react';

/* ================== DATA BANNER ================== */
const banners = [
    {
        id: 1,
        imageUrl: 'http://localhost:8080/images/banner/home/banner1.jpg',
        alt: 'FLASH SALE 12.12',
        page: 'home'
    },
    {
        id: 2,
        imageUrl: 'http://localhost:8080/images/banner/home/banner2.jpg',
        alt: 'MIỄN PHÍ VẬN CHUYỂN',
        page: 'home'
    },
    {
        id: 3,
        imageUrl: 'http://localhost:8080/images/banner/home/banner3.jpg',
        alt: 'VOUCHER 500K',
        page: 'home'
    },
    {
        id: 4,
        imageUrl: 'http://localhost:8080/images/banner/flashsale/banner1.jpg',
        alt: 'FlashSale',
        page: 'flashsale'
    }
] as const;

type PageType = 'home' | 'flashsale';

interface BannerSliderProps {
    page: PageType;
}

/* ================== COMPONENT ================== */
export default function BannerSlider({ page }: BannerSliderProps) {
    const filteredBanners = banners.filter(b => b.page === page);
    const [currentIndex, setCurrentIndex] = useState(0);

    /* ===== AUTO SLIDE ===== */
    useEffect(() => {
        if (filteredBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev =>
                prev === filteredBanners.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [filteredBanners.length]);

    /* ===== HANDLERS ===== */
    const goToPrevious = () => {
        setCurrentIndex(prev =>
            prev === 0 ? filteredBanners.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex(prev =>
            prev === filteredBanners.length - 1 ? 0 : prev + 1
        );
    };

    if (filteredBanners.length === 0) return null;

    /* ================== RENDER ================== */
    return (
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg group">
            {/* SLIDES */}
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {filteredBanners.map(banner => (
                    <div key={banner.id} className="min-w-full">
                        <img
                            src={banner.imageUrl}
                            alt={banner.alt}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* PREVIOUS */}
            {filteredBanners.length > 1 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* NEXT */}
            {filteredBanners.length > 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* DOTS */}
            {filteredBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {filteredBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all duration-300 rounded-full ${
                                currentIndex === index
                                    ? 'bg-orange-500 w-8 h-2'
                                    : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
