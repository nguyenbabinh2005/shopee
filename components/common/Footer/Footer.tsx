import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <h3>MyShop</h3>
          <p>© 2025 MyShop. Tất cả quyền được bảo lưu.</p>
        </div>

        <div className="footer-right">
          <Link href="/about">Giới thiệu</Link>
          <Link href="/contact">Liên hệ</Link>
          <Link href="/privacy">Chính sách bảo mật</Link>
          <Link href="/terms">Điều khoản sử dụng</Link>
        </div>
      </div>
    </footer>
  );
}
