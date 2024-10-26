import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 確保每次請求都會附帶 cookie
});

// 設定 response 攔截器來處理錯誤
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      const { code } = error.response.data;
      // Session 驗證失敗
      if (code === -3003) {
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default api;
