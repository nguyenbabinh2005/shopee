'use client';

import { useEffect, useState } from 'react';

interface PopupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PopupModal({ isOpen, onClose }: PopupModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(isOpen);
    }, [isOpen]);

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
                show ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Popup Container - Compact Size */}
            <div
                className={`relative w-[436px] h-[544px] bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl text-center shadow-[0_20px_60px_rgba(255,85,0,0.4)] transform transition-all duration-300 ${
                    show ? 'scale-100' : 'scale-90'
                } overflow-hidden flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-28 h-28 bg-pink-300 rounded-full opacity-20 blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Sparkles */}
                <div className="absolute top-6 right-12 text-yellow-300 text-xl animate-bounce">✨</div>
                <div className="absolute top-12 left-10 text-yellow-200 text-lg animate-bounce" style={{animationDelay: '0.3s'}}>⭐</div>
                <div className="absolute bottom-20 right-16 text-pink-200 text-lg animate-bounce" style={{animationDelay: '0.6s'}}>💫</div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg hover:scale-110 hover:rotate-90 z-10"
                >
                    <span className="text-2xl font-light">×</span>
                </button>

                {/* Top Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-red-600 font-black text-xs px-5 py-1.5 rounded-full shadow-xl border-2 border-white animate-pulse">
                        🔥 MEGA SALE 🔥
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative flex-1 flex flex-col justify-center px-8 py-6">
                    {/* Logo */}
                    <div className="mb-6">
                        <div className="inline-block relative">
                            <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-40"></div>
                            <div className="relative bg-white rounded-full p-4 shadow-xl">
                                <svg className="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21.5 8.5l-9-6-9 6V20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8.5zm-9 10c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
                                    <circle cx="12" cy="13.5" r="2.5" fill="white"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-black text-white mb-2 drop-shadow-2xl leading-tight">
                        🎊 KHUYẾN MÃI<br/>
                        <span className="text-4xl bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
                            SIÊU KHỦNG
                        </span> 🎊
                    </h2>

                    {/* Subtitle */}
                    <div className="mb-6">
                        <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                            <p className="text-white text-sm font-bold">⏰ Từ 26.10 - 25.11</p>
                        </div>
                        <p className="text-yellow-200 font-bold text-xs mt-2 animate-pulse">
                            ⚡ Số lượng có hạn - Đừng bỏ lỡ! ⚡
                        </p>
                    </div>

                    {/* Offers Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {/* Free Ship */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-orange-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative bg-white rounded-2xl p-3 shadow-xl hover:shadow-orange-300 transition-all hover:scale-105 transform duration-200 border-2 border-white">
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">HOT</div>
                                <div className="text-3xl mb-1">🚚</div>
                                <div className="text-[10px] font-bold text-orange-600 mb-1">FREESHIP</div>
                                <div className="text-2xl font-black text-orange-500">35K</div>
                                <div className="text-[9px] text-gray-600 font-semibold">ĐỒNG</div>
                            </div>
                        </div>

                        {/* Voucher */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-red-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative bg-white rounded-2xl p-3 shadow-xl hover:shadow-red-300 transition-all hover:scale-105 transform duration-200 border-2 border-white">
                                <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</div>
                                <div className="text-3xl mb-1">🎫</div>
                                <div className="text-[10px] font-bold text-red-600 mb-1">VOUCHER TỚI</div>
                                <div className="text-2xl font-black text-red-500">4.3K</div>
                                <div className="text-[9px] text-gray-600 font-semibold">ĐỒNG</div>
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-purple-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative bg-white rounded-2xl p-3 shadow-xl hover:shadow-purple-300 transition-all hover:scale-105 transform duration-200 border-2 border-white">
                                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">SALE</div>
                                <div className="text-3xl mb-1">💥</div>
                                <div className="text-[10px] font-bold text-purple-600 mb-1">GIẢM GIÁ</div>
                                <div className="text-2xl font-black text-red-600">45%</div>
                                <div className="text-[9px] text-gray-600 font-semibold">OFF</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onClose}
                        className="bg-white text-orange-600 font-black text-base px-8 py-3 rounded-full shadow-xl hover:scale-105 transform duration-300 hover:shadow-2xl"
                    >
                        🛒 MUA SẮM NGAY 🛒
                    </button>

                    {/* Fine Print */}
                    <p className="text-white/90 text-[10px] font-medium mt-4 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block">
                        ⚡ Áp dụng cho đơn hàng từ 0đ • Chi tiết tại Kênh Khuyến Mãi
                    </p>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300"></div>
            </div>
        </div>
    );
}