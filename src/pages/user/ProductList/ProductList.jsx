// src/pages/user/ProductList/ProductList.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import productAPI from "../../../services/productAPI";
import categoryAPI from "../../../services/categoryAPI";
import SidebarCategory from "./components/SidebarCategory";
import ProductCard from "../../../components/product/ProductCard";
import Header from "../../../components/common/Header/Header"; // ĐÃ CÓ SẴN
import "./ProductList.css";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse URL params
  const rawCategory = searchParams.get("category");
  const categoryId = rawCategory && !isNaN(rawCategory) ? Number(rawCategory) : null;
  
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const hasDiscountParam = searchParams.get("hasDiscount");
  const minRatingParam = searchParams.get("minRating");
  const keywordParam = searchParams.get("keyword"); // ĐÃ CÓ SẴN

  // State management
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Cache all products
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controlled inputs
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam || "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam || "");
  const [minRatingInput, setMinRatingInput] = useState(minRatingParam || "");

  // Filter logic extracted to separate function
  const applyFilters = (data, filters) => {
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
        let data = [];
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

        // THÊM LỌC KEYWORD (nếu có)
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

      // Áp dụng lọc keyword nếu có
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
  const updateSearchParams = (updates) => {
    const params = new URLSearchParams();
    
    if (categoryId) params.set("category", categoryId);
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
  };

  // Price range handlers
  const applyPriceRange = (min, max) => {
    const updates = {
      hasDiscount: hasDiscountParam,
      minRating: minRatingParam,
      keyword: keywordParam
    };
    
    if (min !== null) updates.minPrice = min;
    if (max !== null) updates.maxPrice = max;
    
    updateSearchParams(updates);
  };

  const applyDiscountFilter = (hasDiscount) => {
    const updates = {
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      minRating: minRatingParam,
      keyword: keywordParam
    };
    
    if (hasDiscount !== null) updates.hasDiscount = hasDiscount;
    
    updateSearchParams(updates);
  };

  const applyRatingFilter = (minRating) => {
    const updates = {
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      hasDiscount: hasDiscountParam,
      keyword: keywordParam
    };
    
    if (minRating !== null) updates.minRating = minRating;
    
    updateSearchParams(updates);
  };

  // Check if filter is active
  const isPriceRangeActive = (min, max) => {
    const minP = minPriceParam ? Number(minPriceParam) : null;
    const maxP = maxPriceParam ? Number(maxPriceParam) : null;
    return (
      (min === null ? minP === null : minP === Number(min)) &&
      (max === null ? maxP === null : maxP === Number(max))
    );
  };

  const isDiscountActive = (hasDiscount) => {
    return hasDiscountParam === hasDiscount;
  };

  const isRatingActive = (minRating) => {
    return minRatingParam === String(minRating);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (keywordParam) params.set("keyword", keywordParam);
    setSearchParams(params);
    
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinRatingInput("");
  };

  // Category selection handler
  const handleCategorySelect = (id) => {
    if (id === null) {
      navigate("/products");
    } else {
      navigate(`/products?category=${id}`);
    }
  };

  // Render states
  if (loading) {
    return (
      <div className="product-list-page">
        <Header /> {/* ĐÃ CÓ HEADER */}
        <div className="pl-container">
          <div className="pl-loading">Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-page">
        <Header /> {/* ĐÃ CÓ HEADER */}
        <div className="pl-container">
          <div className="pl-empty">{error}</div>
        </div>
      </div>
    );
  }

  const hasActiveFilters = minPriceParam || maxPriceParam || hasDiscountParam || minRatingParam;

  return (
    <div className="product-list-page">
      {/* NGUYÊN CẢ HEADER HIỆN RA TRONG TRANG PRODUCTLIST */}
      <Header />

      <div className="pl-container">
        <div className="pl-grid">
          {/* LEFT SIDEBAR - Categories */}
          <aside className="pl-sidebar">
            <SidebarCategory
              categories={categories}
              currentId={categoryId}
              onSelect={handleCategorySelect}
            />
          </aside>

          {/* MAIN CONTENT - Products */}
          <main className="pl-main">
            {/* HIỆN TIÊU ĐỀ KẾT QUẢ TÌM KIẾM */}
            {keywordParam && (
              <div className="search-result-title">
                Kết quả tìm kiếm cho: <strong>"{keywordParam}"</strong>
                <span className="result-count"> ({products.length} sản phẩm)</span>
              </div>
            )}

            <div className="pl-products">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))
              ) : (
                <div className="pl-empty">
                  {hasActiveFilters || keywordParam 
                    ? "Không tìm thấy sản phẩm phù hợp" 
                    : "Không có sản phẩm nào"}
                </div>
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR - Filters */}
          <aside className="pl-filters">
            {/* Price Filter */}
            <div className="price-filter-section">
              <h4 className="price-filter-title">Khoảng giá</h4>
              
              <div className="price-quick-options">
                <button
                  onClick={() => applyPriceRange(null, 500000)}
                  className={`quick-price-btn ${isPriceRangeActive(null, 500000) ? 'active' : ''}`}
                >
                  Dưới 500k
                </button>
                <button
                  onClick={() => applyPriceRange(500000, 1000000)}
                  className={`quick-price-btn ${isPriceRangeActive(500000, 1000000) ? 'active' : ''}`}
                >
                  500k - 1 triệu
                </button>
                <button
                  onClick={() => applyPriceRange(1000000, 2000000)}
                  className={`quick-price-btn ${isPriceRangeActive(1000000, 2000000) ? 'active' : ''}`}
                >
                  1 - 2 triệu
                </button>
                <button
                  onClick={() => applyPriceRange(2000000, 5000000)}
                  className={`quick-price-btn ${isPriceRangeActive(2000000, 5000000) ? 'active' : ''}`}
                >
                  2 - 5 triệu
                </button>
                <button
                  onClick={() => applyPriceRange(5000000, null)}
                  className={`quick-price-btn ${isPriceRangeActive(5000000, null) ? 'active' : ''}`}
                >
                  Trên 5 triệu
                </button>
              </div>

              <div className="price-input-row">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="price-input"
                  min="0"
                />
                <span className="price-sep">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="price-input"
                  min="0"
                />
                <button
                  className="filter-apply-btn"
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
            <div className="discount-filter-section">
              <h4 className="discount-filter-title">Giảm giá</h4>
              
              <div className="discount-options">
                <button
                  onClick={() => applyDiscountFilter("true")}
                  className={`discount-btn ${isDiscountActive("true") ? 'active' : ''}`}
                >
                  🏷️ Sản phẩm giảm giá
                </button>
                <button
                  onClick={() => applyDiscountFilter("false")}
                  className={`discount-btn ${isDiscountActive("false") ? 'active' : ''}`}
                >
                  💰 Sản phẩm không giảm giá
                </button>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="rating-filter-section">
              <h4 className="rating-filter-title">Đánh giá</h4>
              
              <div className="rating-options">
                <button
                  onClick={() => applyRatingFilter(5)}
                  className={`rating-btn ${isRatingActive(5) ? 'active' : ''}`}
                >
                  <span className="rating-stars">★★★★★</span>
                  <span className="rating-text">5 sao</span>
                </button>
                <button
                  onClick={() => applyRatingFilter(4)}
                  className={`rating-btn ${isRatingActive(4) ? 'active' : ''}`}
                >
                  <span className="rating-stars">★★★★</span>
                  <span className="rating-text">từ 4 sao</span>
                </button>
                <button
                  onClick={() => applyRatingFilter(3)}
                  className={`rating-btn ${isRatingActive(3) ? 'active' : ''}`}
                >
                  <span className="rating-stars">★★★</span>
                  <span className="rating-text">từ 3 sao</span>
                </button>
                <button
                  onClick={() => applyRatingFilter(2)}
                  className={`rating-btn ${isRatingActive(2) ? 'active' : ''}`}
                >
                  <span className="rating-stars">★★</span>
                  <span className="rating-text">từ 2 sao</span>
                </button>
                <button
                  onClick={() => applyRatingFilter(1)}
                  className={`rating-btn ${isRatingActive(1) ? 'active' : ''}`}
                >
                  <span className="rating-stars">★</span>
                  <span className="rating-text">từ 1 sao</span>
                </button>
              </div>

              <div className="price-input-row rating-input-row">
                <input
                  type="number"
                  placeholder="Tối thiểu"
                  value={minRatingInput}
                  onChange={(e) => setMinRatingInput(e.target.value)}
                  className="price-input rating-custom-input"
                  min="0"
                  max="5"
                  step="0.1"
                />
                <button
                  className="filter-apply-btn"
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
              <div className="clear-all-filters-section">
                <button onClick={clearAllFilters} className="btn-clear-all">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductList;