export interface ProductData {
    id: number,
    productName: string,
    price: number,
    description: string,
    productType: number,
    originalPrice: number,
    images: number,
    flowerLanguage: string,
    productStatus: boolean,
    isHot: boolean,
}

export interface ProductType {
    id: number,
    typeName: string,
    typeImage: string
}

export interface ProductShow {
    id: number,
    productName: string,
    price: number,
    description: string,
    productType: number,
    images: string,
    originalPrice: number,
    flowerLanguage: string,
    productStatus: string,
    isHot: string,
}