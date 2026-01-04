'use client';

import { ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useShop } from '@/context/ShopContext';
import { useState } from "react";

export default function ProductDetailHeader() {
    const router = useRouter();
    const { user, cart, setUser, clearCart } = useShop();
    const [showDropdown, setShowDropdown] = useState(false);

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
        <header className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo - Click to go home */}
                    <div
                        className="text-2xl font-bold cursor-pointer hover:opacity-90 transition"
                        onClick={() => router.push("/")}
                    >
                        Shopee
                    </div>

                    {/* Right side: Cart + User */}
                    <div className="flex items-center gap-6">
                        {/* Cart with count */}
                        <div
                            className="relative cursor-pointer hover:opacity-90 transition"
                            onClick={() => router.push("/cart")}
                        >
                            <ShoppingCart className="w-7 h-7" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            )}
                        </div>

                        {/* User menu */}
                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                            >
                                <div className="flex items-center gap-2 hover:bg-orange-600 px-3 py-2 rounded-lg transition cursor-pointer">
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
                                className="flex items-center gap-2 hover:bg-orange-600 px-4 py-2 rounded-lg transition font-medium"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">Đăng nhập</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
