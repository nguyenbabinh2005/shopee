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
  const renderCat = (cats: Category[], level = 0) => {
    return cats.map((cat, index) => {
      const key = `${level}-${cat.id}-${index}`;

      const hasChildren = cat.children && cat.children.length > 0;

      return (
        <div key={key}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(cat.id);
            }}
            className={`
              cursor-pointer select-none
              py-2 rounded-md
              text-sm transition
              flex items-center justify-between
              ${
                currentId === cat.id
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
            style={{ paddingLeft: `${level * 20 + 16}px` }}
          >
            <span>{cat.name}</span>
            {hasChildren && <span className="text-gray-400">›</span>}
          </div>

          {hasChildren && renderCat(cat.children!, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        Danh mục
      </h3>

      {/* Tất cả sản phẩm */}
      <div
        onClick={() => onSelect(null)}
        className={`
          cursor-pointer select-none
          py-2 px-4 mb-2 rounded-md
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

      <div className="space-y-1">{renderCat(categories || [])}</div>
    </div>
  );
};

export default SidebarCategory;
