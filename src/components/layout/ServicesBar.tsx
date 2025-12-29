'use client';

import { useRouter } from 'next/navigation';

export default function ServicesBar() {
    const router = useRouter();

    return (
        <div className="p-4 border-t">
            <div className="flex items-center justify-around">
                <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                        SIÊU RẺ
                    </div>
                    <span className="text-xs text-center">Deal Từ 29.000Đ</span>
                </div>
                <div
                    className="flex flex-col items-center cursor-pointer hover:opacity-80 transition"
                    onClick={() => router.push('/flashsales')}
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                        FLASH
                    </div>
                    <span className="text-xs text-center">Deal Hot<br/>Giờ Vàng</span>
                </div>
                <div
                    className="flex flex-col items-center cursor-pointer hover:opacity-80 transition"
                    onClick={() => router.push('/vouchers')}
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xs">
                        VND
                    </div>
                    <span className="text-xs text-center">Mã Giảm Giá</span>
                </div>
            </div>
        </div>
    );
}