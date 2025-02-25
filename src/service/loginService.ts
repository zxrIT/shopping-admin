import httpAxios from "../http/HttpAxios.ts";

export function loginService<T>(data): Promise<T> {
    return httpAxios.post<T, T>("/user/admin/login", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    });
}