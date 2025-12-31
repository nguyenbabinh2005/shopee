'use client';

import { ShoppingCart, Bell, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/search/SearchBar";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) =>
    pathname === path ? "text-orange-500 font-semibold" : "text-gray-700";

  return (
    <header className="bg-white shadow-sm">
      {/* TOP BAR + SEARCH */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4">

          {/* TOP BAR */}
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex gap-4">
              <span>Kênh Người Bán</span>
              <span>Trở thành Người bán Shopee</span>
              <span>Tải ứng dụng</span>
            </div>

            <div className="flex gap-4 items-center">
              <Bell className="w-5 h-5" />
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                  </div>
                  <span
                    onClick={logout}
                    className="cursor-pointer hover:text-gray-200"
                  >
                    Đăng xuất
                  </span>
                </>
              ) : (
                <>
                  <span
                    onClick={() => router.push("/login")}
                    className="cursor-pointer"
                  >
                    Đăng ký
                  </span>
                  <span
                    onClick={() => router.push("/login")}
                    className="cursor-pointer"
                  >
                    Đăng nhập
                  </span>
                </>
              )}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center justify-between py-4">
            
            {/* LOGO */}
            <div
              className="text-2xl font-bold cursor-pointer mr-8"
              onClick={() => router.push("/")}
            >
              Shopee
            </div>

            {/* SEARCH */}
            <div className="flex-1 max-w-3xl">
              <SearchBar />
            </div>

            {/* CART */}
            <div className="ml-8">
              <ShoppingCart
                className="w-7 h-7 cursor-pointer hover:opacity-80"
                onClick={() => router.push("/cart")}
              />
            </div>
          </div>

        </div>
      </div>

      {/* MENU */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-12 py-4">
          <Link href="/" className={isActive("/")}>Trang chủ</Link>
          <Link href="/products" className={isActive("/products")}>Sản phẩm</Link>
          <Link href="/vouchers" className={isActive("/vouchers")}>Khuyến mãi</Link>
          <Link href="/news" className={isActive("/news")}>Tin tức</Link>
          <Link href="/contact" className={isActive("/contact")}>Liên hệ</Link>
        </div>
      </nav>
    </header>
  );
}
