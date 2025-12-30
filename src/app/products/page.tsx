"use client";

import { useEffect, useState } from "react";

import productAPI from "@/services/productsApi";
import categoryAPI from "@/services/categoryApi";

import ProductCard from "@/app/components/card/FlashSaleCard";

import Header from "@/components/layout/Header";

// Types
interface Product {
  product_id: number;
  name: string;
  price: number;
  finalPrice?: number;
  originalPrice?: number;
  rating?: number;
  averageRating?: number;
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
  [key: string]: any;
}

interface FilterParams {
  minPrice: string | null;
  maxPrice: string | null;
  hasDiscount: string | null;
  minRating: string | null;
}

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse URL params
  const rawCategory = searchParams.get("category");
  const categoryId = rawCategory && !isNaN(Number(rawCategory)) ? Number(rawCategory) : null;
  
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const hasDiscountParam = searchParams.get("hasDiscount");
  const minRatingParam = searchParams.get("minRating");
  const keywordParam = searchParams.get("keyword");

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Controlled inputs
  const [minPriceInput, setMinPriceInput] = useState<string>(minPriceParam || "");
  const [maxPriceInput, setMaxPriceInput] = useState<string>(maxPriceParam || "");
  const [minRatingInput, setMinRatingInput] = useState<string>(minRatingParam || "");

  // Filter logic extracted to separate function
  const applyFilters = (data: Product[], filters: FilterParams): Product[] => {
    const { minPrice, maxPrice, hasDiscount, minRating } = filters;
    
    if (!minPrice && !maxPrice && !hasDiscount && !minRating) {
      return data;
    }

    return data.filter(product => {
      const price = Number(product.finalPrice || product.price || 0);
      const original = Number(product.originalPrice || 0);
      const rating = Number(product.rating || product.averageRating || 0);

      // Price filter
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      // Discount filter
      if (hasDiscount !== null && hasDiscount !== undefined) {
        const productHasDiscount = original > price;
        if (hasDiscount === "true" && !productHasDiscount) return false;
        if (hasDiscount === "false" && productHasDiscount) return false;
      }

      // Rating filter (minimum rating)
      if (minRating && rating < Number(minRating)) return false;

      return true;
    });
  };

  // Fetch data effect - Only runs when category changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load categories
        const catRes = await categoryAPI.getActive();
        setCategories(catRes.data || []);

        // Load products based on category
        let data: Product[] = [];
        if (categoryId) {
          const prodRes = await productAPI.getByCategory(categoryId);
          data = prodRes.data.content || [];
        } else {
          try {
            const topRes = await productAPI.getTopSelling();
            data = topRes.data || [];
          } catch {
            try {
              const fallbackRes = await productAPI.getTop50();
              data = fallbackRes.data || [];
            } catch {
              data = [];
            }
          }
        }

        // Cache all products
        setAllProducts(data);
        
        // Apply filters
        let filteredData = applyFilters(data, {
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          hasDiscount: hasDiscountParam,
          minRating: minRatingParam
        });

        // Filter by keyword if present
        if (keywordParam) {
          const keyword = keywordParam.toLowerCase().trim();
          filteredData = filteredData.filter(p => 
            p.name && p.name.toLowerCase().includes(keyword)
          );
        }

        setProducts(filteredData);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  // Apply filters when filter params change - NO API CALL
  useEffect(() => {
    if (allProducts.length > 0) {
      let filteredData = applyFilters(allProducts, {
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        hasDiscount: hasDiscountParam,
        minRating: minRatingParam
      });

      // Apply keyword filter if present
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

  // Update URL params helper
  const updateSearchParams = (updates: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams();
    
    if (categoryId) params.set("category", categoryId.toString());
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
  };

  // Price range handlers
  const applyPriceRange = (min: number | null, max: number | null) => {
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
    const updates: Record<string, string | number | null> = {
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      hasDiscount: hasDiscountParam,
      keyword: keywordParam
    };
    
    if (minRating !== null) updates.minRating = minRating;
    
    updateSearchParams(updates);
  };

  // Check if filter is active
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

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId.toString());
    if (keywordParam) params.set("keyword", keywordParam);
    setSearchParams(params);
    
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinRatingInput("");
  };

  // Category selection handler
  const handleCategorySelect = (id: number | null) => {
    if (id === null) {
      navigate("/products");
    } else {
      navigate(`/products?category=${id}`);
    }
  };

  // Render states
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - Categories */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <SidebarCategory
                categories={categories}
                currentId={categoryId}
                onSelect={handleCategorySelect}
              />
            </div>
          </aside>

          {/* MAIN CONTENT - Products */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7">
            {keywordParam && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="text-gray-700">
                  Kết quả tìm kiếm cho: <strong className="text-gray-900">"{keywordParam}"</strong>
                  <span className="text-gray-500 ml-2">({products.length} sản phẩm)</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-lg">
                    {hasActiveFilters || keywordParam 
                      ? "Không tìm thấy sản phẩm phù hợp" 
                      : "Không có sản phẩm nào"}
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR - Filters */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 space-y-6">
              {/* Price Filter */}
              <div className="border-b pb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Khoảng giá</h4>
                
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => applyPriceRange(null, 500000)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isPriceRangeActive(null, 500000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dưới 500k
                  </button>
                  <button
                    onClick={() => applyPriceRange(500000, 1000000)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isPriceRangeActive(500000, 1000000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    500k - 1 triệu
                  </button>
                  <button
                    onClick={() => applyPriceRange(1000000, 2000000)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isPriceRangeActive(1000000, 2000000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    1 - 2 triệu
                  </button>
                  <button
                    onClick={() => applyPriceRange(2000000, 5000000)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isPriceRangeActive(2000000, 5000000)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    2 - 5 triệu
                  </button>
                  <button
                    onClick={() => applyPriceRange(5000000, null)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isPriceRangeActive(5000000, null)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Trên 5 triệu
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      isDiscountActive("true")
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>🏷️</span>
                    <span>Sản phẩm giảm giá</span>
                  </button>
                  <button
                    onClick={() => applyDiscountFilter("false")}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      isDiscountActive("false")
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
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        isRatingActive(rating)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-yellow-400">
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
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductList;