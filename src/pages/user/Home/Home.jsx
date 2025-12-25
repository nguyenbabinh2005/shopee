// src/pages/user/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/common/Header/Header";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import ProductGallery from "../../../components/product/ProductGallery";
import CategoryCard from "../../../components/category/CategoryCard";
import categoryAPI from "../../../services/categoryAPI";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // DỮ LIỆU SẢN PHẨM MẪU SIÊU ĐẸP (hiện ngay, không gọi backend sản phẩm)
  const mockProducts = [
    { product_id: 1, name: "Áo thun nam cotton cao cấp", price: 299000, thumbnail: "/images/mock1.jpg", sold: 1250, discount: 30 },
    { product_id: 2, name: "Giày sneaker trắng thời trang", price: 890000, thumbnail: "/images/mock2.jpg", sold: 890, discount: 20 },
    { product_id: 3, name: "Đồng hồ thông minh chống nước", price: 2990000, thumbnail: "/images/mock3.jpg", sold: 560, discount: 15 },
    { product_id: 4, name: "Tai nghe Bluetooth không dây", price: 1290000, thumbnail: "/images/mock4.jpg", sold: 2100, discount: 25 },
    { product_id: 5, name: "Balo laptop chống sốc", price: 690000, thumbnail: "/images/mock5.jpg", sold: 780, discount: 40 },
    { product_id: 6, name: "Máy xay sinh tố đa năng", price: 890000, thumbnail: "/images/mock6.jpg", sold: 450, discount: 10 },
    { product_id: 7, name: "Quần jeans nam slim fit", price: 590000, thumbnail: "/images/mock7.jpg", sold: 1200, discount: 35 },
    { product_id: 8, name: "Áo khoác nữ dáng dài", price: 990000, thumbnail: "/images/mock8.jpg", sold: 980, discount: 50 },
    // Thêm nhiều hơn nếu muốn hiện nhiều sản phẩm
  ];

  const [displayed] = useState(mockProducts.slice(0, 24));
  const [hasMore] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryAPI.getActive();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục từ backend:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) return <div className="home-loading">Đang tải danh mục từ backend...</div>;

  return (
    <>
      <Header />
      <Navbar />

      <div className="my-home-wrapper">
        <div className="my-banner">
          <img src="/images/banner1.jpg" alt="Sale lớn" />
        </div>

        {/* DANH MỤC NỔI BẬT – LẤY THẬT TỪ BACKEND */}
        <section className="my-section">
          <div className="my-container">
            <h2 className="my-title">Danh mục nổi bật</h2>
            <div className="my-categories-grid">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div
                    key={cat.category_id}
                    onClick={() => handleCategoryClick(cat.category_id)}
                    className="cat-wrapper"
                  >
                    <CategoryCard category={cat} />
                  </div>
                ))
              ) : (
                <p className="no-cat">Chưa có danh mục nào từ backend</p>
              )}
            </div>
          </div>
        </section>

        {/* GỢI Ý HÔM NAY – SẢN PHẨM MẪU ĐẸP (để bạn phát triển ProductList thoải mái) */}
        <section className="my-section">
          <div className="my-container">
            <h2 className="my-title">Gợi ý hôm nay</h2>
            <ProductGallery products={displayed} />
            {hasMore && (
              <div className="my-loadmore">
                <button>Xem thêm</button>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;