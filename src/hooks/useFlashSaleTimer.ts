'use client';

import { useEffect, useState } from 'react';

export function useFlashSaleTimer(initialHours = 2) {
    const [timeLeft, setTimeLeft] = useState({
        hours: initialHours,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) seconds--;
                else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    hours = initialHours;
                    minutes = 0;
                    seconds = 0;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [initialHours]);

    return { timeLeft };
}
