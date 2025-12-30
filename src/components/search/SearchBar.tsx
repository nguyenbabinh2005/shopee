"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full bg-white rounded-sm overflow-hidden shadow"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="flex-1 px-4 h-10 text-gray-800 outline-none bg-white"
      />
      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 px-6 text-white flex items-center"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}