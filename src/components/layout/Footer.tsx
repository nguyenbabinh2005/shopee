'use client';

import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            MyShop
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                                <span>172 Tôn Đức Thắng, Hàng Bột, Đống Đa, Hà Nội</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 flex-shrink-0 text-orange-500" />
                                <span>0852522JQK</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 flex-shrink-0 text-orange-500" />
                                <span>dobiet@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Về MyShop
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/about" className="hover:text-orange-500 transition">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-orange-500 transition">
                                    Tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-orange-500 transition">
                                    Điều khoản MyShop
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-orange-500 transition">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Chăm sóc khách hàng
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/help" className="hover:text-orange-500 transition">
                                    Trung tâm trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-orange-500 transition">
                                    Hướng dẫn mua hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-orange-500 transition">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li>
                                <Link href="/payment" className="hover:text-orange-500 transition">
                                    Phương thức thanh toán
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Theo dõi chúng tôi
                        </h3>
                        <div className="flex gap-3 mb-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>

                        {/* Payment Methods */}
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Phương thức thanh toán
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-gray-50 rounded p-2 flex items-center justify-center border border-gray-200">
                                <span className="text-xs font-semibold text-gray-600">VISA</span>
                            </div>
                            <div className="bg-gray-50 rounded p-2 flex items-center justify-center border border-gray-200">
                                <span className="text-xs font-semibold text-gray-600">COD</span>
                            </div>
                            <div className="bg-gray-50 rounded p-2 flex items-center justify-center border border-gray-200">
                                <span className="text-xs font-semibold text-gray-600">ATM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                        <p>© 2026 MyShop. Tất cả các quyền được bảo lưu.</p>
                        <p className="flex items-center gap-1">
                            Made with <span className="text-red-500">❤️</span> Bau
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
