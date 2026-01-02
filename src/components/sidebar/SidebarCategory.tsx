"use client";

export interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface SidebarCategoryProps {
  categories: Category[];
  currentId: number | null;
  onSelect: (id: number | null) => void;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  categories,
  currentId,
  onSelect,
}) => {
  // Flatten all categories (no hierarchy)
  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    cats.forEach(cat => {
      result.push({ id: cat.id, name: cat.name });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children));
      }
    });
    return result;
  };

  const allCategories = flattenCategories(categories);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base font-semibold text-gray-800 mb-3 px-2">
        Danh mục
      </h3>

      {/* Tất cả sản phẩm */}
      <div
        onClick={() => onSelect(null)}
        className={`
          cursor-pointer select-none
          py-2 px-3 mb-2 rounded-md
          text-sm transition
          ${
            currentId === null
              ? "bg-orange-100 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        Tất cả sản phẩm
      </div>

      {/* Scrollable category list */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-1">
        {allCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              cursor-pointer select-none
              py-2 px-3 rounded-md
              text-sm transition
              ${
                currentId === cat.id
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarCategory;