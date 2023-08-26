<template>
  <el-form
    ref="loginForm"
    :model="loginFormData"
    :rules="rules"
    :validate-on-rule-change="false"
    @keyup.enter="submitForm"
  >
    <el-form-item prop="username" class="mb-6">
      <el-input v-model="loginFormData.username" size="large" placeholder="请输入用户名" suffix-icon="user" />
    </el-form-item>
    <el-form-item prop="password" class="mb-6">
      <el-input
        v-model="loginFormData.password"
        show-password
        size="large"
        type="password"
        placeholder="请输入密码"
      />
    </el-form-item>
    <el-form-item v-if="loginFormData.openCaptcha" prop="captcha" class="mb-6">
      <div class="flex w-full justify-between">
        <el-input v-model="loginFormData.captcha" placeholder="请输入验证码" size="large" class="flex-1 mr-5" />
        <div class="w-1/3 h-11 bg-[#c3d4f2] rounded">
          <img v-if="picPath" class="w-full h-full" :src="picPath" alt="请输入验证码" @click="loginVerify()">
        </div>
      </div>
    </el-form-item>
    <el-form-item class="mb-6">
      <el-button class="shadow shadow-blue-600 h-11 w-full" type="primary" size="large" @click="submitForm">登 录</el-button>
    </el-form-item>
    <el-form-item class="mb-6">
      <el-button
        class="shadow shadow-blue-600 h-11 w-full"
        type="primary"
        size="large"
        @click="emitter.emit('setCurrentOption', 'register')"
      >注 册</el-button>

    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'LoginForm',
}
</script>

<script setup>
// import { captcha } from '@/api/user'
// import { checkDB } from '@/api/initdb'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import emitter from '@/utils/emitter'
import { ElLoading, ElMessage } from 'element-plus'

import store from '@/store'

const router = useRouter()

// 验证函数
const checkUsername = (rule, value, callback) => {
  if (value.length < 5) {
    return callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}

const checkPassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

// 获取验证码
const loginVerify = () => {
  captcha({}).then(async(ele) => {
    rules.captcha.push({
      max: ele.data.captchaLength,
      min: ele.data.captchaLength,
      message: `请输入${ele.data.captchaLength}位验证码`,
      trigger: 'blur',
    })
    picPath.value = ele.data.picPath
    loginFormData.captchaId = ele.data.captchaId
    loginFormData.openCaptcha = ele.data.openCaptcha
  })
}

// loginVerify()

// 登录相关操作
const loginForm = ref(null)
const picPath = ref('')
const loginFormData = reactive({
  username: '',
  password: '',
  captcha: '',
  captchaId: '',
  openCaptcha: false,
})
const rules = reactive({
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  captcha: [
    {
      message: '验证码格式不正确',
      trigger: 'blur',
    },
  ],
})

const userStore = useUserStore()

const login = async() => {
  return await userStore.loginIn(loginFormData)
}

const submitForm = () => {
  loginForm.value.validate(async(v) => {
    if (v) {
      const loadingInstance = ElLoading.service({
        fullscreen: true,
        text: '登录中，请稍候...',
      })
      const flag = await login()
      loadingInstance.close()

      if (!flag) {
        // loginVerify()
        return false
      }
      router.push({ path: '/' })
    } else {
      ElMessage({
        type: 'error',
        message: '请正确填写登录信息',
        showClose: true,
      })
      // loginVerify()
      return false
    }
  })
}
</script>
