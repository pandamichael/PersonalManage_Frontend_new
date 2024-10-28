import axios from "axios";

// 建立 axios 實例，設置 API 基礎 URL 和通用請求標頭
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL + "/api", // 使用環境變數設定 API 基礎路徑
  headers: {
    "Content-Type": "application/json",// 每個請求都帶上 JSON 資料類型
  },
  withCredentials: true, // 確保每次請求都會附帶 cookie
});

// 設定 response 攔截器來處理錯誤
apiClient.interceptors.response.use(
  (response) => {
    return response;// 如果回應成功，直接返回資料
  },
  (error) => {
    if (error.response && error.response.data) {
      const { code } = error.response.data;
      // Session 驗證失敗
      if (code === -3003) {
        // Session 驗證失敗，移除本地存儲的使用者資訊，並重新導向到登入頁面
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);// 返回 Promise 錯誤以供後續處理
  }
);

const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};
 
export default api;// 將 API 模組匯出以供其他模組使用  
