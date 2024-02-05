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

function getInterceptor(token: string) {
  const id = axiosInstance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },

    (error) => {
      return Promise.reject(error);
    },
  );
  return id;
}

function destroyInterceptor() {
  axiosInstance.interceptors.request.clear();
}

export { axiosInstance, destroyInterceptor, getInterceptor };
