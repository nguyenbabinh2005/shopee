"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import Link from "next/link";
import { Eye, EyeOff, ShoppingBag, Lock, User, Mail, UserCircle } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useShop();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.username || !formData.name || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }

    try {
      console.log('📝 [REGISTER] Attempting registration...');
      console.log('📝 [REGISTER] Username:', formData.username);
      console.log('📝 [REGISTER] Email:', formData.email);

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.name,
        }),
      });

      console.log('📥 [REGISTER] Response status:', response.status);

      // Kiểm tra nếu response rỗng (201 Created nhưng không có body)
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('📦 [REGISTER] Response data:', data);
      } else {
        console.log('📦 [REGISTER] No JSON response body');
        data = {};
      }

      if (response.ok) {
        console.log('✅ [REGISTER] Registration successful!');

        // Nếu có userId trong response, lưu thông tin và đăng nhập luôn
        if (data.userId) {
          const userData = {
            userId: data.userId,
            username: data.username || formData.username,
            name: data.fullName || formData.name,
            email: data.email || formData.email,
            phone: data.phone || "",
            role: data.role || "customer",
            status: data.status || "active",
            gender: "",
            birthday: "",
            avatar: null,
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userId', data.userId.toString());
          if (data.cartId) {
            localStorage.setItem('cartId', data.cartId.toString());
          }

          alert("Đăng ký thành công!");
          router.push("/");
        } else {
          // Lưu username vừa đăng ký để hiển thị ở trang login
          localStorage.setItem('registeredUsername', formData.username);

          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          router.push("/login");
        }
      } else {
        console.error('❌ [REGISTER] Registration failed');
        const errorMessage = data.message || "Đăng ký thất bại. Vui lòng thử lại!";

        // Kiểm tra lỗi cụ thể
        if (errorMessage.includes("username") || errorMessage.includes("Username")) {
          setError("Tên đăng nhập đã tồn tại!");
        } else if (errorMessage.includes("email") || errorMessage.includes("Email")) {
          setError("Email đã được sử dụng!");
        } else {
          setError(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("💥 [REGISTER] Exception:", error);
      console.error("💥 [REGISTER] Error message:", error.message);
      setError("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">

        {/* LEFT SIDE - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center text-white space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
              <ShoppingBag className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          <h1 className="text-5xl font-bold drop-shadow-lg">MyShop</h1>
          <p className="text-xl text-center text-white/90 max-w-md leading-relaxed">
            Tham gia cộng đồng mua sắm lớn nhất Việt Nam
          </p>

          {/* Features */}
          <div className="space-y-4 mt-8 w-full max-w-sm">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Giao hàng siêu tốc</div>
                <div className="text-sm text-white/80">Miễn phí vận chuyển toàn quốc</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Đảm bảo hoàn tiền</div>
                <div className="text-sm text-white/80">100% an toàn & bảo mật</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Register Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 space-y-6 max-h-[90vh] overflow-y-auto">

          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-6">
            <div className="bg-orange-500 p-3 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">MyShop</h2>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h2>
            <p className="text-gray-500">Tạo tài khoản mới để bắt đầu mua sắm</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Tối thiểu 3 ký tự"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Display Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên hiển thị <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserCircle className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <button type="button" className="text-orange-500 hover:text-orange-600 font-medium">
                  Điều khoản dịch vụ
                </button>
                {" "}và{" "}
                <button type="button" className="text-orange-500 hover:text-orange-600 font-medium">
                  Chính sách bảo mật
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang đăng ký...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc đăng ký với</span>
              </div>
            </div>

            {/* Social Register */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600 pt-2">
              Đã có tài khoản MyShop?{" "}
              <Link
                href="/login"
                className="text-orange-500 font-semibold hover:text-orange-600 transition"
              >
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}