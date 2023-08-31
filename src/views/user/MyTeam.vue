<template>
  <div class="main-wrapper">
    <div class="teamInfo-wrapper" v-if="teamOption == 'teamInfo'">
      <div v-for="teamInfo in teamInfoList"
        :key="teamInfo.org.id"
        class="teamInfo-card"
      >
        <img v-if="teamInfo.org.avatarUrl" :src="teamInfo.org.avatarUrl" class="team-avatar" />
        <img v-else src="@/assets/project/projectAvatar.jpg" class="team-avatar" />
        <span class="team-name">
          {{ teamInfo.org.creator || '创建者' }} - {{ teamInfo.org.name }}
        </span>
        <span class="team-intro">
          {{ teamInfo.org.intro }}
        </span>

        <div class="flex-grow"></div>

        <el-button @click="enterTeam(teamInfo.org.id)">
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
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import emitter from '@/utils/emitter'
import CreateTeam from '@/components/team/CreateTeam.vue'
import { useUserStore } from '@/stores/modules/user'
import { getAllOrgs } from '@/api/org'

const router = useRouter()
const userStore = useUserStore()

const teamInfoList = ref([])

onActivated(() => {
  GetAllOrgs()
})

const GetAllOrgs = async () => {
  try {
    const res = await getAllOrgs()
    console.log(res)
    if (res.meta.status == 0) {
      teamInfoList.value = res.data.organizations
      moveCurrentTeamToTop(userStore.orgId)
      console.log(teamInfoList.value)
    } else {
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }
}

const moveCurrentTeamToTop = (teamId) => {
  const teamInfo = teamInfoList.value.find((teamInfo) => teamInfo.org.id == teamId)
  teamInfoList.value.splice(teamInfoList.value.indexOf(teamInfo), 1)
  teamInfoList.value.unshift(teamInfo)
}

GetAllOrgs()

const enterTeam = (teamId) => {
  console.log(teamId)
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
