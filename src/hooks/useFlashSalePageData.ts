'use client';

import { useEffect, useState } from 'react';
import { fetchActiveFlashSales, fetchUpcomingFlashSales } from '@/services/flashsalesApi';
import { fetchActiveCategories } from '@/services/categoriesApi';

export function useFlashSalePageData() {
    const [activeFlashSales, setActiveFlashSales] = useState<any[]>([]);
    const [upcomingFlashSales, setUpcomingFlashSales] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);

            const [activeRes, upcomingRes, categoriesRes] = await Promise.all([
                fetchActiveFlashSales(),
                fetchUpcomingFlashSales(),
                fetchActiveCategories(),
            ]);

            if (activeRes.success) setActiveFlashSales(activeRes.data);
            if (upcomingRes.success) setUpcomingFlashSales(upcomingRes.data);
            if (categoriesRes.success) setCategories(categoriesRes.data);

            setLoading(false);
        }

        load();
    }, []);

    return {
        activeFlashSales,
        upcomingFlashSales,
        categories,
        loading,
    };
}
