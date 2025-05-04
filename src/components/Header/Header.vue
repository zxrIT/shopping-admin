<script setup lang="ts">
import userIcon from "@/assets/static/images/user.png"
import githubIcon from "@/assets/static/images/github.png"
import {useUserStore} from "@/store";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const navigateGithub = () => {
    window.open(import.meta.env.VITE_GITHUB_URL, "_blank")
}

const handleLogout = async () => {
    await userStore.logout();
    ElMessage.success('退出登录成功');
    router.push('/login');
}
</script>

<template>
    <div class="headerContainer">
        <div class="cardContext">
            <el-tooltip content="github仓库" effect="light">
                <div class="icon" @click="navigateGithub">
                    <img :src="githubIcon" alt="github"/>
                </div>
            </el-tooltip>
            <el-dropdown trigger="hover">
                <div class="icon">
                    <img :src="userStore.userState.userIcon
                    ?userStore.userState.userIcon:userIcon" alt="user"/>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped lang="less">
.headerContainer {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;

    .cardContext {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: right;

        .icon {
            margin-right: 16px;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            margin-top: 5px;
            cursor: pointer;

            img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>