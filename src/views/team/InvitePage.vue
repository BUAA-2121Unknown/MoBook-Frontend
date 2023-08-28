<template>
    <div class="invite-page">
    <div class="invite-card">
      <img v-if="orgInfo.avatarUrl" :src="orgInfo.avatarUrl" class="org-avatar" alt="Organization Avatar" />
      <img v-else class="org-avatar" src="@/assets/logo.png" />
      <h2 class="org-name">{{ orgInfo.name }}</h2>
      <p class="org-description">{{ orgInfo.description }}</p>
      <el-button class="join-button" @click="confirmJoin">确认加入</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvitePage'
}
</script>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getOrgInfoByToken, activateInvite } from '@/api/org'
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

const orgInfo = ref({
  name: '团队',
  description: '阿巴阿巴',
  avatarUrl: ''
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const token = route.query.token

const GetOrgInfo = async () => {
  try {
    const res = await getOrgInfoByToken({ token: token })
    if (res.meta.status == 0) {
      orgInfo.value = res.data.org
    } else {
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }
}

GetOrgInfo()

const confirmJoin = async () => {
  if (!userStore.token) {
    ElMessage({
      type: 'error',
      message: '请先登录',
      close: true,
    })
    router.push('/login')
    return
  }
  try {
    const res = await activateInvite({ token: token })
    if (res.meta.status == 0) {
      userStore.orgId = res.data.profile.member.orgId
      router.push('/team')
    } else {
      ElMessage({
        type: 'error',
        message: '链接无效',
        close: true,
      })
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }
}
</script>

<style scoped>
.invite-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.invite-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 400px;
  text-align: center;
}

.org-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.org-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.org-name {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.org-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.join-button {
  background-color: #42b983;
  border-color: #42b983;
  color: #fff;
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
}
</style>
