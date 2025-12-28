'use client';

import React, { useState, useEffect } from 'react';
import { fetchActiveCategories } from './services/categoriesApi';
import {
    fetchProducts,
    fetchFlashSaleProducts,
    fetchTopSearchProducts,
    ProductSearchResponse,
    productApiService
} from './services/productsApi';
import { useRouter, useSearchParams } from 'next/navigation';

// Import components
import Header from './components/Header';
import ServicesBar from './components/ServicesBar';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import TopSearch from './components/TopSearch';
import ProductGrid from './components/ProductGrid';
import BannerSlider from "./components/BannerSlider";
import PopupModal from "./components/PopupModal";

interface Product {
    productId: number;
    name: string;
    originalPrice: number;
    finalPrice: number;
    imageUrl?: string;
    totalPurchaseCount?: number;
    rating?: number;
    discount?: number;
}

interface Category {
    id: number;
    name: string;
    icon?: string;
}

interface UserInfo {
    username: string;
    email?: string;
    userId?: number;
}

export function ShopeeHomepage() {
    const [showPopup, setShowPopup] = useState(false);
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const [topSelling, setTopSelling] = useState<ProductSearchResponse[]>([]);
    const [searchResults, setSearchResults] = useState<ProductSearchResponse[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({hours: 2, minutes: 0, seconds: 0});
    const [flashSaleIndex, setFlashSaleIndex] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState(18);

    const [categories, setCategories] = useState<Category[]>([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [topSearchProducts, setTopSearchProducts] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Login states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch(searchTerm);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchTerm]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            const results = await productApiService.searchProducts(query);
            setSearchResults(results.map(normalizeProduct));
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const toNumber = (v: any): number => {
        if (v === null || v === undefined) return 0;
        const num = typeof v === "number" ? v : Number(v);
        return isNaN(num) ? 0 : num;
    };

    const normalizeProduct = (p: any) => {
        const normalized = {
            ...p,
            originalPrice: toNumber(p.originalPrice),
            discountAmount: toNumber(p.discountAmount),
            finalPrice: toNumber(p.finalPrice),
            totalPurchaseCount: toNumber(p.totalPurchaseCount ?? 0),
            rating: p.rating ?? 4.8,
            imageUrl: p.imageUrl && p.imageUrl.trim() ? p.imageUrl : "https://via.placeholder.com/400x400?text=No+Image",
        };

        return normalized;
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowPopup(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        async function fetchAllData() {
            setLoading(true);

            const [categoriesRes, flashSaleRes, topSellingRes, topProductsRes] = await Promise.all([
                fetchActiveCategories(),
                fetchFlashSaleProducts(),
                fetchProducts(1, 36),      // API top-selling → Sản phẩm bán chạy
                fetchTopSearchProducts()    // API top → Gợi ý hôm nay
            ]);

            if (categoriesRes.success) setCategories(categoriesRes.data);
            if (flashSaleRes.success) setFlashSaleProducts(flashSaleRes.data);

            // ✅ topSellingRes → Sản phẩm bán chạy (TopSearch component)
            if (topSellingRes.success) {
                setTopSearchProducts([...topSellingRes.data]);
            }

            // ✅ topProductsRes → Gợi ý hôm nay (ProductGrid component)
            if (topProductsRes.success) {
                setProducts([...topProductsRes.data]);
            }

            setLoading(false);
        }

        fetchAllData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let {hours, minutes, seconds} = prev;
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    hours = 2;
                    minutes = 0;
                    seconds = 0;
                }
                return {hours, minutes, seconds};
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const savedLoginState = localStorage.getItem('isLoggedIn');
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedLoginState === 'true' && savedUserInfo) {
            setIsLoggedIn(true);
            setUserInfo(JSON.parse(savedUserInfo));
        }
    }, []);

    const handleLoginClick = () => {
        router.push('/auth');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserInfo(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
    };

    const loadMoreProducts = async () => {
        const nextPage = Math.floor(visibleProducts / 18) + 1;
        const moreProducts = await fetchProducts(nextPage, 18);

        if (moreProducts.success) {
            setProducts(prev => [...prev, ...moreProducts.data]);
            setVisibleProducts(prev => prev + 18);
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
            <PopupModal
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
            />
            <Header
                categories={categories}
                isLoggedIn={isLoggedIn}
                userInfo={userInfo}
                onLoginClick={handleLoginClick}
                onLogout={handleLogout}
            />

            <div className="bg-gray-100 py-4"></div>

            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <BannerSlider />
                    <ServicesBar />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <Categories categories={categories} />

                <FlashSale
                    products={flashSaleProducts}
                    timeLeft={timeLeft}
                    currentIndex={flashSaleIndex}
                    onPrev={() => flashSaleIndex > 0 && setFlashSaleIndex(prev => prev - 1)}
                    onNext={() => flashSaleIndex < flashSaleProducts.length - 6 && setFlashSaleIndex(prev => prev + 1)}
                />

                {/* ✅ Sản phẩm bán chạy - Component tự quản lý state */}
                <TopSearch products={topSearchProducts} />

                {/* ✅ Gợi ý hôm nay */}
                <ProductGrid
                    products={products}
                    visibleCount={visibleProducts}
                    onLoadMore={loadMoreProducts}
                />
            </div>
        </div>
    );
}