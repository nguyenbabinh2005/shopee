'use client';

import { useState } from 'react';
import { productApiService } from '@/services/productsApi';
import { normalizeProduct } from '@/utils/product';

export function useSearchProducts() {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const search = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const results = await productApiService.searchProducts(query);
            setSearchResults(results.map(normalizeProduct));
        } catch (err) {
            console.error('Search error', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return {
        searchResults,
        isSearching,
        search,
    };
}
