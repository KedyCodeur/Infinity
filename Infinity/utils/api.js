import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageGetItem, storageSetItem } from "@/utils/storage.js";

let apiInstance = null;

const getApi = async () => {
  if (apiInstance) return apiInstance;

  const webAdress = await storageGetItem("webAdress");

  if (!webAdress) throw new Error("webAdress not found");

  const baseURL = "http://" + webAdress;

  apiInstance = axios.create({ baseURL });

  apiInstance.interceptors.request.use(async (config) => {
    const token = await storageGetItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await storageGetItem("refreshToken");
          const webAdress = await storageGetItem("webAdress");
          const baseURL = "http://" + webAdress;

          const res = await axios.post(`${baseURL}/refresh`, { refreshToken });
          const newToken = res.data.accessToken;

          await storageSetItem("accessToken", newToken);

          apiInstance = null;

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          
          const freshApi = await getApi();
          return freshApi(originalRequest);
        } catch (e) {
          apiInstance = null;
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default getApi;