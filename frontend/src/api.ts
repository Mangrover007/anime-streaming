import axios from "axios";
const _baseURL = import.meta.env.BASE_URL;

export const COMMON_URL = axios.create({
    baseURL: _baseURL,
    withCredentials: true,
});

export const AUTH_URL = axios.create({
    baseURL: _baseURL + "auth",
    withCredentials: true,
});

export const PROT_URL = axios.create({
    baseURL: _baseURL + "prot",
    withCredentials: true,
});

export const ADMIN_URL = axios.create({
    baseURL: _baseURL + "admin",
    withCredentials: true,
});
