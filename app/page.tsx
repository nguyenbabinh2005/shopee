"use client";

import { useState } from "react";
import { loginUser } from "@/app/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [products, setProducts] = useState([]);

    const handleLogin = async () => {
        const result = await loginUser(username, password);

        if (result.success) {
            alert("Đăng nhập thành công!");

            // result.data chứa List<ProductResponse>
            setProducts(result.data);
        } else {
            alert(result.message || "Login failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto space-y-4">
            <input
                className="border p-2 w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                className="border p-2 w-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={handleLogin}
            >
                Đăng nhập
            </button>

            {/* Hiển thị sản phẩm */}
            <div className="mt-6 space-y-3">
                {products.map((p: any) => (
                    <div
                        key={p.productId}
                        className="border p-3 rounded flex gap-3"
                    >
                        <img
                            src={p.primaryImageUrl}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-sm text-gray-600">{p.price} VND</p>
                            <p className="text-xs text-gray-400">
                                Đã bán: {p.totalPurchaseCount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
