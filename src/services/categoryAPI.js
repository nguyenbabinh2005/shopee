// src/services/categoryAPI.js
import api from "./api";

const categoryAPI = {
  // Lấy tất cả danh mục đang active (đúng với backend bạn có)
  getActive: () => api.get("/api/categories/active"),

  // Lấy danh mục gốc
  getRoot: () => api.get("/api/categories/root"),

  // Lấy danh mục con theo parentId
  getChildren: (parentId) => api.get(`/api/categories/${parentId}/children`),
};

export default categoryAPI;