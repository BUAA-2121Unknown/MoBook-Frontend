<template>
  <el-button @click="createTeam">
    创建团队
  </el-button>
  <el-button @click="joinTeam">
    加入团队
  </el-button>

  <CreateTeam v-if="teamOption == 'createTeam'" />

  <el-dialog title="加入团队" v-model="joinTeamDialogVisible">
    <el-form>
      <el-form-item label="团队邀请链接">
        <el-input v-model="inviteCode" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="joinTeamDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmJoin">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateOrJoin'
}
</script>

<script setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter'
import CreateTeam from '@/components/team/CreateTeam.vue'
import { activateInvite } from '@/api/org'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const teamOption = ref('')
const joinTeamDialogVisible = ref(false)
const inviteCode = ref('')

const createTeam = () => {
  console.log('fuck')
  teamOption.value = 'createTeam'
}

const joinTeam = () => {
  joinTeamDialogVisible.value = true
}

const confirmJoin = async () => {
  try {
    const tokenMatch = inviteCode.value.match(/[?&]token=([^&]+)/)
    const token = tokenMatch[1]
    console.log(token)
    const res = await activateInvite({ token: token })
    console.log(res)
    if (res.meta.status == 0) {
      userStore.orgId = res.data.profile.member.orgId
      ElMessage({
        type: 'success',
        message: '成功加入',
        close: true,
      })
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
    ElMessage({
      type: 'error',
      message: '链接无效',
      close: true,
    })
    console.log(e)
  }
}

emitter.on('setTeamOption', (option) => {
  teamOption.value = option
})
</script>

<style scoped>
</style>
