'use client';
import { useEffect, useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccountSidebar from '@/components/account/AccountSidebar';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import ReviewModal from '@/components/review/ReviewModal';

export default function OrdersPage() {
  const { user, isInitialized, orders, setOrders, addToCart } = useShop();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'>('all');

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    productId: number;
    productName: string;
    orderId: number;
  }>({
    isOpen: false,
    productId: 0,
    productName: '',
    orderId: 0,
  });

  // Track review status for each order item
  const [reviewStatus, setReviewStatus] = useState<Record<string, boolean>>({});

  // ✅ Updated: Call backend API to cancel order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    try {
      const { orderApi } = await import('@/services/orderApi');
      const result = await orderApi.cancelOrder(Number(orderId));

      if (result.success) {
        // Update local state after successful backend update
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: "canceled" as const } : order
        );
        setOrders(updatedOrders);

        alert('Đơn hàng đã được hủy thành công!');

        // Refresh to get latest data from backend
        window.location.reload();
      } else {
        alert(result.message || 'Không thể hủy đơn hàng!');
      }
    } catch (error: any) {
      console.error('Error canceling order:', error);
      alert(error.message || 'Không thể hủy đơn hàng. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.push('/login');
      return;
    }

    // 🔥 Fetch orders from backend API instead of localStorage
    // 🔥 Fetch orders from backend API instead of localStorage
    const fetchOrders = async () => {
      try {
        if (!user.userId) {
          console.error('User ID is missing');
          return;
        }

        const { orderApi } = await import('@/services/orderApi');
        const ordersData = await orderApi.getUserOrders(user.userId);

        console.log('🔍 Raw orders from backend:', ordersData);
        if (ordersData.length > 0) {
          console.log('🔍 First order items:', ordersData[0].items);
          if (ordersData[0].items && ordersData[0].items.length > 0) {
            console.log('🔍 First item structure:', ordersData[0].items[0]);
          }
        }

        // Transform backend response to match frontend Order type
        const transformedOrders = ordersData.map((order: any) => {
          return {
            id: order.orderId.toString(),
            orderNumber: order.orderNumber,
            date: order.createdAt,
            status: order.status.toLowerCase(),
            totalAmount: Number(order.grandTotal),
            subtotal: Number(order.subtotal || 0),
            shippingFee: Number(order.shippingFee || 0),
            discount: Number(order.discountTotal || 0),
            paymentMethod: 'cod' as const, // Type assertion
            items: order.items?.map((item: any) => ({
              id: item.orderItemId.toString(),
              productId: item.variant?.products?.productId || item.productId || 0,
              variantId: item.variant?.variantId || item.variantId || 0,
              name: item.productName,
              price: Number(item.unitPrice),
              quantity: item.quantity,
              image: item.variant?.products?.images?.[0]?.imageUrl || '/placeholder.png',
              imageUrl: item.variant?.products?.images?.[0]?.imageUrl || '/placeholder.png',
            })) || [],
            customerInfo: {
              fullName: order.recipientName || (user as any).fullName || user.username || 'User',
              phone: order.phone || (user as any).phone || '',
              email: (user as any).email || '',
              address: order.shippingAddress || '',
              ward: order.ward || '',
              district: order.district || '',
              city: order.city || '',
            },
            note: order.note || '',
          };
        });

        // Sort orders by date (newest first)
        transformedOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setOrders(transformedOrders);

        const loadReviewStatus = async () => {
          const statusMap: Record<string, boolean> = {};
          const apiCalls: Promise<void>[] = [];

          for (const order of transformedOrders) {
            if (order.status === 'delivered') {
              for (const item of order.items) {
                const productId = (item as any).productId;
                if (productId && productId !== 0) {
                  apiCalls.push(
                    (async () => {
                      try {
                        const { reviewApi } = await import('@/services/reviewApi');
                        const canReview = await reviewApi.canReview(
                          user.userId!,
                          productId,
                          Number(order.id)
                        );
                        statusMap[`${order.id}-${productId}`] = !canReview;
                      } catch (error) {
                        console.error('Error loading review status:', error);
                      }
                    })()
                  );
                }
              }
            }
          }

          await Promise.all(apiCalls);
          setReviewStatus(statusMap);
        };

        loadReviewStatus();
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user, isInitialized, router, setOrders]);

  // Loading khi đang khởi tạo
  if (!isInitialized) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Đang tải...</div>
        </div>
      </div>
    );
  }

  // Loading khi đang redirect
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Đang chuyển hướng...</div>
        </div>
      </div>
    );
  }

  // Lọc đơn hàng theo tab
  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter(order => order.status === activeTab);

  // Labels cho status
  const statusLabels = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
    canceled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Breadcrumb items={[
          { label: 'Tài khoản', href: '/account' },
          { label: 'Đơn Hàng Của Tôi' }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR BÊN TRÁI */}
          <div className="lg:col-span-1">
            <AccountSidebar user={user} avatarPreview={user.avatar ?? null} />
          </div>

          {/* NỘI DUNG CHÍNH BÊN PHẢI */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-8 px-6 pt-4 overflow-x-auto">
                  {['all', 'pending', 'processing', 'shipped', 'delivered', 'canceled'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`pb-3 whitespace-nowrap ${activeTab === tab
                        ? 'text-orange-500 border-b-2 border-orange-500 font-medium'
                        : 'text-gray-600 hover:text-orange-500'
                        }`}
                    >
                      {{
                        all: 'Tất cả',
                        pending: 'Chờ xác nhận',
                        processing: 'Đang xử lý',
                        shipped: 'Đang giao',
                        delivered: 'Đã giao',
                        canceled: 'Đã hủy',
                      }[tab]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="p-6 border-b">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo Tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    title="Làm mới danh sách"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Làm mới
                  </button>
                </div>
              </div>

              {/* Orders */}
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <svg
                      className="w-24 h-24 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      {activeTab === 'all'
                        ? 'Chưa có đơn hàng'
                        : 'Không có đơn hàng ở trạng thái này'}
                    </p>
                    <Link
                      href="/"
                      className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors"
                    >
                      Mua sắm ngay
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-gray-800">
                            Đơn hàng {order.orderNumber}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].color}`}
                          >
                            {statusLabels[order.status].label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map(item => (
                          <div key={item.itemId} className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-orange-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                              {item.image}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 line-clamp-2 mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Số lượng: x{item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-orange-600 font-semibold whitespace-nowrap">
                                {item.price.toLocaleString('vi-VN')}₫
                              </p>
                              {order.status === 'delivered' && (
                                <>
                                  {reviewStatus[`${order.id}-${(item as any).productId}`] ? (
                                    <span className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded">
                                      Đã đánh giá
                                    </span>
                                  ) : (
                                    <button
                                      onClick={async () => {
                                        const productId = (item as any).productId;

                                        if (!productId || productId === 0) {
                                          alert('Không thể đánh giá sản phẩm này');
                                          return;
                                        }

                                        try {
                                          const { reviewApi } = await import('@/services/reviewApi');
                                          const canReview = await reviewApi.canReview(
                                            user.userId!,
                                            productId,
                                            Number(order.id)
                                          );

                                          if (!canReview) {
                                            setReviewStatus(prev => ({
                                              ...prev,
                                              [`${order.id}-${productId}`]: true
                                            }));
                                            alert('Bạn đã đánh giá sản phẩm này rồi!');
                                            return;
                                          }
                                        } catch (error) {
                                          console.error('Error checking review status:', error);
                                        }

                                        setReviewModal({
                                          isOpen: true,
                                          productId: productId,
                                          productName: item.productName,
                                          orderId: Number(order.id),
                                        });
                                      }}
                                      className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                      Đánh giá
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Customer info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Người nhận:</span>{' '}
                            {order.customerInfo.fullName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">SĐT:</span>{' '}
                            {order.customerInfo.phone}
                          </p>
                          <p className="text-gray-700 md:col-span-2">
                            <span className="font-medium">Địa chỉ:</span>{' '}
                            {order.customerInfo.address},{' '}
                            {order.customerInfo.ward},{' '}
                            {order.customerInfo.district},{' '}
                            {order.customerInfo.city}
                          </p>
                          {order.customerInfo.email && (
                            <p className="text-gray-700">
                              <span className="font-medium">Email:</span>{' '}
                              {order.customerInfo.email}
                            </p>
                          )}
                          <p className="text-gray-700">
                            <span className="font-medium">Thanh toán:</span>{' '}
                            {order.paymentMethod === 'cod'
                              ? 'COD'
                              : 'Chuyển khoản'}
                          </p>
                          {order.customerInfo.note && (
                            <p className="text-gray-700 md:col-span-2">
                              <span className="font-medium">Ghi chú:</span>{' '}
                              {order.customerInfo.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tổng tiền + nút */}
                      <div className="pt-4 border-t">
                        {/* Price breakdown */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-700">
                              <span>Tạm tính:</span>
                              <span>{((order as any).subtotal || 0).toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                              <span>Phí vận chuyển:</span>
                              <span>{((order as any).shippingFee || 0).toLocaleString('vi-VN')}₫</span>
                            </div>
                            {(order as any).discount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Giảm giá:</span>
                                <span>-{((order as any).discount || 0).toLocaleString('vi-VN')}₫</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-orange-600 text-lg pt-2 border-t">
                              <span>Tổng cộng:</span>
                              <span>{(order.totalAmount || 0).toLocaleString('vi-VN')}₫</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                              >
                                Hủy đơn
                              </button>
                            )}
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => {
                                  // Collect valid items from order
                                  const validItems = order.items.filter(
                                    (item: any) => item.variantId && item.variantId !== 0
                                  );

                                  if (validItems.length === 0) {
                                    alert('Không có sản phẩm hợp lệ để mua lại!');
                                    return;
                                  }

                                  // Store items in localStorage for checkout
                                  localStorage.setItem('reorderItems', JSON.stringify(validItems));

                                  // Navigate to checkout with reorder mode
                                  router.push('/checkout?mode=reorder');
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                              >
                                Mua lại
                              </button>
                            )}
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                              Liên hệ Shop
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {user && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
          productId={reviewModal.productId}
          productName={reviewModal.productName}
          orderId={reviewModal.orderId}
          userId={user.userId || 0}
          onSuccess={() => {
            alert('Cảm ơn bạn đã đánh giá!');
            window.location.reload(); // Reload to update order status
          }}
        />
      )}
    </div>
  );
}