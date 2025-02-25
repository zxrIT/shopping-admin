<script setup lang="ts">
import {Male, Bell, View} from '@element-plus/icons-vue'
import {LeftNavEnum} from "@/enum/LeftNavEnum.ts";

</script>

<template>
    <div class="leftNavigateContainer">
        <el-menu
            :router="true"
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            :default-active="LeftNavEnum.UPLOAD"
            text-color="#fff"
        >
            <el-menu-item :index="LeftNavEnum.PRODUCT">
                <el-icon>
                    <View/>
                </el-icon>
                <span>商品管理</span>
            </el-menu-item>
            <el-sub-menu>
                <template #title>
                    <el-icon>
                        <Male/>
                    </el-icon>
                    <span>角色管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item :index="LeftNavEnum.ROLE">用户管理</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item :index="LeftNavEnum.ORDER">
                <el-icon>
                    <Bell/>
                </el-icon>
                <span>订单管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped lang="less">
.leftNavigateContainer {
    height: 100%;
    width: 100%;
}
</style>