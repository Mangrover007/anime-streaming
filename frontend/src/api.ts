import axios from "axios";

export const COMMON_URL = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});