export interface ProductType {
    id: number;
    typeName: string;
}

export interface ProductData {
    id: number;
    productName: string;
    price: number;
    originalPrice: number;
    productType: number;
    images: number;
    flowerLanguage: string;
    productStatus: boolean;
    isHot: boolean;
    description: string;
}

export interface ProductShow {
    id: number;
    productName: string;
    price: string;
    originalPrice: string;
    images: string;
    productType: string | number;
    productStatus: string;
    isHot: string;
    flowerLanguage: string;
    description: string;
} 