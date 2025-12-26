// services/api/productApi.ts

import type { Product } from '@/types/product.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 1. LẤY TOP SẢN PHẨM BÁN CHẠY (HOME)
 * GET /api/products/top-selling
 */
export async function getTopProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/top-selling`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // SEO tốt cho Home
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Không thể tải sản phẩm bán chạy');
  }

  return response.json();
}

/**
 * 2. FALLBACK: TOP 50
 * GET /api/products/top
 */
export async function getTop50(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/top`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Không thể tải danh sách sản phẩm');
  }

  return response.json();
}

/**
 * 3. LẤY TẤT CẢ (fallback)
 * GET /api/products/top-selling
 */
export async function getAllProducts(): Promise<Product[]> {
  return getTopProducts();
}

/**
 * 4. LẤY SẢN PHẨM THEO CATEGORY (PHÂN TRANG)
 * GET /api/categories/{categoryId}/products?page=&size=
 */
export async function getProductsByCategory(
  categoryId: number,
  page = 0,
  size = 40
): Promise<Product[]> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/categories/${categoryId}/products?${params.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error('Không thể tải sản phẩm theo danh mục');
  }

  return response.json();
}

/**
 * 5. TÌM KIẾM
 * GET /api/products/search?keyword=
 */
export async function searchProducts(
  keyword: string = ''
): Promise<Product[]> {
  const params = new URLSearchParams({ keyword });

  const response = await fetch(
    `${API_BASE_URL}/api/products/search?${params.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      // Search thường không cach
