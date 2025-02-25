import httpAxios from "../http/HttpAxios.ts";

export function getUserService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/user/get/allUser").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    });
}