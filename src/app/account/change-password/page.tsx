'use client';

import { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export default function ChangePasswordPage() {
  const { user } = useShop();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect nếu chưa đăng nhập
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    // Validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Kiểm tra mật khẩu hiện tại
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      if (userData.password !== formData.currentPassword) {
        setErrors({ currentPassword: 'Mật khẩu hiện tại không đúng' });
        return;
      }

      // Cập nhật mật khẩu mới
      userData.password = formData.newPassword;
      localStorage.setItem('user', JSON.stringify(userData));

      // Hiển thị thông báo thành công
      setShowSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* Thông báo thành công */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          ✓ Đổi mật khẩu thành công!
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        <Breadcrumb items={[
          { label: 'Tài khoản', href: '/account' },
          { label: 'Đổi Mật Khẩu' }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <AccountSidebar user={user} avatarPreview={user.avatar ?? null} />
          </div>

          {/* FORM ĐỔI MẬT KHẨU */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="border-b pb-4 mb-6">
                <h1 className="text-xl font-medium text-gray-800">Đổi Mật Khẩu</h1>
                <p className="text-sm text-gray-500 mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
              </div>

              <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Mật khẩu hiện tại */}
                  <div className="flex items-start">
                    <label className="w-40 text-right pr-6 text-gray-600 pt-3">Mật khẩu hiện tại</label>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                          placeholder="Nhập mật khẩu hiện tại"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="flex items-start">
                    <label className="w-40 text-right pr-6 text-gray-600 pt-3">Mật khẩu mới</label>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="flex items-start">
                    <label className="w-40 text-right pr-6 text-gray-600 pt-3">Xác nhận mật khẩu</label>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Nhập lại mật khẩu mới"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Nút xác nhận */}
                  <div className="flex items-center">
                    <div className="w-40"></div>
                    <div className="flex-1">
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-medium transition-colors"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>

                  {/* Gợi ý bảo mật */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-gray-800 mb-2">💡 Gợi ý tạo mật khẩu mạnh:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sử dụng ít nhất 6 ký tự</li>
                      <li>• Kết hợp chữ hoa, chữ thường và số</li>
                      <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                      <li>• Không chia sẻ mật khẩu cho người khác</li>
                    </ul>
                  </div>

                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}