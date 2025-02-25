<script setup lang="ts">
import {watchEffect, reactive} from "vue";
import {getCarProductService, getCarProductType} from "@/service/productService.ts";
import type {ProductData, ProductShow, ProductType} from "@/typings/product";
import type {BaseResponse} from "@/typings/response/BaseResponse.ts";

const tableData = reactive<Array<ProductData>>([])
const productType = reactive<ProductType[]>([])

watchEffect(async () => {
    const responseProductType = await getCarProductType<BaseResponse<ProductType>>()
    if (responseProductType.code === 200) {
        responseProductType.data.forEach(item => {
            productType.push(item)
        })
    }
    const response = await getCarProductService<BaseResponse<ProductData[]>>();
    if (response.code === 200) {
        response.data.forEach((item: ProductData) => {
            const tempProduct: ProductShow = {
                id: item.id,
                productName: item.productName,
                price: "¥" + item.price,
                originalPrice: "¥" + item.originalPrice,
                images: "http://localhost:8080/static/product/" + item.images + ".png",
                productType: productType.find((itemType: ProductType) => {
                    if (itemType.id === item.productType) {
                        return item
                    }
                })!.typeName,
                productStatus: item.productStatus ? "已上架" : "未上架",
                isHot: item.isHot ? "热门" : "冷门",
                flowerLanguage: item.flowerLanguage
            }
            tableData.push(tempProduct);
        })
    }
})
</script>

<template>
    <div class="carProductContainer">
        <el-card style="width: 1250px;height: 700px">
            <el-table :data="tableData" style="width: 100%" height="680">
                <el-table-column fixed label="照片" width="150" align="center">
                    <template #default="scope">
                        <img :src="scope.row.images" alt="照片" style="width: 70px; height: 70px;border-radius: 50%">
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="鲜花名称" width="120" align="center"/>
                <el-table-column prop="price" label="现价" width="120" align="center"/>
                <el-table-column prop="originalPrice" label="原价" width="120" align="center"/>
                <el-table-column prop="productType" label="鲜花分类" width="120" align="center"/>
                <el-table-column prop="flowerLanguage" label="花语" width="120" align="center"/>
                <el-table-column prop="productStatus" label="上架状态" width="120" align="center"/>
                <el-table-column prop="isHot" label="是否热门" width="120" align="center"/>
                <el-table-column fixed="right" label="操作" min-width="120" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small">修改
                        </el-button>
                        <el-popconfirm title="确认要删除吗">
                            <template #reference>
                                <el-button link type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style scoped lang="less">
.carProductContainer {
    width: 100%;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>