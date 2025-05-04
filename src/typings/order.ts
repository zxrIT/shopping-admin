export interface IOrder {
    id?: string;
    userId?: string;
    totalAmount?: number;
    orderStatus?: number;
    createTime?: string;
    updateTime?: string;
    address?: string;
    contactPhone?: string;
    contactName?: string;
}

export const OrderStatus = {
    PENDING_PAYMENT: 0,
    PAID: 1,
    SHIPPED: 2,
    COMPLETED: 3,
    CANCELLED: 4
} as const;

export const OrderStatusText = {
    [OrderStatus.PENDING_PAYMENT]: '待付款',
    [OrderStatus.PAID]: '已付款',
    [OrderStatus.SHIPPED]: '已发货',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELLED]: '已取消'
} as const; 