"use client";

import { VariantInfo } from "@/types/productDetail";
import { Package, CheckCircle2 } from "lucide-react";

interface VariantSelectorProps {
  variants: VariantInfo[];
  selected: VariantInfo | null;
  onSelect: (variant: VariantInfo) => void;
}

/**
 * Parse attributesJson → "color: red · size: M"
 */
function parseAttributes(attributesJson: string): string {
  try {
    const obj = JSON.parse(attributesJson) as Record<string, string>;
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ");
  } catch {
    return "";
  }
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
        Phân loại sản phẩm
      </h3>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selected?.variantId === variant.variantId;
          const isOutOfStock = variant.quantity <= 0;

          return (
            <button
              key={variant.variantId}
              disabled={isOutOfStock}
              onClick={() => onSelect(variant)}
              className={`
                relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-400 hover:shadow-md"
                }
                ${
                  isOutOfStock
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                }
              `}
            >
              <div className="flex items-center gap-2">
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{parseAttributes(variant.attributesJson)}</span>
              </div>
              
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                  <span className="text-xs font-semibold text-red-600">Hết hàng</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Số lượng còn lại</p>
            <p className="text-lg font-bold text-green-700">
              {selected.quantity} sản phẩm
            </p>
          </div>
        </div>
      )}
    </div>
  );
}