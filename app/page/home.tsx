'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/common/Header/Header';
import Navbar from '@/components/common/Navbar/Navbar';
import Footer from '@/components/common/Footer/Footer';

import ProductGallery from '@/components/product/ProductGallery/ProductGallery';
import CategoryCard from '@/components/category/CategoryCard/CategoryCard';

import categoryAPI from '@/services/api/categoryApi';

import './Home.css';

/* ===== TYPE CATEGORY (có thể chuyển ra file types nếu muốn) ===== */
interface Category {
  id?: number;
  category_id?: number;
  name: string;
  image?: string;
}

/* ===== TYPE PRODUCT MOCK (đơn giản) ===== */
interface MockProduct {
  product_id: number;
  name: string;
  price: number;
  thumbnail: string;
  sold: number;
  discount: number;
}

export default function HomePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== MOCK PRODUCT (GIỮ NGUYÊN LOGIC CŨ) ===== */
  const mockProducts: MockProduct[] = [
    { product_id: 1, name: 'Áo thun nam cotton cao cấp', price: 299000, thumbnail: '/images/mock1.jpg', sold: 1250, discount: 30 },
    { product_id: 2, name: 'Giày sneaker trắng thời trang', price: 890000, thumbnail: '/images/mock2.jpg', sold: 890, discount: 20 },
    { product_id: 3, name: 'Đồng hồ thông minh chống nước', price: 2990000, thumbnail: '/images/mock3.jpg', sold: 560, discount: 15 },
    { product_id: 4, name: 'Tai nghe Bluetooth không dây', price: 1290000, thumbnail: '/images/mock4.jpg', sold: 2100, discount: 25 },
    { product_id: 5, name: 'Balo laptop chống sốc', price: 690000, thumbnail: '/images/mock5.jpg', sold: 780, discount: 40 },
    { product_id: 6, name: 'Máy xay sinh tố đa năng', price: 890000, thumbnail: '/images/mock6.jpg', sold: 450, discount: 10 },
    { product_id: 7, name: 'Quần jeans nam slim fit', price: 590000, thumbnail: '/images/mock7.jpg', sold: 1200, discount: 35 },
    { product_id: 8, name: 'Áo khoác nữ dáng dài', price: 990000, thumbnail: '/images/mock8.jpg', sold: 980, discount: 50 },
  ];

  const displayed = mockProducts.slice(0, 24);
  const hasMore = false;

  /* ===== LOAD CATEGORY TỪ BACKEND ===== */
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryAPI.getActive();
        setCategories(res.data || []);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* ===== CLICK CATEGORY ===== */
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?category=${categoryId}`);
  };

  if (loading) {
    return <div className="home-loading">Đang tải danh mục từ backend...</div>;
  }

  return (
    <>
      <Header />
      <Navbar />

      <div className="my-home-wrapper">
        {/* ===== BANNER ===== */}
        <div className="my-banner">
          <img src="/images/banner1.jpg" alt="Sale lớn" />
        </div>

        {/* ===== DANH MỤC NỔI BẬT ===== */}
        <section className="my-section">
          <div className="my-container">
            <h2 className="my-title">Danh mục nổi bật</h2>

            <div className="my-categories-grid">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const id = cat.category_id ?? cat.id!;
                  return (
                    <div
                      key={id}
                      className="cat-wrapper"
                      onClick={() => handleCategoryClick(id)}
                    >
                      <CategoryCard category={cat} />
                    </div>
                  );
                })
              ) : (
                <p className="no-cat">Chưa có danh mục nào từ backend</p>
              )}
            </div>
          </div>
        </section>

        {/* ===== GỢI Ý HÔM NAY ===== */}
        <section className="my-section">
          <div className="my-container">
            <h2 className="my-title">Gợi ý hôm nay</h2>

            <ProductGallery
              products={displayed as any}
              onViewDetail={(p) => router.push(`/products/${p.product_id}`)}
              onAddToCart={(p) => console.log('Add to cart:', p)}
            />

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
}
