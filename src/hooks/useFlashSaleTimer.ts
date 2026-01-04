'use client';

import { useEffect, useState } from 'react';

/**
 * Hook đếm ngược thời gian flash sale dựa trên endTime từ backend
 * @param endTime - ISO string của thời điểm kết thúc flash sale
 */
export function useFlashSaleTimer(endTime?: string) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!endTime) {
            // Nếu không có endTime, hiển thị 0
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            const difference = end - now;

            if (difference <= 0) {
                // Flash sale đã kết thúc
                return { hours: 0, minutes: 0, seconds: 0 };
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { hours, minutes, seconds };
        };

        // Tính ngay lần đầu
        setTimeLeft(calculateTimeLeft());

        // Cập nhật mỗi giây
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return { timeLeft };
}
