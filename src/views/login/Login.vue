<script setup lang="ts">
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import type {BaseResponse} from "@/typings/response/BaseResponse.ts";
import type {IUser} from "@/typings/user.ts";
import {ElMessage} from 'element-plus'
import {useLocalStorage} from "@/hooks/useLocalStorage.ts";
import {loginService} from "@/service/loginService.ts";
import {useUserStore} from "@/store";

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const {setStorage} = useLocalStorage()
const userStore = useUserStore()

const ruleForm = reactive({
    username: '',
    password: '',
})

const rules = reactive<FormRules>({
    username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async () => {
        const loginResponse = await loginService<BaseResponse<IUser>>(ruleForm)
        if (loginResponse.code === 200) {
            console.log(loginResponse.data)
            ElMessage.success(loginResponse.message)
            setStorage("user", JSON.stringify(loginResponse.data))
            userStore.changeUserAction(loginResponse.data)
            await router.push('/')
        } else {
            ElMessage.error(loginResponse.data)
        }
    })
}
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <img src="../../../public/logo.png" alt="Logo" class="logo">
                <h1>售花管理系统</h1>
            </div>
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="rules"
                :size="formSize"
                class="login-form"
                label-position="top"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input
                        v-model="ruleForm.username"
                        placeholder="请输入用户名"
                    />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="ruleForm.password"
                        type="password"
                        placeholder="请输入密码"
                        show-password
                    />
                </el-form-item>
                <el-button
                    type="primary"
                    class="submit-btn"
                    @click="submitForm(ruleFormRef)"
                >
                    确认
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<style scoped lang="less">
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #e0e7ff 0%, #8b5cf6 100%);
    padding: 20px;
}

.login-card {
    background: white;
    border-radius: 8px;
    padding: 30px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-header {
    text-align: center;
    margin-bottom: 30px;

    .logo {
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
    }

    h1 {
        font-size: 24px;
        color: #333;
        margin: 0;
    }
}

.login-form {
    :deep(.el-form-item__label) {
        color: #666;
        font-weight: 500;
    }

    :deep(.el-input__wrapper) {
        border-radius: 4px;
    }
}

.submit-btn {
    width: 100%;
    height: 40px;
    font-size: 16px;
    margin-bottom: 20px;
    margin-top: 20px;
}
</style>