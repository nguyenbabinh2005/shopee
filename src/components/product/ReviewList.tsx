"use client";

import { Star, MessageSquare, User, Calendar } from "lucide-react";
import { ReviewInfo } from "@/types/productDetail";
import { useState } from "react";

interface ReviewListProps {
  reviews: ReviewInfo[];
  total: number;
}

export default function ReviewList({ reviews, total }: ReviewListProps) {
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Đánh giá (0)
          </h3>
          <p className="text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Count ratings by star
  const ratingCounts = [5, 4, 3, 2, 1].map(star =>
    reviews.filter(r => r.rating === star).length
  );

  // Filter reviews based on selected star
  const filteredReviews = selectedFilter
    ? reviews.filter(r => r.rating === selectedFilter)
    : reviews;

  return (
    <div className="mt-10">
      {/* Header with statistics */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 mb-6 border border-orange-200">
        <div className="flex items-start gap-6">
          {/* Average rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-600 mb-2">
              {averageRating}
            </div>
            <div className="flex items-center gap-0.5 justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(Number(averageRating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-300 text-gray-300'
                    }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {total} đánh giá
            </p>
          </div>

          {/* Rating distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star, idx) => {
              const count = ratingCounts[idx];
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium text-gray-700">{star}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Star filter buttons */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedFilter(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === null
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500'
            }`}
        >
          Tất cả ({total})
        </button>
        {[5, 4, 3, 2, 1].map((star, idx) => {
          const count = ratingCounts[idx];
          if (count === 0) return null;

          return (
            <button
              key={star}
              onClick={() => setSelectedFilter(star)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${selectedFilter === star
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500'
                }`}
            >
              {star} <Star className="w-4 h-4 fill-current" /> ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews list */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
        {selectedFilter ? `${selectedFilter} sao (${filteredReviews.length})` : `Tất cả đánh giá (${filteredReviews.length})`}
      </h3>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.reviewId}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block">
                    {review.userName}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${index < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="pl-13">
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
              )}
              <p className="text-gray-700 leading-relaxed">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && selectedFilter && (
        <div className="text-center py-8 text-gray-500">
          Không có đánh giá {selectedFilter} sao
        </div>
      )}
    </div>
  );
}