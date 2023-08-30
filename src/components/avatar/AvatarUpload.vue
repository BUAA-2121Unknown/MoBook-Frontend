<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    :before-upload="handleBeforeUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="el-upload-list__item-thumbnail avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script>
export default {
  name: 'AvatarUpload',
}
</script>

<script setup>
import { ref } from 'vue'
import { Delete, Plus, } from '@element-plus/icons-vue'
import { uploadOrgAvatar } from '@/api/org'
import emitter from '@/utils/emitter'

const imageUrl = ref()
const fileRef = ref

const handleBeforeUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
  fileRef.value = file
  return false;
}

const uploadAvatar = async (orgId) => {
  console.log(fileRef.value)
  return await uploadOrgAvatar({ 'orgId': orgId, 'file': fileRef.value })
}
emitter.on('uploadAvatar', (orgId) => uploadAvatar(orgId))
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
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
