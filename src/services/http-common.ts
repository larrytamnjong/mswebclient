// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:8000/api",
//   headers: {
//     "Content-type": "application/json",
//     "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2MjAwNTg0LCJpYXQiOjE3NTYxOTY5ODQsImp0aSI6ImY3NTg5OTY2MzFiYzQ0ZGZhZTgwZTU0OWZmNTJlMWYxIiwidXNlcl9pZCI6IjEifQ.q7mHfJYYtb4ZLlY86cqCSGtoMURCB4lrFoobyTgC5po`
//   }
// });

import axios from "axios";
import AuthService from "./AuthService";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AuthService.login(); 
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await AuthService.refreshTokenIfNeeded();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest); 
      } catch (err) {
        console.error("Token refresh failed", err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
