'use client';

import { Search, ShoppingCart, Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    categories: any[];
    isLoggedIn: boolean;
    userInfo: { username: string; userId?: number } | null;
    onLoginClick: () => void;
    onLogout: () => void;
}

export default function Header({ categories, isLoggedIn, userInfo, onLoginClick, onLogout }: HeaderProps) {
    const router = useRouter();

    return (
        <header className="bg-orange-500 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-2 text-sm">
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-gray-200">Kênh Người Bán</span>
                        <span className="cursor-pointer hover:text-gray-200">Trở thành Người bán Shopee</span>
                        <span className="cursor-pointer hover:text-gray-200">Tải ứng dụng</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Bell className="w-5 h-5 cursor-pointer" />
                        {isLoggedIn ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{userInfo?.username}</span>
                                </div>
                                <span
                                    className="cursor-pointer hover:text-gray-200"
                                    onClick={onLogout}
                                >
                                    Đăng xuất
                                </span>
                            </>
                        ) : (
                            <>
                                <span
                                    className="cursor-pointer hover:text-gray-200"
                                    onClick={onLoginClick}
                                >
                                    Đăng ký
                                </span>
                                <span
                                    className="cursor-pointer hover:text-gray-200"
                                    onClick={onLoginClick}
                                >
                                    Đăng nhập
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="pb-6 pt-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="text-2xl font-bold cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            Shopee
                        </div>
                        <div className="flex-1">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                                    className="flex-1 px-4 py-3 rounded-l-sm text-gray-800 outline-none bg-white"
                                />
                                <button className="bg-orange-600 hover:bg-orange-700 px-6 rounded-r-sm">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 mt-3 text-sm flex-wrap">
                                {categories.slice(0, 8).map((cat, idx) => (
                                    <span key={idx} className="cursor-pointer hover:text-gray-200">
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <ShoppingCart className="w-8 h-8 cursor-pointer hover:opacity-80" />
                    </div>
                </div>
            </div>
        </header>
    );
}