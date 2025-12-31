"use client";

import { useState } from "react";
import { ImageInfo } from "@/types/productDetail";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: ImageInfo[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const primaryImage =
    images.find((img) => img.isPrimary) ?? images[0] ?? null;

  const [selectedImage, setSelectedImage] =
    useState<ImageInfo | null>(primaryImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const currentIndex = selectedImage 
    ? images.findIndex(img => img.imageId === selectedImage.imageId)
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
      setImageLoading(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
      setImageLoading(true);
    }
  };

  if (!selectedImage) {
    return (
      <div className="col-span-12 lg:col-span-5">
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-[500px] flex items-center justify-center border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-500 font-medium">Chưa có ảnh sản phẩm</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-5">
      {/* Main image container with zoom */}
      <div className="relative group">
        <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden h-[500px] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={selectedImage.imageUrl}
            alt="Product image"
            className={`max-h-full max-w-full object-contain p-8 transition-all duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => setIsZoomed(!isZoomed)}
            onLoad={() => setImageLoading(false)}
          />

          {/* Zoom indicator */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            aria-label="Zoom image"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 ${
                  currentIndex === 0
                    ? 'opacity-0 cursor-not-allowed'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110'
                }`}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === images.length - 1}
                className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 ${
                  currentIndex === images.length - 1
                    ? 'opacity-0 cursor-not-allowed'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110'
                }`}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails with scrollable container */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((img) => {
              const isActive = img.imageId === selectedImage.imageId;

              return (
                <button
                  key={img.imageId}
                  onClick={() => {
                    setSelectedImage(img);
                    setImageLoading(true);
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-orange-500 ring-offset-2 scale-105'
                      : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105'
                  }`}
                  aria-label={`View image ${images.indexOf(img) + 1}`}
                >
                  <img
                    src={img.imageUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-orange-500/10"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}