import axios from "axios"
import type {AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig} from "axios"
import {useLocalStorage} from "@/hooks/useLocalStorage.ts";

const httpAxios: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000
} as CreateAxiosDefaults)

httpAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const {getStorage} = useLocalStorage()
    config.headers["Authorization"] = JSON.parse(getStorage("authentication"))
    return config
}, (error: any) => {
    Promise.reject(error)
})

httpAxios.interceptors.response.use((response: AxiosResponse) => {
    return response.data
}, (error: any) => {
    console.log(error)
    if (error.response.status === 403) {
        window.location.href = "/403"
    } else if (error.response.status === 500) {
        window.location.href = "/500";
    }
    Promise.reject(error)
})


export default httpAxios

