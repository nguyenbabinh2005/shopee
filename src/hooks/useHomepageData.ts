'use client';

import { useEffect, useState } from 'react';
import { fetchActiveCategories } from '@/services/categoriesApi';
import {
    fetchProducts,
    fetchFlashSaleProducts,
    fetchTopSearchProducts,
} from '@/services/productsApi';

import { Product } from '@/types/product';
import { Category } from '@/types/category';

export function useHomepageData() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [topSearchProducts, setTopSearchProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);

            const [
                categoriesRes,
                flashSaleRes,
                topSellingRes,
                productsRes
            ] = await Promise.all([
                fetchActiveCategories(),
                fetchFlashSaleProducts(),
                fetchProducts(1, 36),
                fetchTopSearchProducts(),
            ]);

            if (categoriesRes.success) setCategories(categoriesRes.data);
            if (flashSaleRes.success) setFlashSaleProducts(flashSaleRes.data);
            if (topSellingRes.success) setTopSearchProducts(topSellingRes.data);
            if (productsRes.success) setProducts(productsRes.data);

            setLoading(false);
        }

        fetchAll();
    }, []);

    return {
        categories,
        flashSaleProducts,
        topSearchProducts,
        products,
        setProducts,
        loading,
    };
}
