'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/authApi';
import { registerUser } from '@/services/registerApi';
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Login fields
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register fields
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerFullName, setRegisterFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = async () => {
        if (!loginUsername || !loginPassword) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        const result = await loginUser(loginUsername, loginPassword);

        if (result.success) {
            const userInfo = {
                username: loginUsername,
                userId: result.userId,
                cartId: result.cartId,
                isAdmin: result.isAdmin
            };

            login(userInfo);

            router.push('/');
        } else {
            alert(result.message || "Đăng nhập thất bại!");
        }
        setLoading(false);
    };

    const handleRegister = async () => {
        if (!registerUsername || !registerPassword || !registerEmail || !registerFullName) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (registerPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (registerPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);
        const result = await registerUser(registerUsername, registerPassword, registerEmail, registerFullName);

        if (result.success) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            setIsLogin(true);
            // Clear register fields
            setRegisterUsername("");
            setRegisterPassword("");
            setRegisterEmail("");
            setRegisterFullName("");
            setConfirmPassword("");
        } else {
            alert(result.message || "Đăng ký thất bại!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-6">
                    <h1
                        className="text-4xl font-bold text-orange-500 cursor-pointer"
                        onClick={() => router.push('/')}
                    >
                        Shopee
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isLogin ? 'Đăng nhập để tiếp tục' : 'Đăng ký tài khoản mới'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 border-b">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 font-semibold transition ${isLogin
                                ? 'text-orange-500 border-b-2 border-orange-500'
                                : 'text-gray-500'
                            }`}
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 font-semibold transition ${!isLogin
                                ? 'text-orange-500 border-b-2 border-orange-500'
                                : 'text-gray-500'
                            }`}
                    >
                        Đăng ký
                    </button>
                </div>

                {/* Login Form */}
                {isLogin ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Nhập tên đăng nhập"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
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
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                        <div className="text-center text-sm">
                            <a href="#" className="text-orange-500 hover:text-orange-600">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>
                ) : (
                    /* Register Form */
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Nhập tên đăng nhập"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Nhập email"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Nhập họ và tên"
                                value={registerFullName}
                                onChange={(e) => setRegisterFullName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                            />
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>

                        <div className="text-center text-xs text-gray-600">
                            Bằng việc đăng ký, bạn đã đồng ý với Shopee về{' '}
                            <a href="#" className="text-orange-500">Điều khoản dịch vụ</a>
                            {' '}&{' '}
                            <a href="#" className="text-orange-500">Chính sách bảo mật</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}