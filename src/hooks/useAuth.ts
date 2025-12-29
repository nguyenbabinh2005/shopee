'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
    userId: number;
    username: string;
    email?: string;
}

export function useAuth() {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    // 🔑 Load login state từ localStorage
    useEffect(() => {
        const savedLogin = localStorage.getItem('isLoggedIn');
        const savedUser = localStorage.getItem('userInfo');

        if (savedLogin === 'true' && savedUser) {
            setIsLoggedIn(true);
            setUserInfo(JSON.parse(savedUser));
        }
    }, []);

    // 👉 Login = chuyển trang auth
    const login = () => {
        router.push('/auth');
    };

    // 👉 Logout
    const logout = () => {
        setIsLoggedIn(false);
        setUserInfo(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
        router.push('/');
    };

    return {
        isLoggedIn,
        userInfo,
        userId: userInfo?.userId,
        login,
        logout,
    };
}
