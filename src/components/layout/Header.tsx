'use client';

import { ShoppingCart, Bell, User, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import { useShop } from '@/context/ShopContext';
// import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/search/SearchBar";
import { useState } from "react";

export default function Header() {
    const router = useRouter();
    const { user, cart, setUser, clearCart } = useShop();
    const [showDropdown, setShowDropdown] = useState(false);
    const pathname = usePathname();
    // const { user, logout } = useAuth();

    const isActive = (path: string) =>
        pathname === path ? "text-orange-500 font-semibold" : "text-gray-700";

    const handleLogout = () => {
        setUser(null);
        clearCart();
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        alert('Đã đăng xuất!');
        router.push('/');
        setShowDropdown(false);
    };

    const handleLinkClick = () => {
        setShowDropdown(false);
    };

    return (
        <header className="bg-white shadow-sm">
            {/* TOP BAR + SEARCH */}
            <div className="bg-orange-500 text-white">
                <div className="max-w-7xl mx-auto px-4">

                    {/* TOP BAR */}
                    <div className="flex justify-between items-center py-2 text-sm">
                        <div className="flex gap-4">
                            <span>Kênh Người Bán</span>
                            <span>Trở thành Người bán MyShop</span>
                            <span>Tải ứng dụng</span>
                        </div>

                        {/* User menu */}
                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                            >

                                {/* Nút kích hoạt (Trigger) */}
                                <div className="flex items-center gap-2 text-white hover:bg-orange-600 px-3 py-2 rounded-lg transition cursor-pointer">
                                    {/* Avatar bên cạnh username */}
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="font-medium max-w-[120px] truncate hidden md:inline">
                                        {user.username || user.name || user.email?.split('@')[0]}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Dropdown menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-0 pt-1 w-48 bg-white rounded-lg shadow-xl py-2 z-50 top-full">
                                        <Link
                                            href="/account/profile"
                                            onClick={handleLinkClick}
                                            className="block px-4 py-2 text-gray-800 hover:bg-orange-50 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>Tài Khoản Của Tôi</span>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            onClick={handleLinkClick}
                                            className="block px-4 py-2 text-gray-800 hover:bg-orange-50 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span>Đơn Hàng Của Tôi</span>
                                            </div>
                                        </Link>

                                        {/* Admin Panel Link - Only show for admin users */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowDropdown(false);

                                                if (user) {
                                                    const isAdmin = user.isAdmin === true || user.role === 'admin';

                                                    if (isAdmin) {
                                                        router.push('/admin');
                                                    } else {
                                                        alert('Bạn không có quyền truy cập admin');
                                                    }
                                                } else {
                                                    alert('Vui lòng đăng nhập');
                                                }
                                            }}
                                            className="w-full text-left px-4 py-2 text-purple-600 hover:bg-purple-50 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-medium">Quản Trị Admin</span>
                                            </div>
                                        </button>

                                        <hr className="my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Đăng xuất</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 text-white hover:bg-orange-600 px-4 py-2 rounded-lg transition font-medium"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">Đăng nhập</span>
                            </Link>
                        )}
                    </div>

                    {/* SEARCH BAR */}
                    <div className="flex items-center justify-between py-4">

                        {/* LOGO */}
                        <div
                            className="text-2xl font-bold cursor-pointer mr-8"
                            onClick={() => router.push("/")}
                        >
                            MyShop
                        </div>

                        {/* SEARCH */}
                        <div className="flex-1 max-w-3xl">
                            <SearchBar />
                        </div>

                        {/* CART - ✅ Added cart count badge */}
                        <div className="ml-8 relative cursor-pointer" onClick={() => router.push("/cart")}>
                            <ShoppingCart className="w-7 h-7 hover:opacity-80" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* MENU */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 flex justify-center gap-12 py-4">
                    <Link href="/" className={isActive("/")}>Trang chủ</Link>
                    <Link href="/products" className={isActive("/products")}>Sản phẩm</Link>
                    <Link href="/vouchers" className={isActive("/vouchers")}>Khuyến mãi</Link>
                    <Link href="/news" className={isActive("/news")}>Tin tức</Link>
                    <Link href="/contact" className={isActive("/contact")}>Liên hệ</Link>
                </div>
            </nav>
        </header>
    );
}
