import {defineStore} from 'pinia'
import {reactive} from "vue";
import type {IUser} from "../typings/user.ts";

export const useUserStore = defineStore("user", () => {
    const changeUserAction = (user: IUser) => {
        userState.id = user.id;
        userState.username = user.username;
        userState.password = user.password;
        userState.account = user.account;
        userState.roleId = user.roleId;
        userState.userIcon = user.userIcon;
    }

    const logout = () => {
        userState.id = "";
        userState.username = "";
        userState.password = "";
        userState.account = "";
        userState.roleId = 0;
        userState.userIcon = "";
        localStorage.removeItem('userShoppingObject');
    }

    const userState = reactive<IUser>({
        id: "",
        username: "",
        roleId: 0,
        userIcon: "",
        password: "",
        account: ""
    })

    return {
        userState,
        changeUserAction,
        logout
    }
})