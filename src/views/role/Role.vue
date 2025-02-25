<script setup lang="ts">
import {reactive, watchEffect} from "vue";
import {getUserService} from "@/service/userService.ts";
import type {BaseResponse} from "@/typings/response/BaseResponse.ts";
import userIcon from "@/assets/static/images/user.png"
import type {IUser} from "@/typings/user.ts";

const tableData = reactive<IUser[]>([])

watchEffect(async () => {
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
            tableData.push(tempUser)
        })
    }
})
</script>

<template>
    <div class="userContainer">
        <el-card style="width: 1250px;height: 700px">
            <el-table :data="tableData" style="width: 100%" height="680">
                <el-table-column fixed label="照片" width="150" align="center">
                    <template #default="scope">
                        <img :src="scope.row.userIcon" alt="用户照片"
                             style="width: 50px; height: 50px;border-radius: 50%">
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="120" align="center"/>
                <el-table-column prop="id" label="id" width="360" align="center"/>
                <el-table-column prop="account" label="账号" width="240" align="center"/>
                <el-table-column prop="password" label="密码" width="240" align="center"/>
                <el-table-column prop="roleId" label="权限" width="120" align="center"/>
                <el-table-column fixed="right" label="操作" width="120" align="center">
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
.userContainer {
    width: 100%;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>