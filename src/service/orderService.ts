import request from '@/utils/request'

export const getAllOrdersService = <T>() => {
    return request.get<T>('/order/getAllOrders')
}

export const deleteOrderService = <T>(orderId: string) => {
    return request.delete<T>(`/order/deleteOrder/${orderId}`)
} 