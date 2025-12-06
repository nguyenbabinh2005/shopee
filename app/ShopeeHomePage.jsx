"use client"
import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function ShopeeHomepage() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 56 });
    const [flashSaleIndex, setFlashSaleIndex] = useState(0);
    const [topSearchIndex, setTopSearchIndex] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState(18);
    const [showBannerControls, setShowBannerControls] = useState(false);

    const banners = [
        { id: 1, color: 'bg-gradient-to-r from-orange-400 to-pink-500', text: 'FLASH SALE 12.12' },
        { id: 2, color: 'bg-gradient-to-r from-purple-400 to-blue-500', text: 'MIỄN PHÍ VẬN CHUYỂN' },
        { id: 3, color: 'bg-gradient-to-r from-green-400 to-teal-500', text: 'VOUCHER 500K' }
    ];

    // Auto slide banner every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    // Countdown timer for Flash Sale
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;

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
                    // Reset when countdown reaches 0
                    hours = 2;
                    minutes = 0;
                    seconds = 0;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const categories = [
        { name: 'Thời Trang Nam', icon: '👔' },
        { name: 'Điện Thoại', icon: '📱' },
        { name: 'Thiết Bị Điện Tử', icon: '💻' },
        { name: 'Máy Tính', icon: '🖥️' },
        { name: 'Nhà Cửa', icon: '🏠' },
        { name: 'Thể Thao', icon: '⚽' },
        { name: 'Ô Tô', icon: '🚗' },
        { name: 'Thời Trang Nữ', icon: '👗' },
        { name: 'Mẹ & Bé', icon: '👶' },
        { name: 'Làm Đẹp', icon: '💄' }
    ];

    const flashSaleProducts = [
        { id: 1, name: 'Áo thun nam basic', price: '99.000đ', oldPrice: '299.000đ', discount: '67%', sold: 234, image: 'bg-blue-200' },
        { id: 2, name: 'Giày sneaker nữ', price: '199.000đ', oldPrice: '499.000đ', discount: '60%', sold: 156, image: 'bg-pink-200' },
        { id: 3, name: 'Tai nghe bluetooth', price: '149.000đ', oldPrice: '399.000đ', discount: '63%', sold: 892, image: 'bg-purple-200' },
        { id: 4, name: 'Ốp lưng iPhone', price: '29.000đ', oldPrice: '99.000đ', discount: '71%', sold: 445, image: 'bg-green-200' },
        { id: 5, name: 'Balo laptop', price: '199.000đ', oldPrice: '599.000đ', discount: '67%', sold: 178, image: 'bg-yellow-200' },
        { id: 6, name: 'Đồng hồ thông minh', price: '299.000đ', oldPrice: '999.000đ', discount: '70%', sold: 567, image: 'bg-red-200' },
        { id: 7, name: 'Túi xách mini', price: '89.000đ', oldPrice: '299.000đ', discount: '70%', sold: 321, image: 'bg-indigo-200' },
        { id: 8, name: 'Kính mát thời trang', price: '59.000đ', oldPrice: '199.000đ', discount: '70%', sold: 654, image: 'bg-cyan-200' },
        { id: 9, name: 'Dây chuyền bạc', price: '129.000đ', oldPrice: '399.000đ', discount: '68%', sold: 432, image: 'bg-rose-200' },
        { id: 10, name: 'Mũ lưỡi trai', price: '39.000đ', oldPrice: '129.000đ', discount: '70%', sold: 876, image: 'bg-amber-200' },
        { id: 11, name: 'Ví nam da cao cấp', price: '159.000đ', oldPrice: '499.000đ', discount: '68%', sold: 234, image: 'bg-teal-200' },
        { id: 12, name: 'Loa bluetooth mini', price: '179.000đ', oldPrice: '599.000đ', discount: '70%', sold: 543, image: 'bg-lime-200' }
    ];

    const topSearchProducts = [
        { rank: 1, keyword: 'Áo khoác', image: 'bg-gradient-to-br from-blue-300 to-blue-400' },
        { rank: 2, keyword: 'Giày sneaker', image: 'bg-gradient-to-br from-pink-300 to-pink-400' },
        { rank: 3, keyword: 'Tai nghe', image: 'bg-gradient-to-br from-purple-300 to-purple-400' },
        { rank: 4, keyword: 'Túi xách', image: 'bg-gradient-to-br from-green-300 to-green-400' },
        { rank: 5, keyword: 'Đồng hồ', image: 'bg-gradient-to-br from-yellow-300 to-yellow-400' },
        { rank: 6, keyword: 'Son môi', image: 'bg-gradient-to-br from-red-300 to-red-400' },
        { rank: 7, keyword: 'Quần jean', image: 'bg-gradient-to-br from-indigo-300 to-indigo-400' },
        { rank: 8, keyword: 'Dép sandal', image: 'bg-gradient-to-br from-cyan-300 to-cyan-400' },
        { rank: 9, keyword: 'Balo laptop', image: 'bg-gradient-to-br from-orange-300 to-orange-400' },
        { rank: 10, keyword: 'Mỹ phẩm', image: 'bg-gradient-to-br from-rose-300 to-rose-400' },
        { rank: 11, keyword: 'Áo thun', image: 'bg-gradient-to-br from-teal-300 to-teal-400' },
        { rank: 12, keyword: 'Kính mát', image: 'bg-gradient-to-br from-lime-300 to-lime-400' }
    ];

    const products = [
        { id: 1, name: 'Áo khoác dù nam nữ unisex form rộng', price: '125.000đ', sold: '2.3k', rating: 4.8, image: 'bg-indigo-200' },
        { id: 2, name: 'Set đồ nữ áo croptop quần short', price: '89.000đ', sold: '5.1k', rating: 4.9, image: 'bg-pink-300' },
        { id: 3, name: 'Giày thể thao nam nữ sneaker', price: '179.000đ', sold: '1.8k', rating: 4.7, image: 'bg-slate-300' },
        { id: 4, name: 'Bộ mỹ phẩm dưỡng da cao cấp', price: '399.000đ', sold: '890', rating: 4.9, image: 'bg-rose-200' },
        { id: 5, name: 'Túi xách nữ thời trang', price: '159.000đ', sold: '3.2k', rating: 4.6, image: 'bg-amber-200' },
        { id: 6, name: 'Dây cáp sạc nhanh Type-C', price: '25.000đ', sold: '12k', rating: 4.8, image: 'bg-emerald-200' },
        { id: 7, name: 'Nón kết nam nữ thêu chữ', price: '45.000đ', sold: '4.5k', rating: 4.7, image: 'bg-cyan-200' },
        { id: 8, name: 'Quần jean nam ống rộng', price: '199.000đ', sold: '1.5k', rating: 4.8, image: 'bg-blue-300' },
        { id: 9, name: 'Váy maxi hoa nhí', price: '149.000đ', sold: '2.1k', rating: 4.7, image: 'bg-purple-200' },
        { id: 10, name: 'Áo sơ mi trắng công sở', price: '119.000đ', sold: '3.4k', rating: 4.8, image: 'bg-gray-200' },
        { id: 11, name: 'Dép lê quai ngang', price: '69.000đ', sold: '6.7k', rating: 4.6, image: 'bg-orange-200' },
        { id: 12, name: 'Khăn choàng len mùa đông', price: '79.000đ', sold: '1.9k', rating: 4.7, image: 'bg-red-200' },
        { id: 13, name: 'Đồ bộ thể thao nam nữ', price: '139.000đ', sold: '2.8k', rating: 4.8, image: 'bg-teal-200' },
        { id: 14, name: 'Kính cận gọng tròn', price: '99.000đ', sold: '4.2k', rating: 4.5, image: 'bg-lime-200' },
        { id: 15, name: 'Bình giữ nhiệt inox', price: '89.000đ', sold: '5.5k', rating: 4.9, image: 'bg-sky-200' },
        { id: 16, name: 'Vòng tay phong thủy', price: '59.000đ', sold: '3.1k', rating: 4.6, image: 'bg-violet-200' },
        { id: 17, name: 'Áo hoodie form rộng', price: '169.000đ', sold: '2.7k', rating: 4.8, image: 'bg-fuchsia-200' },
        { id: 18, name: 'Giày cao gót nữ 5cm', price: '199.000đ', sold: '1.3k', rating: 4.7, image: 'bg-pink-200' },
        { id: 19, name: 'Balo mini nữ thời trang', price: '129.000đ', sold: '4.1k', rating: 4.6, image: 'bg-blue-200' },
        { id: 20, name: 'Nước hoa nam 50ml', price: '249.000đ', sold: '980', rating: 4.9, image: 'bg-purple-300' },
        { id: 21, name: 'Kem dưỡng da ban đêm', price: '159.000đ', sold: '2.4k', rating: 4.8, image: 'bg-rose-300' },
        { id: 22, name: 'Tai nghe có dây jack 3.5', price: '39.000đ', sold: '8.2k', rating: 4.5, image: 'bg-slate-200' },
        { id: 23, name: 'Áo polo nam cao cấp', price: '149.000đ', sold: '1.9k', rating: 4.7, image: 'bg-green-200' },
        { id: 24, name: 'Váy dự tiệc sang trọng', price: '299.000đ', sold: '760', rating: 4.8, image: 'bg-amber-300' },
        { id: 25, name: 'Giày thể thao chạy bộ', price: '219.000đ', sold: '3.5k', rating: 4.9, image: 'bg-cyan-300' },
        { id: 26, name: 'Balo laptop 15.6 inch', price: '189.000đ', sold: '2.2k', rating: 4.7, image: 'bg-indigo-300' },
        { id: 27, name: 'Mặt nạ ngủ dưỡng da', price: '79.000đ', sold: '5.3k', rating: 4.6, image: 'bg-pink-300' },
        { id: 28, name: 'Quần short thể thao nam', price: '89.000đ', sold: '4.8k', rating: 4.7, image: 'bg-teal-300' },
        { id: 29, name: 'Đồng hồ nam dây da', price: '299.000đ', sold: '1.1k', rating: 4.8, image: 'bg-orange-300' },
        { id: 30, name: 'Túi đeo chéo unisex', price: '139.000đ', sold: '3.6k', rating: 4.6, image: 'bg-lime-300' },
        { id: 31, name: 'Son kem lì 12 màu', price: '69.000đ', sold: '7.1k', rating: 4.8, image: 'bg-red-300' },
        { id: 32, name: 'Áo ba lỗ tập gym', price: '59.000đ', sold: '5.9k', rating: 4.5, image: 'bg-gray-300' },
        { id: 33, name: 'Kính râm gọng vuông', price: '99.000đ', sold: '2.8k', rating: 4.7, image: 'bg-sky-300' },
        { id: 34, name: 'Dép đi trong nhà êm ái', price: '49.000đ', sold: '9.2k', rating: 4.6, image: 'bg-violet-300' },
        { id: 35, name: 'Áo khoác jean unisex', price: '189.000đ', sold: '1.6k', rating: 4.8, image: 'bg-blue-400' },
        { id: 36, name: 'Loa bluetooth không dây', price: '159.000đ', sold: '3.3k', rating: 4.9, image: 'bg-emerald-300' }
    ];

    const nextBanner = () => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
    };

    const prevBanner = () => {
        setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const nextFlashSale = () => {
        if (flashSaleIndex < flashSaleProducts.length - 6) {
            setFlashSaleIndex(prev => prev + 1);
        }
    };

    const prevFlashSale = () => {
        if (flashSaleIndex > 0) {
            setFlashSaleIndex(prev => prev - 1);
        }
    };

    const nextTopSearch = () => {
        if (topSearchIndex < topSearchProducts.length - 6) {
            setTopSearchIndex(prev => prev + 1);
        }
    };

    const prevTopSearch = () => {
        if (topSearchIndex > 0) {
            setTopSearchIndex(prev => prev - 1);
        }
    };

    const loadMoreProducts = () => {
        setVisibleProducts(prev => Math.min(prev + 18, products.length));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Top bar */}
                    <div className="flex justify-between items-center py-2 text-sm">
                        <div className="flex gap-4">
                            <span className="cursor-pointer hover:text-gray-200">Kênh Người Bán</span>
                            <span className="cursor-pointer hover:text-gray-200">Trở thành Người bán Shopee</span>
                            <span className="cursor-pointer hover:text-gray-200">Tải ứng dụng</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Bell className="w-5 h-5 cursor-pointer" />
                            <span className="cursor-pointer hover:text-gray-200">Đăng ký</span>
                            <span className="cursor-pointer hover:text-gray-200">Đăng nhập</span>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="pb-6 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold">Shopee</div>
                            <div className="flex-1">
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                                        className="flex-1 px-4 py-3 rounded-l-sm text-gray-800 outline-none"
                                    />
                                    <button className="bg-orange-600 hover:bg-orange-700 px-6 rounded-r-sm">
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>
                                {/* Popular searches */}
                                <div className="flex gap-2 mt-3 text-sm flex-wrap">
                                    <span className="cursor-pointer hover:text-gray-200">Áo Khoác</span>
                                    <span className="cursor-pointer hover:text-gray-200">Giày Thể Thao</span>
                                    <span className="cursor-pointer hover:text-gray-200">Túi Xách Nữ</span>
                                    <span className="cursor-pointer hover:text-gray-200">Đồng Hồ</span>
                                    <span className="cursor-pointer hover:text-gray-200">Dép</span>
                                    <span className="cursor-pointer hover:text-gray-200">Áo Thun</span>
                                    <span className="cursor-pointer hover:text-gray-200">Quần Jean</span>
                                    <span className="cursor-pointer hover:text-gray-200">Balo</span>
                                </div>
                            </div>
                            <ShoppingCart className="w-8 h-8 cursor-pointer hover:opacity-80" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacing */}
            <div className="bg-gray-100 py-4"></div>

            {/* Banner Carousel with Services - Full Width */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    {/* Banner */}
                    <div
                        className="relative h-64 overflow-hidden"
                        onMouseEnter={() => setShowBannerControls(true)}
                        onMouseLeave={() => setShowBannerControls(false)}
                    >
                        <div
                            className="flex h-full transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                        >
                            {banners.map((banner, idx) => (
                                <div
                                    key={banner.id}
                                    className={`${banner.color} min-w-full h-full flex items-center justify-center text-white text-4xl font-bold`}
                                >
                                    {banner.text}
                                </div>
                            ))}
                        </div>

                        {/* Left Arrow - Only show on hover */}
                        {showBannerControls && (
                            <button
                                onClick={prevBanner}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 px-2 py-8 transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                        )}

                        {/* Right Arrow - Only show on hover */}
                        {showBannerControls && (
                            <button
                                onClick={nextBanner}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 px-2 py-8 transition-all"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                        )}

                        {/* Banner indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentBanner(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        idx === currentBanner ? 'bg-white w-6' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Services Bar */}
                    <div className="p-4 border-t">
                        <div className="flex items-center justify-around">
                            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                                    SIÊU RẺ
                                </div>
                                <span className="text-xs text-center">Deal Từ 1.000Đ</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                                    FLASH
                                </div>
                                <span className="text-xs text-center">Deal Hot<br/>Giờ Vàng</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                                    STYLE
                                </div>
                                <span className="text-xs text-center">Shopee Style<br/>Voucher 30%</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                                    VND
                                </div>
                                <span className="text-xs text-center">Mã Giảm Giá</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Categories */}
                <div className="bg-white rounded-lg p-6 mb-6">
                    <h2 className="text-gray-500 uppercase text-sm mb-4">Danh Mục</h2>
                    <div className="grid grid-cols-10 gap-4">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="flex flex-col items-center cursor-pointer hover:text-orange-500 transition">
                                <div className="text-4xl mb-2">{cat.icon}</div>
                                <span className="text-xs text-center">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Flash Sale */}
                <div className="bg-white rounded-lg p-6 mb-6 relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-orange-500">FLASH SALE</h2>
                            <div className="flex gap-1">
                <span className="bg-black text-white px-2 py-1 rounded text-sm font-mono min-w-[2rem] text-center">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                                <span className="text-black">:</span>
                                <span className="bg-black text-white px-2 py-1 rounded text-sm font-mono min-w-[2rem] text-center">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                                <span className="text-black">:</span>
                                <span className="bg-black text-white px-2 py-1 rounded text-sm font-mono min-w-[2rem] text-center">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                            </div>
                        </div>
                        <button className="text-orange-500 hover:text-orange-600">Xem tất cả →</button>
                    </div>

                    {/* Left Arrow */}
                    {flashSaleIndex > 0 && (
                        <button
                            onClick={prevFlashSale}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {flashSaleIndex < flashSaleProducts.length - 6 && (
                        <button
                            onClick={nextFlashSale}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                    )}

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${flashSaleIndex * (100 / 6)}%)` }}
                        >
                            {flashSaleProducts.map((product) => (
                                <div key={product.id} className="min-w-[16.666%] px-2">
                                    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                                        <div className={`${product.image} h-32 relative`}>
                      <span className="absolute top-0 right-0 bg-yellow-400 text-xs px-2 py-1 font-bold">
                        {product.discount}
                      </span>
                                        </div>
                                        <div className="p-3">
                                            <div className="text-orange-500 font-bold text-lg">{product.price}</div>
                                            <div className="h-8 overflow-hidden">
                                                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-sm inline-block">
                                                    Đã bán {product.sold}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Search Section */}
                <div className="bg-white rounded-lg p-6 mb-6 relative">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-orange-500 font-bold uppercase">Tìm kiếm hàng đầu</h2>
                        <button className="text-orange-500 hover:text-orange-600 text-sm">Xem tất cả →</button>
                    </div>

                    {/* Left Arrow */}
                    {topSearchIndex > 0 && (
                        <button
                            onClick={prevTopSearch}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {topSearchIndex < topSearchProducts.length - 6 && (
                        <button
                            onClick={nextTopSearch}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                    )}

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${topSearchIndex * (100 / 6)}%)` }}
                        >
                            {topSearchProducts.map((item) => (
                                <div key={item.rank} className="min-w-[16.666%] px-2">
                                    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group">
                                        <div className={`${item.image} h-32 relative flex items-center justify-center text-white text-4xl font-bold`}>
                                            {item.rank}
                                        </div>
                                        <div className="p-2 bg-white">
                                            <div className="text-sm text-center truncate group-hover:text-orange-500">
                                                {item.keyword}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-gray-500 uppercase text-sm mb-4">Gợi Ý Hôm Nay</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {products.slice(0, visibleProducts).map((product) => (
                            <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                                <div className={`${product.image} h-40`}></div>
                                <div className="p-3">
                                    <div className="text-sm h-10 overflow-hidden mb-2">{product.name}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-orange-500 font-bold">{product.price}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span>{product.rating}</span>
                                        </div>
                                        <span>Đã bán {product.sold}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleProducts < products.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMoreProducts}
                                className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition font-medium"
                            >
                                Xem Thêm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}