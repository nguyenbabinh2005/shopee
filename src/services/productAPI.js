// src/services/productAPI.js
import api from "./api";

const productAPI = {
  // LẤY TOP SẢN PHẨM BÁN CHẠY (cho trang Home)
  getTopProducts: () => api.get("/api/products/top-selling"),

  // FALLBACK: LẤY TOP 50
  getTop50: () => api.get("/api/products/top"),

  // LẤY TẤT CẢ (fallback nếu cần)
  getAll: () => api.get("/api/products/top-selling"), // dùng top-selling làm "tất cả"

  // LẤY SẢN PHẨM THEO CATEGORY
  getByCategory: (categoryId, page = 0, size = 40) => 
    api.get(`/api/categories/${categoryId}/products`, { params: { page, size } }),

  // TÌM KIẾM
  search: (keyword = "") => api.get("/api/products/search", { params: { keyword } }),

  // LẤY CHI TIẾT
  getById: (id) => api.get(`/api/products/${id}`),
};

export default productAPI;