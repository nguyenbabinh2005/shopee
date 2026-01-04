'use client';

import { useEffect, useState } from 'react';
import { fetchActiveCategories } from '@/services/categoriesApi';
import {
    fetchFlashSaleProducts,
    productApiService,
} from '@/services/productsApi';

import { Category } from '@/types/category';
import { normalizeProduct } from '@/utils/product'; // Import normalizeProduct

export function useHomepageData() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
    const [topSearchProducts, setTopSearchProducts] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);

            try {
                const [
                    categoriesRes,
                    flashSaleRes,
                    topProducts,
                ] = await Promise.all([
                    fetchActiveCategories(),
                    fetchFlashSaleProducts(),
                    productApiService.getTopSellingProducts(),
                ]);

                if (categoriesRes.success) setCategories(categoriesRes.data);
                if (flashSaleRes.success) setFlashSaleProducts(flashSaleRes.data);

                // Set top selling products
                if (topProducts && Array.isArray(topProducts)) {
                    const normalizedTopProducts = topProducts.map(normalizeProduct);
                    setTopSearchProducts(normalizedTopProducts);
                }

                // Fetch all products for "Gợi ý hôm nay"
                const allProductsRes = await productApiService.getAllProducts();
                if (allProductsRes && Array.isArray(allProductsRes)) {
                    const normalizedAllProducts = allProductsRes.map(normalizeProduct);
                    setProducts(normalizedAllProducts);
                }

            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
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