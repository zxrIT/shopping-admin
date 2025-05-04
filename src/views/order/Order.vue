<script setup lang="ts">
import {reactive, watchEffect} from "vue";
import {getAllOrdersService, deleteOrderService} from "@/service/orderService.ts";
import type {BaseResponse} from "@/typings/response/BaseResponse.ts";
import type {IOrder} from "@/typings/order.ts";
import {OrderStatusText} from "@/typings/order.ts";
import {ElMessage} from 'element-plus'

const tableData = reactive<IOrder[]>([])

const handleDelete = async (row: IOrder) => {
    if (!row.id) return
    try {
        const response = await deleteOrderService<BaseResponse<any>>(row.id)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            await refreshData()
        } else {
            ElMessage.error(response.message || '删除失败')
        }
    } catch (error) {
        console.error('删除订单失败:', error)
        ElMessage.error('删除失败')
    }
}

const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

const refreshData = async () => {
    tableData.length = 0
    try {
        const response = await getAllOrdersService<BaseResponse<IOrder[]>>()
        if (response.code === 200) {
            response.data.forEach((item: IOrder) => {
                const tempOrder: IOrder = {
                    id: item.id,
                    userId: item.userId,
                    totalAmount: item.totalAmount,
                    orderStatus: item.orderStatus,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    address: item.address,
                    contactPhone: item.contactPhone,
                    contactName: item.contactName
                }
                tableData.push(tempOrder)
            })
        } else {
            ElMessage.error(response.message || '获取订单列表失败')
        }
    } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
    }
}

watchEffect(async () => {
    await refreshData()
})
</script>

<template>
    <div class="orderContainer">
        <el-card style="width: 1250px;height: 700px">
            <el-table :data="tableData" style="width: 100%" height="680">
                <el-table-column prop="id" label="订单ID" width="200" align="center" show-overflow-tooltip/>
                <el-table-column prop="contactName" label="联系人" width="100" align="center"/>
                <el-table-column prop="contactPhone" label="联系电话" width="120" align="center"/>
                <el-table-column prop="totalAmount" label="总金额" width="100" align="center">
                    <template #default="scope">
                        ¥{{ scope.row.totalAmount?.toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="收货地址" min-width="200" align="center" show-overflow-tooltip/>
                <el-table-column label="创建时间" width="180" align="center">
                    <template #default="scope">
                        {{ formatDate(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.orderStatus === 4 ? 'danger' : 
                                    scope.row.orderStatus === 3 ? 'success' : 
                                    scope.row.orderStatus === 2 ? 'warning' : 
                                    scope.row.orderStatus === 1 ? 'info' : 'primary'">
                            {{ OrderStatusText[scope.row.orderStatus || 0] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <el-popconfirm 
                            title="确认要删除该订单吗？" 
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
    </div>
</template>

<style scoped lang="less">
.orderContainer {
    width: 100%;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>