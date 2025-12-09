"use client";

import { useState } from "react";
import { loginUser } from "@/app/auth";
import ShopeeHomepage from "./ShopeeHomepage";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const result = await loginUser(username, password);

        if (result.success) {
            // result.data chứa List<ProductResponse>
            setProducts(result.data);
            setIsLoggedIn(true);
        } else {
            alert(result.message || "Đăng nhập thất bại!");
        }
        setLoading(false);
    };

    // Nếu đã đăng nhập, hiển thị trang chủ
    if (isLoggedIn) {
        return <ShopeeHomepage initialProducts={products} />;
    }

    // Nếu chưa đăng nhập, hiển thị form đăng nhập
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-orange-500 mb-2">Shopee</h1>
                    <p className="text-gray-600">Đăng nhập để tiếp tục</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên đăng nhập
                        </label>
                        <input
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <button
                        className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                        Quên mật khẩu?
                    </a>
                    <span className="mx-2">•</span>
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                        Đăng ký
                    </a>
                </div>
            </div>
        </div>
    );
}