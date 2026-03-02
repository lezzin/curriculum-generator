import type { AxiosInstance } from "axios";
import axios from "axios";
import { config } from "../../config/variables.config";

export const api: AxiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});