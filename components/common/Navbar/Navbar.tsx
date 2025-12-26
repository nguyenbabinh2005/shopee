'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/home' && pathname === '/') return true;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky-navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          <li>
            <Link
              href="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Trang chủ
            </Link>
          </li>

          <li>
            <Link
              href="/products"
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              Sản phẩm
            </Link>
          </li>

          <li>
            <Link
              href="/sale"
              className={`nav-link ${isActive('/sale') ? 'active' : ''}`}
            >
              Khuyến mãi
            </Link>
          </li>

          <li>
            <Link
              href="/blog"
              className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
            >
              Tin tức
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Liên hệ
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
