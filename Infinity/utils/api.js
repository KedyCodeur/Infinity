import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageGetItem, storageSetItem } from "@/utils/storage.js";
import * as SecureStore from 'expo-secure-store';

import { refToken } from '@/utils/refToken';
let apiInstance = null;

const getRefToken = async () => {
  const token = refToken.current || await SecureStore.getItemAsync('refreshToken');
  return token;
}

const getApi = async () => {
  if (apiInstance) return apiInstance;

  const webAdress = await storageGetItem("webAdress");

  if (!webAdress) throw new Error("webAdress not found");

  const baseURL = "http://" + webAdress;

  apiInstance = axios.create({ baseURL, timeout: 2000});

  apiInstance.interceptors.request.use(async (config) => {
    const token =  await storageGetItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!error.response) {
        return Promise.reject(error);
      }

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await getRefToken();
          const webAdress = await storageGetItem("webAdress");
          const baseURL = "http://" + webAdress;

          const res = await axios.post(`${baseURL}/refresh`, { refreshToken });
          const newToken = res.data.accessToken;

          await storageSetItem("accessToken", newToken);

     

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiInstance(originalRequest);
          
        } catch (e) {
          await AsyncStorage.removeItem("accessToken");
          await SecureStore.deleteItemAsync('refreshToken');

          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default getApi;