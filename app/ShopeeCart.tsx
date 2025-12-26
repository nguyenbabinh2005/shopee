'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Tag, Package, Loader2 } from 'lucide-react';

// Import API functions với đường dẫn tương đối
import {
  getCartDetail,
  updateCartQuantity,
  deleteCartItem,
} from '../services/api/cartApi';

// Import types với đường dẫn tương đối
import type { CartDetailResponse } from '../services/types/cart.types';

// Helper để parse attributesJson
function parseAttributes(json: string): string {
  try {
    const attrs = JSON.parse(json);
    return Object.entries(attrs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  } catch {
    return json;
  }
}

export default function ShopeeCart() {
  // ==================== STATE ====================
  const [cartData, setCartData] = useState<CartDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  
  // Voucher state
  const [voucher, setVoucher] = useState<string>("");
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);

  // ID giỏ hàng - TODO: Lấy từ user session
  const cartId = 1;

  // ==================== FETCH CART DATA ====================
  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching cart data...');
      const data = await getCartDetail(cartId);
      
      setCartData(data);
      console.log('✅ Cart data loaded:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      console.error('❌ Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== UTILITY FUNCTIONS ====================
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  // ==================== QUANTITY HANDLERS ====================
  const handleQuantityChange = async (
    itemId: number,
    variantId: number,
    delta: number
  ) => {
    const action = delta > 0 ? 'increase' : 'decrease';
    
    try {
      setUpdating(true);
      
      console.log(`🔄 Updating quantity: variantId=${variantId}, action=${action}`);
      
      const response = await updateCartQuantity(cartId, variantId, action);
      
      console.log('✅ Quantity updated:', response);
      
      if (cartData) {
        const updatedItems = cartData.items.map(item =>
          item.variantId === variantId
            ? { ...item, quantity: response.quantity, lineTotal: response.lineTotal }
            : item
        );
        
        setCartData({
          ...cartData,
          items: updatedItems,
          totalAmount: response.totalAmount
        });
      }
      
    } catch (err) {
      console.error('❌ Error updating quantity:', err);
      alert('Không thể cập nhật số lượng. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  // ==================== DELETE HANDLERS ====================
  const handleDeleteProduct = async (itemId: number, variantId: number) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      setUpdating(true);
      
      console.log(`🗑️ Deleting item: variantId=${variantId}`);
      
      const updatedCart = await deleteCartItem(cartId, variantId);
      
      console.log('✅ Item deleted, updated cart:', updatedCart);
      
      setCartData(updatedCart);
      
    } catch (err) {
      console.error('❌ Error deleting item:', err);
      alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  // ==================== VOUCHER HANDLERS ====================
  const handleApplyVoucher = async () => {
    if (!voucher.trim()) {
      alert('Vui lòng nhập mã giảm giá');
      return;
    }

    alert('Chức năng áp dụng voucher sẽ được tích hợp ở trang checkout');
  };

  // ==================== CHECKOUT HANDLER ====================
  const handleCheckout = async () => {
    if (!cartData || cartData.items.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    alert('Sẽ chuyển đến trang checkout với các sản phẩm trong giỏ');
    console.log('🛒 Checkout with items:', cartData.items);
  };

  // ==================== CALCULATIONS ====================
  const subtotal = cartData?.totalAmount || 0;
  const shippingFee = 30000;
  const total = subtotal + shippingFee - voucherDiscount;

  // ==================== RENDER: LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // ==================== RENDER: ERROR ====================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchCartData}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ==================== RENDER: EMPTY CART ====================
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-orange-500" size={28} />
              <h1 className="text-2xl font-bold text-gray-800">Giỏ Hàng</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  // ==================== RENDER: MAIN UI ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-orange-500" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Giỏ Hàng</h1>
            {updating && (
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            )}
            <span className="ml-auto text-gray-600">
              {cartData.items.length} sản phẩm
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cartData.items.map((item) => (
                <div key={item.itemId} className="p-4 border-b last:border-b-0 flex items-start gap-4">
                  
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Package className="text-gray-400" size={32} />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {parseAttributes(item.attributesJson)}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-500 font-medium">
                        {formatCurrency(item.finalPrice)}
                      </span>
                      {item.discountSnapshot > 0 && (
                        <span className="text-gray-400 text-sm line-through">
                          {formatCurrency(item.priceSnapshot)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => handleQuantityChange(item.itemId, item.variantId, -1)}
                          disabled={updating || item.quantity <= 1}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="px-4 border-x">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.itemId, item.variantId, 1)}
                          disabled={updating}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-orange-500 font-medium">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleDeleteProduct(item.itemId, item.variantId)}
                      className="p-2 hover:bg-red-50 rounded disabled:opacity-50"
                      disabled={updating}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Tóm Tắt Đơn Hàng</h2>

              {/* Voucher */}
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="text-orange-500" size={18} />
                  <span className="font-medium text-sm">Mã Giảm Giá</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                  <button 
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                  >
                    Áp Dụng
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Voucher giảm giá</span>
                    <span className="text-green-600">-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Tổng Cộng</span>
                <span className="text-2xl font-bold text-orange-500">
                  {formatCurrency(total)}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={updating || !cartData || cartData.items.length === 0}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  updating || !cartData || cartData.items.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {updating ? 'Đang xử lý...' : `Mua Hàng (${cartData.items.length})`}
              </button>

              {/* Additional Info */}
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Package size={14} />
                  <span>Giao hàng tiêu chuẩn 3-5 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}