// services/api/authApi.ts

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  // ❗ Xử lý lỗi giống logic cũ của bạn
  if (!response.ok) {
    if (response.status === 401) {
      return {
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      };
    }

    const errorText = await response.text();
    throw new Error(errorText || 'Đăng nhập thất bại');
  }

  return response.json();
}
