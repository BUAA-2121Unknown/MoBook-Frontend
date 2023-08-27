<template>
  <div class="main-wrapper">
    <div class="teamInfo-wrapper" v-if="teamOption == 'teamInfo'">
      <div v-for="teamInfo in teamInfoList"
        :key="teamInfo.id"
        class="teamInfo-card"
      >
        <img src="teamInfo.avatarUrl" class="team-avatar" />
        <span class="team-name">
          {{ teamInfo.creator }} - {{ teamInfo.name }}
        </span>
        <span class="team-intro">
          {{ teamInfo.intro }}
        </span>

        <div class="flex-grow"></div>

        <el-button @click="enterTeam(teamInfo.id)">
          <span>进入</span>
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <div class="teamInfo-card create-team-wrapper">
        <el-icon class="team-avatar"><Plus /></el-icon>
        <el-button class="create-team" @click="emitter.emit('setTeamOption', 'createTeam')">
          创建新的团队
        </el-button>
      </div>
    </div>

    <CreateTeam v-if="teamOption == 'createTeam'" />
  </div>
</template>

<script>
export default {
  name: 'MyTeam',
}
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import emitter from '@/utils/emitter'
import CreateTeam from '@/components/team/CreateTeam.vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

const teamInfoList = ref()
const createTeamDialogVisible = ref(false)

onMounted(() => {
  // TDOO: get team info from backend
  teamInfoList.value = [
    {
      id: 1,
      name: '团队1',
      avatarUrl: 'https://avatars.githubusercontent.com/u/20411648?v=4',
      creator: '张三',
      intro: '团队简介 BlaBla...',
    },
    {
      id: 2,
      name: '团队2',
      avatarUrl: 'https://avatars.githubusercontent.com/u/20411648?v=4',
      creator: '李四',
      intro: '团队简介 BlaBla...',
    },
  ]
})

const enterTeam = (teamId) => {
  userStore.setOrgId(teamId)
  router.push({
    name: 'team',
  })
}

const teamOption = ref('teamInfo')

emitter.on('setTeamOption', (option) => {
  teamOption.value = option
})
</script>

<style scoped>
.main-wrapper {
  padding-top: 2%;
  text-align: center;
}

.teamInfo-wrapper {
  border-radius: 0.25rem;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  padding: 1.5rem;
}

.teamInfo-card {
  width: 80%;
  height: 40px;
  margin: 0.5%;
  border-radius: 10px;
  text-align: center;
  background-color: #f8f8f8;
  padding: 10px 20px;
  display: inline-flex;
  align-items: center;
}

.create-team-wrapper {

}

.team-avatar {
  height: 40px;
  width: 40px;
  margin-right: 2%;
}

.team-name {
  padding: 0 1.5%;
  font-size: larger;
  font-weight: bold;
}

.team-intro {
  padding: 0 1.5%;
}

.create-team {
  padding: 0 1.5%;
  font-size: larger;
  color: #777777;
}
</style>
