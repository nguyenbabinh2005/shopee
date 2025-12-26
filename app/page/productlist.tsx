'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import productAPI from '@/services/productAPI';
import categoryAPI from '@/services/categoryAPI';

import Header from '@/components/common/Header/Header';
import SidebarCategory from './components/SidebarCategory';
import ProductCard, { Product } from '@/components/product/ProductCard/ProductCard';

import './ProductList.css';

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ======================
  // PARSE QUERY PARAMS
  // ======================
  const categoryParam = searchParams.get('category');
  const categoryId =
    categoryParam && !isNaN(Number(categoryParam))
      ? Number(categoryParam)
      : null;

  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const hasDiscountParam = searchParams.get('hasDiscount');
  const minRatingParam = searchParams.get('minRating');
  const keywordParam = searchParams.get('keyword');

  // ======================
  // STATE
  // ======================
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [minPriceInput, setMinPriceInput] = useState(minPriceParam || '');
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam || '');
  const [minRatingInput, setMinRatingInput] = useState(minRatingParam || '');

  // ======================
  // FILTER FUNCTION
  // ======================
  const applyFilters = (
    data: Product[],
    filters: {
      minPrice?: string | null;
      maxPrice?: string | null;
      hasDiscount?: string | null;
      minRating?: string | null;
    }
  ) => {
    return data.filter((product) => {
      const price = Number(product.finalPrice || product.price || 0);
      const original = Number(product.originalPrice || 0);
      const rating = Number(product.rating || 0);

      if (filters.minPrice && price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && price > Number(filters.maxPrice)) return false;

      if (filters.hasDiscount !== null && filters.hasDiscount !== undefined) {
        const has = original > price;
        if (filters.hasDiscount === 'true' && !has) return false;
        if (filters.hasDiscount === 'false' && has) return false;
      }

      if (filters.minRating && rating < Number(filters.minRating)) return false;

      return true;
    });
  };

  // ======================
  // LOAD DATA (CATEGORY CHANGE)
  // ======================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const catRes = await categoryAPI.getActive();
        setCategories(catRes.data || []);

        let data: Product[] = [];

        if (categoryId) {
          const res = await productAPI.getByCategory(categoryId);
          data = res.data?.content || [];
        } else {
          try {
            const res = await productAPI.getTopProducts();
            data = res.data || [];
          } catch {
            const fallback = await productAPI.getTop50();
            data = fallback.data || [];
          }
        }

        setAllProducts(data);

        let filtered = applyFilters(data, {
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          hasDiscount: hasDiscountParam,
          minRating: minRatingParam,
        });

        if (keywordParam) {
          const keyword = keywordParam.toLowerCase().trim();
          filtered = filtered.filter(
            (p) => p.name && p.name.toLowerCase().includes(keyword)
          );
        }

        setProducts(filtered);
      } catch (err) {
        console.error(err);
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  // ======================
  // RE-FILTER WHEN PARAM CHANGE
  // ======================
  useEffect(() => {
    let filtered = applyFilters(allProducts, {
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      hasDiscount: hasDiscountParam,
      minRating: minRatingParam,
    });

    if (keywordParam) {
      const keyword = keywordParam.toLowerCase().trim();
      filtered = filtered.filter(
        (p) => p.name && p.name.toLowerCase().includes(keyword)
      );
    }

    setProducts(filtered);
  }, [
    minPriceParam,
    maxPriceParam,
    hasDiscountParam,
    minRatingParam,
    keywordParam,
    allProducts,
  ]);

  // ======================
  // UPDATE QUERY PARAMS
  // ======================
  const updateParams = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (id: number | null) => {
    if (id === null) router.push('/products');
    else router.push(`/products?category=${id}`);
  };

  // ======================
  // RENDER
  // ======================
  if (loading) {
    return (
      <>
        <Header />
        <div className="pl-loading">Đang tải sản phẩm...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="pl-empty">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="product-list-page">
        <div className="pl-container">
          <div className="pl-grid">
            <aside className="pl-sidebar">
              <SidebarCategory
                categories={categories}
                currentId={categoryId}
                onSelect={handleCategorySelect}
              />
            </aside>

            <main className="pl-main">
              {keywordParam && (
                <div className="search-result-title">
                  Kết quả cho: <strong>"{keywordParam}"</strong>
                  <span> ({products.length} sản phẩm)</span>
                </div>
              )}

              <div className="pl-products">
                {products.length > 0 ? (
                  products.map((p) => (
                    <ProductCard key={p.id || p.product_id} product={p} />
                  ))
                ) : (
                  <div className="pl-empty">
                    Không tìm thấy sản phẩm phù hợp
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
