'use client';

interface CategoriesProps {
    categories: Array<{ id: number; name: string; icon?: string }>;
}

export default function Categories({ categories }: CategoriesProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-shadow hover:shadow-lg">
            <h2 className="text-gray-800 font-bold text-lg mb-5 flex items-center gap-2">
                <span className="text-orange-500">📋</span>
                DANH MỤC
            </h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                {categories.map((cat, idx) => (
                    <div
                        key={cat.id || idx}
                        className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300 shadow-sm group-hover:shadow-md">
                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                {cat.icon || '📦'}
                            </span>
                        </div>
                        <span className="text-xs text-center text-gray-700 group-hover:text-orange-500 font-medium transition-colors duration-300">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}