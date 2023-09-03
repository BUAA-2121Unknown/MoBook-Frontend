<template>
  <div class="main-container">
    <div class="title-container">
      <div class="main-title">
        <span style="font-size: 40px;">探索</span> MoBook
      </div>
    </div>
    <div class="main-box">
      <!-- <div class="button-box">
        <el-button @click="createTeam">
          创建团队
        </el-button>
        <el-button @click="joinTeam">
          加入团队
        </el-button>
      </div> -->

      <CreateTeam :joinHandler="joinTeam"/>
      <!-- <CreateTeam v-if="teamOption == 'createTeam'" /> -->

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
    </div>
  </div>
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
  } catch (e) {
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
/* @import '@/views/welcome/css/styles.css'; */
.title-container {
  position: absolute;
  top: 15%;
  width: 100%;
  text-align: center;
}

.main-title {
  font-family: "Varela Round", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 56px;
  line-height: 56px;
  letter-spacing: 2px;
  background: linear-gradient(rgba(7, 7, 7, 0.9), rgba(110, 110, 110, 0.5));
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  z-index: 1;
}

.main-container {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 35rem;
  padding: 15rem 0;
  background: linear-gradient(to bottom, rgba(227, 227, 227, 0.3) 0%, rgba(236, 236, 236, 0.5) 75%, #ebebeb 100%), url("@/views/welcome/assets/img/bg-signup.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: cover;
}

.main-box {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 25%;
  left: 20%;
  /* background: linear-gradient(to bottom, rgba(228, 228, 228, 0.2) 0%, rgba(215, 215, 215, 0.1) 75%, rgba(215, 215, 215, 0.1) 100%); */
  /* border: 1px solid rgba(215, 215, 215, 0.7); */
  border-radius: 12px;
}

</style>
