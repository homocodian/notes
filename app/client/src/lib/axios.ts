import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/v1",
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const token = useAuthStore.getState().token;
//     const user = useAuthStore.getState().user;
//     const setToken = useAuthStore.getState().setToken;

//     if (!user?.uid) {
//       throw new Error("Unauthorized");
//     }

//     let refreshedToken: string | null = null;

//     if (!token) {
//       refreshedToken = await getIdToken(user);
//       setToken(refreshedToken);
//     }

//     config.params = {
//       user: user.uid,
//     };

//     config.headers.Authorization = `Bearer ${token ?? refreshedToken}`;
//     return config;
//   },

//   (error) => {
//     return Promise.reject(error);
//   },
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     if (
//       error?.response?.status === 401 &&
//       error?.response?.data === "token-expired"
//     ) {
//       const user = useAuthStore.getState().user;
//       const setToken = useAuthStore.getState().setToken;

//       if (!user?.uid) {
//         throw new Error("Unauthorized");
//       }

//       const refreshedToken = await getIdToken(user);
//       setToken(refreshedToken);
//     }
//     return Promise.reject(error);
//   },
// );

export { axiosInstance };
