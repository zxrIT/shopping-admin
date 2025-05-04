import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import Home from "@/views/Home/Home.vue"
import Login from "@/views/Login/Login.vue"
import Product from "@/views/product/Product.vue";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import type {IUser} from "../typings/user.ts";
import {useUserStore} from "../store";
import {ElMessage} from "element-plus";

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

router.beforeEach((to, from, next) => {
    if (to.name === "login") {
        next()
    }
    const {getStorage} = useLocalStorage()
    const userStore = useUserStore();
    const user: IUser = JSON.parse(getStorage("userShoppingObject"))
    if (user === undefined || user === null) {
        ElMessage.error('您还没有登录或登录已过期，请重新登录后再使用')
        next("/login")
    }
    userStore.changeUserAction(user)
    if (userStore.userState.id.length > 0) {
        next()
    } else {
        ElMessage.error('您还没有登录或登录已过期，请重新登录后再使用')
        next("/login")
    }
})

export default router