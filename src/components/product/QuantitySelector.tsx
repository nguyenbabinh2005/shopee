'use client';

import { Minus, Plus } from 'lucide-react';

interface Props {
  quantity: number;
  max: number;
  onChange: (q: number) => void;
}

export default function QuantitySelector({ quantity, max, onChange }: Props) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= max) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Số lượng
      </label>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>

          <input
            type="number"
            min={1}
            max={max}
            value={quantity}
            onChange={handleInputChange}
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
          />

          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= max}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <span className="text-sm text-gray-500">
          {max > 0 ? `${max} sản phẩm có sẵn` : 'Hết hàng'}
        </span>
      </div>
    </div>
  );
}
