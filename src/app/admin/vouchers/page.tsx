'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import adminApi from '@/services/adminApi';

interface Voucher {
    voucherId: number;
    code: string;
    discountType: string;
    discountAmount: number;
    maxDiscount: number | null;
    minOrderValue: number | null;
    maxUsage: number | null;
    usageCount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export default function VouchersManagement() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadVouchers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVouchers(vouchers);
        } else {
            const filtered = vouchers.filter(v =>
                v.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredVouchers(filtered);
        }
    }, [searchQuery, vouchers]);

    const loadVouchers = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getVouchers(0, 500);
            console.log('📦 Vouchers API Response:', data);
            console.log('📦 Vouchers Content:', data.content || data);
            setVouchers(data.content || data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading vouchers:', error);
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            await adminApi.toggleVoucher(id);
            alert(`Đã ${currentStatus ? 'vô hiệu hóa' : 'kích hoạt'} voucher!`);
            loadVouchers();
        } catch (error) {
            console.error('Error toggling voucher:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa voucher này?')) return;

        try {
            await adminApi.deleteVoucher(id);
            alert('Đã xóa voucher!');
            loadVouchers();
        } catch (error) {
            console.error('Error deleting voucher:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Vouchers</h1>
                    <p className="text-gray-600">Tạo và quản lý mã giảm giá</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadVouchers}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        🔄 Làm mới
                    </button>
                    <button
                        onClick={() => {
                            setEditingVoucher(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm voucher
                    </button>
                </div>
            </div>

            {/* Search Box */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo mã voucher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {searchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                        Tìm thấy {filteredVouchers.length} voucher
                    </p>
                )}
            </div>

            {/* Vouchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                ) : filteredVouchers.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {searchQuery ? 'Không tìm thấy voucher nào' : 'Chưa có voucher nào'}
                        </p>
                    </div>
                ) : (
                    filteredVouchers.map((voucher) => (
                        <div
                            key={voucher.voucherId}
                            className={`bg-white rounded-lg shadow-md p-6 border-2 ${voucher.isActive ? 'border-green-200' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-orange-500" />
                                    <span className="font-bold text-lg">{voucher.code}</span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${voucher.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {voucher.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Giảm giá:</span>
                                    <span className="font-medium">
                                        {voucher.discountType.toLowerCase() === 'percentage'
                                            ? `${voucher.discountAmount}%`
                                            : `${voucher.discountAmount.toLocaleString('vi-VN')}₫`}
                                    </span>
                                </div>
                                {voucher.maxDiscount && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Giảm tối đa:</span>
                                        <span className="font-medium">{voucher.maxDiscount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                )}
                                {voucher.minOrderValue && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Đơn tối thiểu:</span>
                                        <span className="font-medium">{voucher.minOrderValue.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Đã sử dụng:</span>
                                    <span className="font-medium">
                                        {voucher.usageCount}/{voucher.maxUsage || '∞'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Hết hạn:</span>
                                    <span className="font-medium">{voucher.endDate}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => handleToggleActive(voucher.voucherId, voucher.isActive)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded ${voucher.isActive
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {voucher.isActive ? (
                                        <>
                                            <ToggleLeft className="w-4 h-4" />
                                            Tắt
                                        </>
                                    ) : (
                                        <>
                                            <ToggleRight className="w-4 h-4" />
                                            Bật
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingVoucher(voucher);
                                        setShowModal(true);
                                    }}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(voucher.voucherId)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Add/Edit Voucher */}
            {showModal && (
                <VoucherFormModal
                    voucher={editingVoucher}
                    onClose={() => {
                        setShowModal(false);
                        setEditingVoucher(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingVoucher(null);
                        loadVouchers();
                    }}
                />
            )}
        </div>
    );
}

// Voucher Form Modal Component
function VoucherFormModal({ voucher, onClose, onSuccess }: {
    voucher: Voucher | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        code: voucher?.code || '',
        discountType: voucher?.discountType.toLowerCase() || 'percentage',
        discountAmount: voucher?.discountAmount?.toString() || '',
        maxDiscount: voucher?.maxDiscount?.toString() || '',
        minOrderValue: voucher?.minOrderValue?.toString() || '',
        maxUsage: voucher?.maxUsage?.toString() || '',
        startDate: voucher?.startDate ? voucher.startDate.slice(0, 16) : '',
        endDate: voucher?.endDate ? voucher.endDate.slice(0, 16) : '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                code: formData.code,
                discountType: formData.discountType,
                discountAmount: parseFloat(formData.discountAmount),
                maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
                maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            if (voucher) {
                await adminApi.updateVoucher(voucher.voucherId, payload);
            } else {
                await adminApi.createVoucher(payload);
            }

            alert(voucher ? 'Đã cập nhật voucher!' : 'Đã tạo voucher mới!');
            onSuccess();
        } catch (error) {
            console.error('Error saving voucher:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-4">
                    {voucher ? 'Sửa voucher' : 'Thêm voucher mới'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Mã voucher *</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full border rounded px-3 py-2"
                            required
                            placeholder="VD: VOUCHER_001"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Loại giảm giá *</label>
                            <select
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="percentage">Phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định (₫)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Giá trị giảm *</label>
                            <input
                                type="number"
                                value={formData.discountAmount}
                                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Giảm tối đa (₫)</label>
                            <input
                                type="number"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Đơn tối thiểu (₫)</label>
                            <input
                                type="number"
                                value={formData.minOrderValue}
                                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Giới hạn sử dụng</label>
                        <input
                            type="number"
                            value={formData.maxUsage}
                            onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            min="1"
                            placeholder="Để trống = không giới hạn"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Thời gian bắt đầu *</label>
                            <input
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Thời gian kết thúc *</label>
                            <input
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            {voucher ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
