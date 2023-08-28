<template>
  <el-form
    ref="registerForm"
    :model="registerFormData"
    :rules="rules"
    :validate-on-rule-change="false"
    @keyup.enter="submitForm"
  >
    <el-form-item prop="username" class="mb-6">
      <el-input v-model="registerFormData.username" size="large" placeholder="用户名" />
    </el-form-item>
    <el-form-item prop="username" class="mb-6">
      <el-input v-model="registerFormData.email" size="large" placeholder="邮箱" />
    </el-form-item>
    <el-form-item prop="password" class="mb-6">
      <el-input
        v-model="registerFormData.password"
        show-password
        size="large"
        type="password"
        placeholder="密码"
      />
    </el-form-item>
    <el-form-item prop="password" class="mb-6">
      <el-input
        v-model="registerFormData.confirm_password"
        show-password
        size="large"
        type="password"
        placeholder="确认密码"
      />
    </el-form-item>
    <el-form-item v-if="registerFormData.openCaptcha" prop="captcha" class="mb-6">
      <div class="flex w-full justify-between">
        <el-input v-model="registerFormData.captcha" placeholder="请输入验证码" size="large" class="flex-1 mr-5" />
        <div class="w-1/3 h-11 bg-[#c3d4f2] rounded">
          <img v-if="picPath" class="w-full h-full" :src="picPath" alt="请输入验证码" @click="registerVerify()">
        </div>
      </div>
    </el-form-item>
    <el-form-item class="mb-6">
      <el-button class="shadow shadow-blue-600 h-11 w-full" type="primary" size="large" @click="submitForm">注 册</el-button>
    </el-form-item>
    <el-form-item class="mb-6">
      <el-button
        class="shadow shadow-blue-600 h-11 w-full"
        size="large"
        @click="emitter.emit('setCurrentOption', 'login')"
      >返 回</el-button>

    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'RegisterForm',
}
</script>

<script setup>
import { register } from '@/api/user'
// import { checkDB } from '@/api/initdb'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import emitter from '@/utils/emitter'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 验证函数
const checkUsername = (rule, value, callback) => {
  if (value.length < 5) {
    return callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const checkEmail = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入邮箱'));
  }
  const at = value.search('@');
  const dot = value.slice(at + 1).search('.');
  let valid = (at != -1) && (dot != -1);
  valid = valid && value.slice(at + 1).search('@') == -1;
  valid = valid && value.search('[^A-Za-z0-9\\-\\_\\@\\.]') == -1;
  if (!valid) {
    callback(new Error('不是有效的邮箱'));
  }
  callback();
}

const checkPassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

const checkConfirmPassword = (rule, value, callback) => {
  if (value != registerFormData.password) {
    return callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 获取验证码
const registerVerify = () => {
  captcha({}).then(async(ele) => {
    rules.captcha.push({
      max: ele.data.captchaLength,
      min: ele.data.captchaLength,
      message: `请输入${ele.data.captchaLength}位验证码`,
      trigger: 'blur',
    })
    picPath.value = ele.data.picPath
    registerFormData.captchaId = ele.data.captchaId
    registerFormData.openCaptcha = ele.data.openCaptcha
  })
}

// registerVerify()

// 注册相关操作
const registerForm = ref(null)
const picPath = ref('')
const registerFormData = reactive({
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  captcha: '',
  captchaId: '',
  openCaptcha: false,
})
const rules = reactive({
  username: [{ validator: checkUsername, trigger: 'blur' }],
  email: [{ validator: checkEmail, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  confirm_password: [{ validator: checkConfirmPassword, trigger: 'blur' }],
  captcha: [
    {
      message: '验证码格式不正确',
      trigger: 'blur',
    },
  ],
})

const userStore = useUserStore()

const submitForm = () => {
  registerForm.value.validate(async(v) => {
    if (v) {
      const flag = await register(registerFormData)
      if (!flag) {
        registerVerify()
      }
      router.push({
        name: 'login',
      })
      ElMessage({
        type: 'success',
        message: '注册成功',
      })
      emitter.emit('setCurrentOption', 'login')
    } else {
      ElMessage({
        type: 'error',
        message: '请正确填写注册信息',
        showClose: true,
      })
      registerVerify()
      return false
    }
  })
}
</script>
