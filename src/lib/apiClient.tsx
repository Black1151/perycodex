import axios from "axios";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: process.env.BE_URL,
});

apiClient.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (config.headers) {
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
  }

  return config;
});

export default apiClient;
