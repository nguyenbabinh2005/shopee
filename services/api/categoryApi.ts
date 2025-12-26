// services/api/categoryApi.ts

import type { Category } from '@/types/category.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 1. Lấy tất cả danh mục đang active
 * GET /api/categories/active
 */
export async function getActiveCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories/active`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Server Component cache an toàn
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Không thể tải danh mục');
  }

  return response.json();
}

/**
 * 2. Lấy danh mục gốc
 * GET /api/categories/root
 */
export async function getRootCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories/root`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Không thể tải danh mục gốc');
  }

  return response.json();
}

/**
 * 3. Lấy danh mục con theo parentId
 * GET /api/categories/{parentId}/children
 */
export async function getChildrenCategories(
  parentId: number
): Promise<Category[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/${parentId}/children`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error('Không thể tải danh mục con');
  }

  return response.json();
}
