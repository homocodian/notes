import { Capacitor } from "@capacitor/core";
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.timeout = 25000;
axiosInstance.defaults.baseURL = Capacitor.isNativePlatform()
  ? import.meta.env.VITE_BASE_URL_FOR_CAPACITOR
  : import.meta.env.VITE_BASE_URL;

function getAxiosInstance(token: string) {
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = 25000;
  axiosInstance.defaults.baseURL = Capacitor.isNativePlatform()
    ? import.meta.env.VITE_BASE_URL_FOR_CAPACITOR
    : import.meta.env.VITE_BASE_URL;
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  return axiosInstance;
}

export { axiosInstance, getAxiosInstance };
