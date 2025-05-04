import httpAxios from '@/http/httpAxios';
import type { ProductData } from '@/typings/product';

// 获取商品列表
export const getCarProductService = <T>() => {
    return httpAxios.get<T>('/product/admin/getProduct/success');
};

// 获取商品类型
export const getCarProductType = <T>() => {
    return httpAxios.get<T>('/product/getProductType');
};

// 添加商品
export const addProduct = <T>(data: ProductData) => {
    const productData = {
        ...data,
        productImage: `${data.images}.png`,
        productImageChoice: `${data.images}.png`
    };
    return httpAxios.post<T>('/product/addProduct', productData);
};

// 更新商品
export const updateProduct = <T>(data: ProductData) => {
    const productData = {
        ...data,
        productImage: `${data.images}.png`,
        productImageChoice: `${data.images}.png`
    };
    return httpAxios.put<T>('/product/updateProduct', productData);
};

// 删除商品
export const deleteProduct = <T>(id: number) => {
    return httpAxios.delete<T>(`/product/deleteProduct/${id}`);
};

// 上传商品图片
export const uploadProductImage = <T>(formData: FormData) => {
    return httpAxios.post<T>('/upload/product/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};