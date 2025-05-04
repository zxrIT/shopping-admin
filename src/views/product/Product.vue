<script setup lang="ts">
import {watchEffect, reactive, ref} from "vue";
import {getCarProductService, getCarProductType, updateProduct, deleteProduct, uploadProductImage, addProduct} from "@/service/productService.ts";
import type {ProductData, ProductShow, ProductType} from "@/typings/product";
import type {BaseResponse} from "@/typings/response/BaseResponse.ts";
import {ElMessage} from 'element-plus';
import {Plus, Upload} from '@element-plus/icons-vue'

const tableData = reactive<Array<ProductShow>>([])
const productType = reactive<ProductType[]>([])
const addDrawerVisible = ref(false)
const newProduct = ref<ProductData>({
    id: 0,
    productName: '',
    price: 0,
    originalPrice: 0,
    productType: 0,
    images: 0,
    flowerLanguage: '',
    productStatus: false,
    isHot: false,
    description: ''
})
const addImageFile = ref<File | null>(null)
const addImagePreview = ref('')
const editDrawerVisible = ref(false)
const editingProduct = ref<ProductData | null>(null)
const editImageFile = ref<File | null>(null)
const editImagePreview = ref('')

const handleAddImageSelect = (uploadFile: any) => {
    const file = uploadFile.raw
    if (beforeUpload(file)) {
        addImageFile.value = file
        if (addImagePreview.value) {
            URL.revokeObjectURL(addImagePreview.value)
        }
        addImagePreview.value = URL.createObjectURL(file)
    }
}

const handleEditImageSelect = (uploadFile: any) => {
    const file = uploadFile.raw
    if (beforeUpload(file)) {
        editImageFile.value = file
        if (editImagePreview.value) {
            URL.revokeObjectURL(editImagePreview.value)
        }
        editImagePreview.value = URL.createObjectURL(file)
    }
}

const beforeUpload = (file: File) => {
    if (!file) {
        ElMessage.error('文件不能为空！')
        return false
    }
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error('只能上传图片文件！')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB！')
        return false
    }
    return true
}

const handleAdd = () => {
    newProduct.value = {
        id: 0,
        productName: '',
        price: 0,
        originalPrice: 0,
        productType: 0,
        images: 0,
        flowerLanguage: '',
        productStatus: false,
        isHot: false,
        description: ''
    }
    addImageFile.value = null
    addImagePreview.value = ''
    addDrawerVisible.value = true
}

const handleEdit = (row: ProductShow) => {
    editingProduct.value = {
        id: row.id,
        productName: row.productName,
        price: Number(row.price.replace('¥', '')),
        originalPrice: Number(row.originalPrice.replace('¥', '')),
        productType: typeof row.productType === 'string' ? 
            productType.find((type: ProductType) => type.typeName === row.productType)?.id || 0 : 
            Number(row.productType),
        images: Number(row.images.split('/').pop()?.replace('.png', '')),
        flowerLanguage: row.flowerLanguage,
        productStatus: row.productStatus === '已上架',
        isHot: row.isHot === '热门',
        description: row.description || ''
    }
    editImageFile.value = null
    editImagePreview.value = row.images
    editDrawerVisible.value = true
}

const handleAddSave = async () => {
    if (!newProduct.value.productName) {
        ElMessage.error('请输入商品名称')
        return
    }
    if (newProduct.value.price <= 0) {
        ElMessage.error('请输入有效的商品价格')
        return
    }
    if (newProduct.value.originalPrice <= 0) {
        ElMessage.error('请输入有效的商品原价')
        return
    }
    if (!newProduct.value.productType) {
        ElMessage.error('请选择商品类型')
        return
    }
    if (!newProduct.value.flowerLanguage) {
        ElMessage.error('请输入花语')
        return
    }
    if (!addImageFile.value) {
        ElMessage.error('请选择商品图片')
        return
    }

    try {
        // 1. 先上传图片
        const formData = new FormData()
        formData.append('file', addImageFile.value)
        console.log('Uploading image file:', addImageFile.value.name);
        
        const uploadResponse = await uploadProductImage<BaseResponse<{imageName: string}>>(formData)
        console.log('Upload response:', uploadResponse);
        
        if (uploadResponse.code !== 200) {
            ElMessage.error(uploadResponse.message || '图片上传失败')
            return
        }
        const imageId = Number(uploadResponse.data.imageName)

        // 2. 构建商品数据
        const productData = {
            id: imageId,
            productName: newProduct.value.productName,
            price: Number(newProduct.value.price),
            originalPrice: Number(newProduct.value.originalPrice),
            productType: Number(newProduct.value.productType),
            images: imageId,
            flowerLanguage: newProduct.value.flowerLanguage,
            productStatus: newProduct.value.productStatus,
            isHot: newProduct.value.isHot,
            description: newProduct.value.description || '',
            collect: false
        }

        console.log('Adding product with data:', productData);

        // 3. 添加商品
        const response = await addProduct<BaseResponse<any>>(productData)
        if (response.code === 200) {
            ElMessage.success('添加成功')
            addDrawerVisible.value = false
            if (addImagePreview.value) {
                URL.revokeObjectURL(addImagePreview.value)
                addImagePreview.value = ''
            }
            addImageFile.value = null
            await refreshList()
        } else {
            ElMessage.error(response.message || '添加失败')
        }
    } catch (error: any) {
        console.error('Add product error:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
            ElMessage.error(error.response.data?.message || '添加失败');
        } else {
            ElMessage.error('添加失败，请检查网络连接或联系管理员');
        }
    }
}

const handleEditSave = async () => {
    if (!editingProduct.value) return

    if (!editingProduct.value.productName) {
        ElMessage.error('请输入商品名称')
        return
    }
    if (editingProduct.value.price <= 0) {
        ElMessage.error('请输入有效的商品价格')
        return
    }
    if (editingProduct.value.originalPrice <= 0) {
        ElMessage.error('请输入有效的商品原价')
        return
    }
    if (!editingProduct.value.productType) {
        ElMessage.error('请选择商品类型')
        return
    }
    if (!editingProduct.value.flowerLanguage) {
        ElMessage.error('请输入花语')
        return
    }

    try {
        let imageId = editingProduct.value.images

        if (editImageFile.value) {
            const formData = new FormData()
            formData.append('file', editImageFile.value)
            console.log('Uploading image file:', editImageFile.value.name);
            
            const uploadResponse = await uploadProductImage<BaseResponse<{imageName: string}>>(formData)
            console.log('Upload response:', uploadResponse);
            
            if (uploadResponse.code !== 200) {
                ElMessage.error(uploadResponse.message || '图片上传失败')
                return
            }
            imageId = Number(uploadResponse.data.imageName)
        }

        const productData = {
            id: editingProduct.value.id,
            productName: editingProduct.value.productName,
            price: Number(editingProduct.value.price),
            originalPrice: Number(editingProduct.value.originalPrice),
            productType: Number(editingProduct.value.productType),
            images: imageId,
            flowerLanguage: editingProduct.value.flowerLanguage,
            productStatus: editingProduct.value.productStatus,
            isHot: editingProduct.value.isHot,
            description: editingProduct.value.description || '',
            collect: false
        }

        console.log('Updating product with data:', productData);

        const response = await updateProduct<BaseResponse<any>>(productData)
        if (response.code === 200) {
            ElMessage.success('修改成功')
            editDrawerVisible.value = false
            if (editImagePreview.value && editImageFile.value) {
                URL.revokeObjectURL(editImagePreview.value)
                editImagePreview.value = ''
            }
            editImageFile.value = null
            await refreshList()
        } else {
            ElMessage.error(response.message || '修改失败')
        }
    } catch (error: any) {
        console.error('Update product error:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
            ElMessage.error(error.response.data?.message || '修改失败');
        } else {
            ElMessage.error('修改失败，请检查网络连接或联系管理员');
        }
    }
}

const handleDelete = async (row: ProductShow) => {
    try {
        const response = await deleteProduct<BaseResponse<any>>(row.id)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            await refreshList()
        } else {
            ElMessage.error('删除失败')
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('删除失败')
    }
}

const refreshList = async () => {
    try {
        // 先清空现有数据
        tableData.length = 0;
        
        // 重新获取商品类型
        const responseProductType = await getCarProductType<BaseResponse<ProductType[]>>();
        if (responseProductType.code === 200 && responseProductType.data) {
            productType.length = 0;
            responseProductType.data.forEach((item: ProductType) => {
                productType.push(item);
            });
        } else {
            console.error('获取商品类型失败:', responseProductType);
            ElMessage.error('获取商品类型失败');
            return;
        }

        // 获取最新的商品列表
        const response = await getCarProductService<BaseResponse<ProductData[]>>();
        console.log('商品列表响应:', response);

        if (response.code === 200 && response.data && Array.isArray(response.data)) {
            response.data.forEach((item: ProductData) => {
                if (!item) {
                    console.warn('发现空的商品数据');
                    return;
                }
                try {
                    const tempProduct: ProductShow = {
                        id: item.id,
                        productName: item.productName || '',
                        price: "¥" + (item.price || 0),
                        originalPrice: "¥" + (item.originalPrice || 0),
                        images: item.images ? `http://localhost:8080/static/product/${item.images}.png` : '',
                        productType: productType.find((type: ProductType) => type.id === item.productType)?.typeName || '未分类',
                        productStatus: item.productStatus ? "已上架" : "未上架",
                        isHot: item.isHot ? "热门" : "冷门",
                        flowerLanguage: item.flowerLanguage || '',
                        description: item.description || ''
                    };
                    tableData.push(tempProduct);
                } catch (err) {
                    console.error('处理商品数据时出错:', err, item);
                }
            });
            
            if (tableData.length === 0) {
                console.warn('没有获取到任何商品数据');
                ElMessage.warning('暂无商品数据');
            }
        } else {
            console.error('获取商品列表失败:', response);
            ElMessage.error(response.message || '获取商品列表失败');
        }
    } catch (error: any) {
        console.error('获取数据失败:', error);
        if (error.code === 'ERR_NETWORK') {
            ElMessage.error('网络连接失败，请检查后端服务是否启动');
        } else if (error.response) {
            ElMessage.error(`请求失败: ${error.response.status} - ${error.response.data?.message || '未知错误'}`);
        } else if (error.request) {
            ElMessage.error('没有收到响应，请检查网络连接');
        } else {
            ElMessage.error(`请求出错: ${error.message}`);
        }
    }
};

watchEffect(async () => {
    try {
        await refreshList();
    } catch (error: any) {
        console.error('初始化数据失败:', error);
        if (error.code === 'ERR_NETWORK') {
            ElMessage.error('网络连接失败，请检查后端服务是否启动');
        } else {
            ElMessage.error('初始化数据失败，请检查网络连接');
        }
    }
});
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
                <el-table-column label="商品描述" min-width="200" align="center">
                    <template #default="scope">
                        <div class="description-cell">{{ scope.row.description }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="productStatus" label="上架状态" width="120" align="center"/>
                <el-table-column prop="isHot" label="是否热门" width="120" align="center"/>
                <el-table-column fixed="right" label="操作" min-width="120" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm 
                            title="确认要删除这个商品吗？" 
                            @confirm="handleDelete(scope.row)"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                        >
                            <template #reference>
                                <el-button link type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-drawer
            v-model="addDrawerVisible"
            title="添加商品"
            direction="rtl"
            size="500px"
        >
            <el-form :model="newProduct" label-width="100px">
                <el-form-item label="商品图片" required>
                    <div class="upload-container">
                        <div class="product-image" v-if="addImagePreview">
                            <img :src="addImagePreview" alt="商品图片">
                        </div>
                        <el-upload
                            class="upload-component"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleAddImageSelect"
                            accept="image/*"
                        >
                            <template #trigger>
                                <el-button type="primary">
                                    <el-icon><Upload /></el-icon>
                                    {{ addImagePreview ? '重新选择' : '选择图片' }}
                                </el-button>
                            </template>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="商品名称" required>
                    <el-input v-model="newProduct.productName"/>
                </el-form-item>
                <el-form-item label="现价" required>
                    <el-input-number v-model="newProduct.price" :min="0" :precision="2"/>
                </el-form-item>
                <el-form-item label="原价" required>
                    <el-input-number v-model="newProduct.originalPrice" :min="0" :precision="2"/>
                </el-form-item>
                <el-form-item label="商品类型" required>
                    <el-select v-model="newProduct.productType">
                        <el-option
                            v-for="item in productType"
                            :key="item.id"
                            :label="item.typeName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="花语" required>
                    <el-input v-model="newProduct.flowerLanguage" type="textarea"/>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="newProduct.description" type="textarea" :rows="4"/>
                </el-form-item>
                <el-form-item label="上架状态">
                    <el-switch
                        v-model="newProduct.productStatus"
                        :active-text="'已上架'"
                        :inactive-text="'未上架'"
                    />
                </el-form-item>
                <el-form-item label="是否热门">
                    <el-switch
                        v-model="newProduct.isHot"
                        :active-text="'热门'"
                        :inactive-text="'冷门'"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddSave">保存</el-button>
                    <el-button @click="addDrawerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-drawer
            v-model="editDrawerVisible"
            title="修改商品信息"
            direction="rtl"
            size="500px"
        >
            <el-form v-if="editingProduct" :model="editingProduct" label-width="100px">
                <el-form-item label="商品ID">
                    <el-input v-model="editingProduct.id" disabled/>
                </el-form-item>
                <el-form-item label="商品图片">
                    <div class="upload-container">
                        <div class="product-image" v-if="editImagePreview">
                            <img :src="editImagePreview" alt="商品图片">
                        </div>
                        <el-upload
                            class="upload-component"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleEditImageSelect"
                            accept="image/*"
                        >
                            <template #trigger>
                                <el-button type="primary">
                                    <el-icon><Upload /></el-icon>
                                    更换图片
                                </el-button>
                            </template>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="商品名称" required>
                    <el-input v-model="editingProduct.productName"/>
                </el-form-item>
                <el-form-item label="现价" required>
                    <el-input-number v-model="editingProduct.price" :min="0" :precision="2"/>
                </el-form-item>
                <el-form-item label="原价" required>
                    <el-input-number v-model="editingProduct.originalPrice" :min="0" :precision="2"/>
                </el-form-item>
                <el-form-item label="商品类型" required>
                    <el-select v-model="editingProduct.productType">
                        <el-option
                            v-for="item in productType"
                            :key="item.id"
                            :label="item.typeName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="花语" required>
                    <el-input v-model="editingProduct.flowerLanguage" type="textarea"/>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="editingProduct.description" type="textarea" :rows="4"/>
                </el-form-item>
                <el-form-item label="上架状态">
                    <el-switch
                        v-model="editingProduct.productStatus"
                        :active-text="'已上架'"
                        :inactive-text="'未上架'"
                    />
                </el-form-item>
                <el-form-item label="是否热门">
                    <el-switch
                        v-model="editingProduct.isHot"
                        :active-text="'热门'"
                        :inactive-text="'冷门'"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditSave">保存</el-button>
                    <el-button @click="editDrawerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <div class="floating-button" @click="handleAdd">
            <el-button type="primary" circle>
                <el-icon><Plus /></el-icon>
            </el-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.carProductContainer {
    width: 100%;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    position: relative;
}

.product-image {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eee;
    background-color: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.description-cell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    max-height: 4.5em;
    text-align: left;
    padding: 0 10px;
}

.floating-button {
    position: fixed;
    right: 40px;
    bottom: 40px;
    z-index: 1000;
    
    .el-button {
        width: 60px;
        height: 60px;
        font-size: 24px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
}

.upload-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    .product-image {
        width: 200px;
        height: 200px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #eee;
        background-color: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .upload-component {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>