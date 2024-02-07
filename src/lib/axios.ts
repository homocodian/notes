import { useAuthStore } from "@/store/auth";
import { Capacitor } from "@capacitor/core";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: Capacitor.isNativePlatform()
    ? import.meta.env.VITE_BASE_URL_FOR_CAPACITOR
    : import.meta.env.VITE_BASE_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const uid = useAuthStore.getState().user?.uid;

    if (!token || !uid) {
      throw new Error("Unauthorized");
    }

    config.params = {
      user: uid,
    };

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export { axiosInstance };
