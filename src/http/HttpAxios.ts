import axios from "axios"
import type {AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig} from "axios"

const httpAxios: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
} as CreateAxiosDefaults)


httpAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.url?.includes('/upload/')) {
        delete config.headers['Content-Type'];
    }
    return config
}, (error: any) => {
    return Promise.reject(error)
})


httpAxios.interceptors.response.use((response: AxiosResponse) => {
    return response.data
}, (error: any) => {
    if (error.code === 'ERR_NETWORK') {
        console.error('网络连接失败，请检查后端服务是否启动')
    }
    return Promise.reject(error)
})

export default httpAxios

