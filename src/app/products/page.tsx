"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { productApiService } from "@/services/productsApi";
import { fetchActiveCategories } from "@/services/categoriesApi";
import SidebarCategory from "@/components/sidebar/SidebarCategory";
import ProductCard from "@/components/card/ProductCard";
import Header from "@/components/layout/Header";
import { ProductSearchResponse } from "@/types/product";

interface CategoryResponse {
  categoryId: number;
  name: string;
  slug?: string;
  status?: string;
  sortOrder?: number;
  parentId?: number | null;
  [key: string]: unknown;
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface FilterParams {
  minPrice: string | null;
  maxPrice: string | null;
  hasDiscount: string | null;
  minRating: string | null;
}

const ProductList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCategory = searchParams.get("category");
  const categoryId = rawCategory && !isNaN(Number(rawCategory)) ? Number(rawCategory) : null;

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const hasDiscountParam = searchParams.get("hasDiscount");
  const minRatingParam = searchParams.get("minRating");
  const keywordParam = searchParams.get("keyword");

  const [products, setProducts] = useState<ProductSearchResponse[]>([]);
  const [allProducts, setAllProducts] = useState<ProductSearchResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [minPriceInput, setMinPriceInput] = useState<string>(minPriceParam || "");
  const [maxPriceInput, setMaxPriceInput] = useState<string>(maxPriceParam || "");
  const [minRatingInput, setMinRatingInput] = useState<string>(minRatingParam || "");

  const buildCategoryTree = (flatCategories: CategoryResponse[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    flatCategories.forEach(cat => {
      categoryMap.set(cat.categoryId, {
        id: cat.categoryId,
        name: cat.name,
        children: []
      });
    });

    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.categoryId);
      if (!category) return;

      if (cat.parentId === null || cat.parentId === undefined) {
        rootCategories.push(category);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(category);
        }
      }
    });

    return rootCategories;
  };

  const applyFilters = (data: ProductSearchResponse[], filters: FilterParams): ProductSearchResponse[] => {
    const { minPrice, maxPrice, hasDiscount, minRating } = filters;

    if (!minPrice && !maxPrice && !hasDiscount && !minRating) {
      return data;
    }

    return data.filter(product => {
      const price = Number(product.finalPrice || 0);
      const original = Number(product.originalPrice || 0);
      const rating = Number(product.rating || 0);

      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      if (hasDiscount !== null && hasDiscount !== undefined) {
        const productHasDiscount = original > price;
        if (hasDiscount === "true" && !productHasDiscount) return false;
        if (hasDiscount === "false" && productHasDiscount) return false;
      }

      if (minRating && rating < Number(minRating)) return false;

      return true;
    });
  };

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await fetchActiveCategories();
        const flatCategories = catRes.data || [];
        const categoryTree = buildCategoryTree(flatCategories);
        setCategories(categoryTree);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };

    loadCategories();
  }, []);

  // Load products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let productsData: ProductSearchResponse[];

        if (categoryId !== null) {
          // Call API for specific category
          const response = await fetch(`http://localhost:8080/api/categories/${categoryId}/products?page=0&size=1000`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          // Handle Spring Page response: data.content contains the array
          productsData = data.content || data;
        } else {
          // Get all products
          productsData = await productApiService.getAllProducts() as ProductSearchResponse[];
        }

        setAllProducts(productsData);
        setProducts(productsData);

      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  // Apply filters (price, discount, rating, keyword) - NOT category
  useEffect(() => {
    if (allProducts.length > 0) {
      let filteredData = [...allProducts];

      // Apply price, discount, rating filters
      filteredData = applyFilters(filteredData, {
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        hasDiscount: hasDiscountParam,
        minRating: minRatingParam
      });

      // Apply keyword filter
      if (keywordParam) {
        const keyword = keywordParam.toLowerCase().trim();
        filteredData = filteredData.filter(p =>
          p.name && p.name.toLowerCase().includes(keyword)
        );
      }

      setProducts(filteredData);
    }
  }, [minPriceParam, maxPriceParam, hasDiscountParam, minRatingParam, keywordParam, allProducts]);

  // Sync inputs with URL params
  useEffect(() => {
    setMinPriceInput(minPriceParam || "");
    setMaxPriceInput(maxPriceParam || "");
    setMinRatingInput(minRatingParam || "");
  }, [minPriceParam, maxPriceParam, minRatingParam]);

  const updateSearchParams = (updates: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams();

    if (categoryId) params.set("category", categoryId.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, value.toString());
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  const clearKeyword = () => {
    const params = new URLSearchParams();
    
    // Preserve other filters
    if (categoryId) params.set("category", categoryId.toString());
    if (minPriceParam) params.set("minPrice", minPriceParam);
    if (maxPriceParam) params.set("maxPrice", maxPriceParam);
    if (hasDiscountParam) params.set("hasDiscount", hasDiscountParam);
    if (minRatingParam) params.set("minRating", minRatingParam);
    
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const applyPriceRange = (min: number | null, max: number | null) => {
    // Toggle off if clicking the same range
    const currentMin = minPriceParam ? Number(minPriceParam) : null;
    const currentMax = maxPriceParam ? Number(maxPriceParam) : null;

    if (currentMin === min && currentMax === max) {
      // Clear price filter
      const updates: Record<string, string | number | null> = {
        minPrice: null,
        maxPrice: null,
        hasDiscount: hasDiscountParam,
        minRating: minRatingParam,
        keyword: keywordParam
      };
      updateSearchParams(updates);
      return;
    }

    const updates: Record<string, string | number | null> = {
      hasDiscount: hasDiscountParam,
      minRating: minRatingParam,
      keyword: keywordParam
    };

    if (min !== null) updates.minPrice = min;
    if (max !== null) updates.maxPrice = max;

    updateSearchParams(updates);
  };

  const applyDiscountFilter = (hasDiscount: string | null) => {
    // Toggle off if clicking the same filter
    if (hasDiscountParam === hasDiscount) {
      // Clear discount filter
      const updates: Record<string, string | number | null> = {
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        hasDiscount: null,
        minRating: minRatingParam,
        keyword: keywordParam
      };
      updateSearchParams(updates);
      return;
    }

    const updates: Record<string, string | number | null> = {
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      minRating: minRatingParam,
      keyword: keywordParam
    };

    if (hasDiscount !== null) updates.hasDiscount = hasDiscount;

    updateSearchParams(updates);
  };

  const applyRatingFilter = (minRating: number | null) => {
    // Toggle off if clicking the same rating
    const currentRating = minRatingParam ? Number(minRatingParam) : null;

    if (currentRating === minRating) {
      // Clear rating filter
      const updates: Record<string, string | number | null> = {
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        hasDiscount: hasDiscountParam,
        minRating: null,
        keyword: keywordParam
      };
      updateSearchParams(updates);
      return;
    }

    const updates: Record<string, string | number | null> = {
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      hasDiscount: hasDiscountParam,
      keyword: keywordParam
    };

    if (minRating !== null) updates.minRating = minRating;

    updateSearchParams(updates);
  };

  const isPriceRangeActive = (min: number | null, max: number | null): boolean => {
    const minP = minPriceParam ? Number(minPriceParam) : null;
    const maxP = maxPriceParam ? Number(maxPriceParam) : null;
    return (
      (min === null ? minP === null : minP === Number(min)) &&
      (max === null ? maxP === null : maxP === Number(max))
    );
  };

  const isDiscountActive = (hasDiscount: string): boolean => {
    return hasDiscountParam === hasDiscount;
  };

  const isRatingActive = (minRating: number): boolean => {
    return minRatingParam === String(minRating);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId.toString());
    if (keywordParam) params.set("keyword", keywordParam);

    router.push(`/products?${params.toString()}`);

    setMinPriceInput("");
    setMaxPriceInput("");
    setMinRatingInput("");
  };

  const handleCategorySelect = (id: number | null) => {
    const params = new URLSearchParams();

    // Preserve keyword if exists
    if (keywordParam) {
      params.set("keyword", keywordParam);
    }

    // Add category if selected
    if (id !== null) {
      params.set("category", id.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const getCurrentCategoryName = (): string | null => {
    if (!categoryId) return null;

    const findCategoryName = (cats: Category[]): string | null => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat.name;
        if (cat.children) {
          const found = findCategoryName(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findCategoryName(categories);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64 text-lg text-gray-600">
            Đang tải sản phẩm...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64 text-lg text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const hasActiveFilters = minPriceParam || maxPriceParam || hasDiscountParam || minRatingParam;
  const currentCategoryName = getCurrentCategoryName();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - Categories */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <div
              className="bg-white rounded-lg shadow-sm p-4 sticky top-4 overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              <SidebarCategory
                categories={categories}
                currentId={categoryId}
                onSelect={handleCategorySelect}
              />
            </div>
          </aside>

          {/* MAIN CONTENT - Products */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7">
            {(currentCategoryName || keywordParam) && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="text-gray-700 space-y-1">
                  {currentCategoryName && (
                    <div>
                      Danh mục: <strong className="text-gray-900">{currentCategoryName}</strong>
                    </div>
                  )}
                  {keywordParam && (
                    <div className="flex items-center gap-2">
                      <span>Tìm kiếm:</span>
                      <strong className="text-gray-900">&quot;{keywordParam}&quot;</strong>
                      <button
                        onClick={clearKeyword}
                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa từ khóa tìm kiếm"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" 
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="text-gray-500 text-sm">
                    {products.length} sản phẩm
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-lg">
                    {hasActiveFilters || keywordParam || categoryId
                      ? "Không tìm thấy sản phẩm phù hợp"
                      : "Không có sản phẩm nào"}
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR - Filters */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3">
            <div
              className="bg-white rounded-lg shadow-sm p-4 sticky top-4 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              <div className="space-y-6">
                {/* Price Filter */}
                <div className="border-b pb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Khoảng giá</h4>

                  <div className="space-y-2 mb-4">
                    <button
                      onClick={() => applyPriceRange(null, 500000)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPriceRangeActive(null, 500000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Dưới 500k
                    </button>
                    <button
                      onClick={() => applyPriceRange(500000, 1000000)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPriceRangeActive(500000, 1000000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      500k - 1 triệu
                    </button>
                    <button
                      onClick={() => applyPriceRange(1000000, 2000000)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPriceRangeActive(1000000, 2000000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      1 - 2 triệu
                    </button>
                    <button
                      onClick={() => applyPriceRange(2000000, 5000000)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPriceRangeActive(2000000, 5000000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      2 - 5 triệu
                    </button>
                    <button
                      onClick={() => applyPriceRange(5000000, null)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPriceRangeActive(5000000, null)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Trên 5 triệu
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>

                    <button
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        const min = minPriceInput !== "" ? Number(minPriceInput) : null;
                        const max = maxPriceInput !== "" ? Number(maxPriceInput) : null;
                        applyPriceRange(min, max);
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Discount Filter */}
                <div className="border-b pb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Giảm giá</h4>

                  <div className="space-y-2">
                    <button
                      onClick={() => applyDiscountFilter("true")}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isDiscountActive("true")
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <span>🏷️</span>
                      <span>Sản phẩm giảm giá</span>
                    </button>
                    <button
                      onClick={() => applyDiscountFilter("false")}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isDiscountActive("false")
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <span>💰</span>
                      <span>Sản phẩm không giảm giá</span>
                    </button>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="pb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Đánh giá</h4>

                  <div className="space-y-2 mb-4">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => applyRatingFilter(rating)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${isRatingActive(rating)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <span className={isRatingActive(rating) ? 'text-yellow-200' : 'text-yellow-400'}>
                          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                        </span>
                        <span>{rating === 5 ? '5 sao' : `từ ${rating} sao`}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      value={minRatingInput}
                      onChange={(e) => setMinRatingInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                      onClick={() => {
                        const min = minRatingInput !== "" ? Number(minRatingInput) : null;
                        applyRatingFilter(min);
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductList;