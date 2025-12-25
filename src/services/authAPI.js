// src/services/authAPI.js
import api from "./api";

const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post("/api/auth/login", { username, password });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
        };
      }
      throw error; // để AuthContext bắt
    }
  },
};

export default authAPI;