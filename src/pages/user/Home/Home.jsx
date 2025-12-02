// src/pages/user/Home/Home.jsx
import React, { useState, useEffect } from "react";
import Header from "../../../components/common/Header/Header";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import ProductGallery from "../../../components/product/ProductGallery";
import CategoryCard from "../../../components/category/CategoryCard";
import productAPI from "../../../services/productAPI";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 24;

  // Danh sách danh mục – chỉ khai báo 1 lần duy nhất
  const categories = [
    { id: 1, name: "Điện tử", image: "/images/cat-electronic.png" },
    { id: 2, name: "Thời trang", image: "/images/cat-fashion.png" },
    { id: 3, name: "Nhà cửa", image: "/images/cat-home.png" },
    { id: 4, name: "Làm đẹp", image: "/images/cat-beauty.png" },
    { id: 5, name: "Giày dép", image: "/images/cat-shoes.png" },
    { id: 6, name: "Thể thao", image: "/images/cat-sport.png" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productAPI.getAll();
        const data = res.data || [];
        setProducts(data);
        setDisplayed(data.slice(0, LIMIT));
        setHasMore(data.length > LIMIT);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const loadMore = () => {
    const next = products.slice(displayed.length, displayed.length + LIMIT);
    setDisplayed([...displayed, ...next]);
    setHasMore(displayed.length + next.length < products.length);
  };

  return (
    <>
      <Header />
      <Navbar />

      <div className="my-home-wrapper">
        <div className="my-banner">
          <img src="/images/banner1.jpg" alt="Sale lớn" />
        </div>

        {/* DANH MỤC – CHỈ HIỆN 1 LẦN */}
        <section className="my-section">
          <div className="my-container">
            <h2 className="my-title">Danh mục nổi bật</h2>
            <div className="my-categories-grid">
              {categories.map(cat => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* GỢI Ý HÔM NAY */}
        <section className="my-section">
          <div className="my-container">
            <h2 className="my-title">Gợi ý hôm nay</h2>
            <ProductGallery products={displayed} />
            {hasMore && (
              <div className="my-loadmore">
                <button onClick={loadMore}>Xem thêm</button>
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