import api from "./api";

const productAPI = {
  // Lấy tất cả sản phẩm (dùng search với keyword rỗng)
  getAll: () => api.get("/products/search", { params: { keyword: "" } }),

  // Lấy sản phẩm theo ID
  getById: (id) => api.get(`/products/${id}`),

  // Lấy sản phẩm theo slug
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),

  // Lấy sản phẩm theo brand
  getByBrand: (brandId) => api.get(`/products/brand/${brandId}`),

  // Thêm sản phẩm mới
  add: (productData) => api.post("/products", productData),

  // Cập nhật sản phẩm
  update: (id, productData) => api.put(`/products/${id}`, productData),

  // Xóa sản phẩm
  delete: (id) => api.delete(`/products/${id}`)
};

export default productAPI; // ✅ sửa thành default export
