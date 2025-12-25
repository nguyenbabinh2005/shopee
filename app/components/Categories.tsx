'use client';

interface CategoriesProps {
    categories: Array<{ id: number; name: string; icon?: string }>;
}

export default function Categories({ categories }: CategoriesProps) {
    return (
        <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-gray-500 uppercase text-sm mb-4">Danh Mục</h2>
            <div className="grid grid-cols-10 gap-4">
                {categories.map((cat, idx) => (
                    <div key={cat.id || idx} className="flex flex-col items-center cursor-pointer hover:text-orange-500 transition">
                        <div className="text-4xl mb-2">{cat.icon || '📦'}</div>
                        <span className="text-xs text-center">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}