<template>
  <div class="create-team-form-wrapper">
    <el-form :model="form" label-width="120px">
      <el-form-item label="团队名" :rules="{required: true}">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="团队描述" :rules="{required: true}">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="团队头像">
        <AvatarUpload />
      </el-form-item>
    </el-form>

    <div class="button-wrapper">
      <el-button type="primary" @click="createTeam">创建</el-button>
      <el-button @click="emitter.emit('setTeamOption', 'teamInfo')">取消</el-button>
    </div>
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
  // TODO
  try {
    const res = await createOrg(form.value)
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

<style>
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
</style>
