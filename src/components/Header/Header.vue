<script setup lang="ts">
import userIcon from "@/assets/static/images/user.png"
import githubIcon from "@/assets/static/images/github.png"
import {useUserStore} from "@/store";

const userStore = useUserStore();

const navigateGithub = () => {
    window.open(import.meta.env.VITE_GITHUB_URL, "_blank")
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
            <div class="icon">
                <img :src="userStore.userState.userIcon.length>0
                ?userStore.userState.userIcon:userIcon" alt="user"/>
            </div>
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

            img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }
    }

}
</style>