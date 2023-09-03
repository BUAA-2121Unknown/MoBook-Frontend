<template>
  <div class="create-team-form-wrapper">
    <div class="login-box">
      <p>从创建团队开始</p>
      <form>
        <div class="user-box">
          <input required="" name="" type="text" v-model="form.name">
          <label>团队名</label>
        </div>
        <div class="user-box">
          <input required="" name="" type="text" v-model="form.description">
          <label>团队简介</label>
        </div>
        <div class="user-box">
          <AvatarUpload />
        </div>
        <div style="display: flex; align-items: center; justify-content: space-evenly; margin-top: 30px;">
          <button @click="createTeam"> 提交
          </button>
          <!-- <button @click="emitter.emit('setTeamOption', 'teamInfo')"> 已有团队？点击加入
          </button> -->
          <button @click="joinHandler"> 已有团队？点击加入
          </button>
        </div>

        <!-- <a @click="createTeam">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          提交
        </a> -->

        <!-- <a @click="emitter.emit('setTeamOption', 'teamInfo')">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          取消
        </a> -->
      </form>
    </div>

    <!-- <el-form :model="form" label-width="120px">
      <el-form-item label="团队名" :rules="{ required: true }">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="团队描述" :rules="{ required: true }">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="团队头像">
        <AvatarUpload />
      </el-form-item>
    </el-form>

    <div class="button-wrapper">
      <el-button type="primary" @click="createTeam">创建</el-button>
      <el-button @click="emitter.emit('setTeamOption', 'teamInfo')">取消</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'CreateTeam',
}
</script>

<script setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter'
import { createOrg, uploadOrgAvatar } from '@/api/org'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import AvatarUpload from '@/components/avatar/AvatarUpload.vue'

const props = defineProps({
  joinHandler: {
    type: Function,
  },
})

const form = ref({
  name: '',
  description: '',
})

const router = useRouter()
const userStore = useUserStore()

const imageUrl = ref()
const dialogVisible = ref(false)

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}
const handlePictureCardPreview = (uploadFile) => {
  console.log(uploadFile.url)
  imageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const createTeam = async () => {
  console.log('emit1')
  // TODO
  try {
    const res = await createOrg(form.value)
    console.log('emit', res)
    if (res.meta.status == 0) {
      const orgId = res.data.id
      console.log(orgId)
      emitter.emit('uploadAvatar', orgId)
      ElMessage({
        type: 'success',
        message: '创建成功'
      })
      userStore.setOrgId(orgId)
      emitter.emit('setTeamOption', 'teamInfo')
      form.value = {
        name: '',
        description: '',
      }
      imageUrl.value = ''
      router.push({
        name: 'team',
      })
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
.create-team-form-wrapper {
  border-radius: 0.25rem;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  padding: 1.5rem;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.button-wrapper {
  margin-top: 20px;
}
</style>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}


.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 700px;
  padding: 40px;
  margin: 20px auto;
  transform: translate(-50%, -55%);
  background: rgba(190, 190, 190, 0.7);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
}

.login-box p:first-child {
  margin: 0 0 30px;
  padding: 0;
  color: #e8e8e8;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 1px;
  /* background: linear-gradient(rgba(7, 7, 7, 0.9), rgba(110, 110, 110, 0.5)); */
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus~label,
.login-box .user-box input:valid~label {
  top: -20px;
  left: 0;
  color: #fff;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  font-weight: bold;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 3px
}

.login-box a:hover {
  background: #fff;
  color: #272727;
  border-radius: 5px;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff);
  animation: btn-anim1 1.5s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #fff);
  animation: btn-anim2 1.5s linear infinite;
  animation-delay: .375s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #fff);
  animation: btn-anim3 1.5s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #fff);
  animation: btn-anim4 1.5s linear infinite;
  animation-delay: 1.125s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}

.login-box p:last-child {
  color: #aaa;
  font-size: 14px;
}

.login-box a.a2 {
  color: #fff;
  text-decoration: none;
}

.login-box a.a2:hover {
  background: transparent;
  color: #aaa;
  border-radius: 5px;
}

button {
  cursor: pointer;
  color: #090909;
  padding: 0.7em 1.7em;
  font-size: 18px;
  border-radius: 0.5em;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  transition: all .3s;
  box-shadow: 6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
}

button:hover {
  border: 1px solid white;
}

button:active {
  box-shadow: 4px 4px 12px #c5c5c5,
    -4px -4px 12px #ffffff;
}
</style>
