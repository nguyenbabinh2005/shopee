'use client';

import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { reviewApi } from '@/services/reviewApi';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    productName: string;
    orderId: number;
    userId: number;
    onSuccess?: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    orderId,
    userId,
    onSuccess,
}: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug: Check if user can review
    useEffect(() => {
        if (isOpen && userId && productId && orderId) {
            reviewApi.canReview(userId, productId, orderId)
                .then(can => {
                    console.log(`🔍 Checking canReview(uid=${userId}, pid=${productId}, oid=${orderId}) => ${can}`);
                    if (!can) {
                        // Optional: Warning or handle accordingly
                        console.warn("User is not allowed to review this product/order combination.");
                    }
                })
                .catch(err => console.error("Error checking canReview:", err));
        }
    }, [isOpen, userId, productId, orderId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating < 1 || rating > 5) {
            alert('Vui lòng chọn số sao!');
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewApi.createReview({
                userId,
                productId,
                orderId,
                rating,
                title: title.trim() || undefined,
                content: content.trim() || undefined,
            });

            alert('Đánh giá thành công!');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-6 border-b bg-gray-50">
                    <p className="text-sm text-gray-600 mb-1">Sản phẩm</p>
                    <p className="font-medium text-gray-900">{productName}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đánh giá của bạn <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-lg font-medium text-gray-700">
                                {rating} sao
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề (tùy chọn)
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề đánh giá..."
                            maxLength={200}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung (tùy chọn)
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
