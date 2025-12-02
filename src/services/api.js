import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // backend IP + port
  withCredentials: true, // gửi cookie / session
});

export default api;
