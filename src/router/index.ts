import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import Home from "@/views/Home/Home.vue"
import Login from "@/views/Login/Login.vue"
import Product from "@/views/product/Product.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "index",
        component: Home,
        redirect: "/product",
        children: [
            {
                path: "/product",
                name: "product",
                component: Product,
            },
            {
                path: "/order",
                name: "order",
                component: () => import("@/views/order/Order.vue"),
            },
            {
                path: "/role",
                name: "/role",
                component: () => import("@/views/role/Role.vue")
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router