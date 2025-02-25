import httpAxios from "../http/HttpAxios.ts";

export function getCarProductService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/product/admin/getProduct/success").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    });
}

export function getCarProductType<T>(): Promise<T> {
    return httpAxios.get<T, T>("/product/getProductType").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    });
}