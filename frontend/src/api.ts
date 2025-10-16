import axios from "axios";

export const COMMON_URL = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export const AUTH_URL = axios.create({
    baseURL: "http://localhost:3000/auth",
    withCredentials: true,
});
