'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    Ticket,
    Lock,
    Unlock,
    Shield,
    DollarSign,
    Package,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface UserDetail {
    userId: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    createdAt: string;
    gender?: string;
    birthday?: string;
}

interface UserVoucher {
    voucherId: number;
    code: string;
    discountType: string;
    discountAmount: number;
    minOrderValue: number;
    endDate: string;
    isActive: boolean;
}

interface UserOrder {
    orderId: number;
    orderNumber: string;
    createdAt: string;
    status: string;
    finalAmount: number;
    itemCount: number;
}

interface UserStats {
    totalOrders: number;
    totalSpent: number;
    activeVouchers: number;
    completedOrders: number;
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;

    const [user, setUser] = useState<UserDetail | null>(null);
    const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [stats, setStats] = useState<UserStats>({
        totalOrders: 0,
        totalSpent: 0,
        activeVouchers: 0,
        completedOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'info' | 'vouchers' | 'orders'>('info');

    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId]);

    const loadUserData = async () => {
        try {
            setLoading(true);

            // Load user details
            const userResponse = await fetch(`http://localhost:8080/api/admin/users/${userId}`);
            if (!userResponse.ok) throw new Error('Failed to load user');
            const userData = await userResponse.json();
            setUser(userData);

            // Load user vouchers
            try {
                const vouchersResponse = await fetch(`http://localhost:8080/api/admin/users/${userId}/vouchers`);
                if (vouchersResponse.ok) {
                    const vouchersData = await vouchersResponse.json();
                    setVouchers(vouchersData || []);
                }
            } catch (err) {
                console.log('Vouchers API not available');
                setVouchers([]);
            }

            // Load user orders
            try {
                const ordersResponse = await fetch(`http://localhost:8080/api/admin/users/${userId}/orders`);
                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    setOrders(ordersData || []);

                    // Calculate stats
                    const totalSpent = ordersData.reduce((sum: number, order: UserOrder) =>
                        sum + (order.finalAmount || 0), 0);
                    const completedOrders = ordersData.filter((o: UserOrder) =>
                        o.status === 'delivered').length;

                    setStats({
                        totalOrders: ordersData.length,
                        totalSpent,
                        activeVouchers: vouchers.length,
                        completedOrders
                    });
                }
            } catch (err) {
                console.log('Orders API not available');
                setOrders([]);
            }

        } catch (error) {
            console.error('Error loading user data:', error);
            alert('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!user) return;

        // Prevent locking first 5 admin accounts
        if (user.userId <= 5 && user.role === 'admin') {
            alert('Không thể khóa tài khoản admin hệ thống!');
            return;
        }

        const newStatus = user.status === 'active' ? 'locked' : 'active';
        const confirmed = window.confirm(
            `Bạn có chắc muốn ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản này?`
        );

        if (!confirmed) return;

        try {
            await fetch(`http://localhost:8080/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus.toUpperCase() })
            });

            alert(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản thành công!`);
            loadUserData();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            'pending': { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800' },
            'processing': { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
            'shipped': { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
            'delivered': { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
            'canceled': { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
        };

        const statusInfo = statusMap[status?.toLowerCase()] || { label: status, className: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                {statusInfo.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h2>
                    <Link href="/admin/users" className="text-orange-600 hover:text-orange-700">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết người dùng</h1>
                        <p className="text-gray-600">Quản lý thông tin và hoạt động của người dùng</p>
                    </div>
                    <button
                        onClick={handleToggleStatus}
                        disabled={user.userId <= 5 && user.role === 'admin'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${user.userId <= 5 && user.role === 'admin'
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : user.status?.toLowerCase() === 'active'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                    >
                        {user.status?.toLowerCase() === 'active' ? (
                            <>
                                <Lock className="w-4 h-4" />
                                {user.userId <= 5 && user.role === 'admin' ? 'Tài khoản Admin' : 'Khóa tài khoản'}
                            </>
                        ) : (
                            <>
                                <Unlock className="w-4 h-4" />
                                Mở khóa
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Tổng đơn hàng</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Tổng chi tiêu</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.totalSpent.toLocaleString('vi-VN')}₫
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <Package className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Đơn hoàn thành</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <Ticket className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Voucher đang có</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeVouchers}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'info'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Thông tin cá nhân
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('vouchers')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'vouchers'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                Vouchers ({vouchers.length})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'orders'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Đơn hàng ({orders.length})
                            </div>
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* User Info Tab */}
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>

                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tên người dùng</p>
                                        <p className="text-base font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">@{user.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-base font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                        <p className="text-base font-medium text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Vai trò</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái tài khoản</h3>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 mb-2">Trạng thái hiện tại</p>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${user.status?.toLowerCase() === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status?.toLowerCase() === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                                    </span>
                                </div>

                                {user.gender && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Giới tính</p>
                                        <p className="text-base font-medium text-gray-900">{user.gender}</p>
                                    </div>
                                )}

                                {user.birthday && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {new Date(user.birthday).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Vouchers Tab */}
                    {activeTab === 'vouchers' && (
                        <div>
                            {vouchers.length === 0 ? (
                                <div className="text-center py-12">
                                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Người dùng chưa có voucher nào</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vouchers.map((voucher) => (
                                        <div key={voucher.voucherId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-900">{voucher.code}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {voucher.discountType === 'percentage'
                                                            ? `Giảm ${voucher.discountAmount}%`
                                                            : `Giảm ${voucher.discountAmount.toLocaleString('vi-VN')}₫`
                                                        }
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${voucher.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {voucher.isActive ? 'Còn hạn' : 'Hết hạn'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Đơn tối thiểu: {voucher.minOrderValue.toLocaleString('vi-VN')}₫
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Hết hạn: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Người dùng chưa có đơn hàng nào</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orders.map((order) => (
                                                <tr key={order.orderId} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                        {order.orderNumber}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {getStatusBadge(order.status)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {order.itemCount} sản phẩm
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                                        {order.finalAmount.toLocaleString('vi-VN')}₫
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
