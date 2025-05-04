<script setup lang="ts">
import {reactive, ref, watchEffect} from "vue";
import {getUserService, updateUserService, deleteUserService} from "@/service/userService.ts";
import type {BaseResponse} from "@/typings/response/BaseResponse.ts";
import userIcon from "@/assets/static/images/user.png"
import type {IUser} from "@/typings/user.ts";
import {ElMessage} from 'element-plus'

const tableData = reactive<IUser[]>([])
const editDrawerVisible = ref(false)
const editingUser = ref<IUser | null>(null)

const handleEdit = (row: IUser) => {
    editingUser.value = {
        id: row.id,
        username: row.username,
        account: row.account,
        password: row.password,
        roleId: row.roleId === "管理员" ? 1 : 2,
        userIcon: row.userIcon,
        token: row.token,
        shoppingCart: row.shoppingCart,
        collect: row.collect,
        address: row.address
    }
    editDrawerVisible.value = true
}

const handleDelete = async (row: IUser) => {
    if (!row.id) return
    try {
        const response = await deleteUserService<BaseResponse<any>>(row.id)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            await refreshData()
        } else {
            ElMessage.error(response.message || '删除失败')
        }
    } catch (error) {
        console.error('删除用户失败:', error)
        ElMessage.error('删除失败')
    }
}

const handleEditSave = async () => {
    if (!editingUser.value) return
    try {
        const response = await updateUserService<BaseResponse<any>>(editingUser.value)
        if (response.code === 200) {
            ElMessage.success('修改成功')
            editDrawerVisible.value = false
            await refreshData()
        } else {
            ElMessage.error(response.message || '修改失败')
        }
    } catch (error) {
        console.error('更新用户信息失败:', error)
        ElMessage.error('修改失败')
    }
}

const refreshData = async () => {
    tableData.length = 0
    try {
        const response = await getUserService<BaseResponse<IUser[]>>()
        if (response.code === 200) {
            response.data.forEach((item: IUser) => {
                const tempUser: IUser = {}
                tempUser.id = item.id
                tempUser.userIcon = item.userIcon !== undefined && item.userIcon !== null &&
                item.userIcon.length >= 0 ? item.userIcon : userIcon
                tempUser.account = item.account
                tempUser.password = item.password
                tempUser.roleId = item.roleId === 1 ? "管理员" : "用户"
                tempUser.username = item.username
                tempUser.token = item.token
                tempUser.shoppingCart = item.shoppingCart
                tempUser.collect = item.collect
                tempUser.address = item.address
                tableData.push(tempUser)
            })
        } else {
            ElMessage.error(response.message || '获取用户列表失败')
        }
    } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取用户列表失败')
    }
}

watchEffect(async () => {
    await refreshData()
})
</script>

<template>
    <div class="userContainer">
        <el-card style="width: 1250px;height: 700px">
            <el-table :data="tableData" style="width: 100%" height="680">
                <el-table-column fixed label="照片" width="100" align="center">
                    <template #default="scope">
                        <img :src="scope.row.userIcon" alt="用户照片"
                             style="width: 50px; height: 50px;border-radius: 50%">
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="120" align="center"/>
                <el-table-column prop="account" label="账号" width="120" align="center"/>
                <el-table-column prop="password" label="密码" width="200" align="center" show-overflow-tooltip/>
                <el-table-column prop="roleId" label="权限" width="80" align="center"/>
                <el-table-column prop="address" label="地址" min-width="120" align="center" show-overflow-tooltip/>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改
                        </el-button>
                        <el-popconfirm 
                            title="确认要删除该用户吗？" 
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

        <!-- 编辑用户信息的抽屉 -->
        <el-drawer
            v-model="editDrawerVisible"
            title="修改用户信息"
            direction="rtl"
            size="500px"
        >
            <el-form v-if="editingUser" :model="editingUser" label-width="100px">
                <el-form-item label="用户ID">
                    <el-input v-model="editingUser.id" disabled/>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="editingUser.username" disabled/>
                </el-form-item>
                <el-form-item label="账号" required>
                    <el-input v-model="editingUser.account"/>
                </el-form-item>
                <el-form-item label="密码" required>
                    <el-input v-model="editingUser.password" type="password" show-password style="width: 300px"/>
                </el-form-item>
                <el-form-item label="权限" required>
                    <el-select v-model="editingUser.roleId">
                        <el-option :value="1" label="管理员"/>
                        <el-option :value="2" label="用户"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="editingUser.address" type="textarea" :rows="3" disabled/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditSave">保存</el-button>
                    <el-button @click="editDrawerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<style scoped lang="less">
.userContainer {
    width: 100%;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>