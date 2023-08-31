<template>
  <div class="main-wrapper">
    <el-row>
      <el-col :span="4">
        <div class="avatar-wrapper">
          <img v-if="orgAvatarUrl" :src="orgAvatarUrl" class="orgAvatar" />
          <img v-else src="@/assets/logo.png" class="orgAvatar" />
        </div>
      </el-col>
      <el-col :span="16">
        <el-row class="row-wrapper">
          <span class="orgName">
            {{ orgName }}
          </span>
        </el-row>
        <el-row class="row-wrapper">
          <span class="orgDesc">
            {{ orgDesc }}
          </span>
        </el-row>
      </el-col>
      <el-col :span="4">
        <el-button @click="editOrgVisible = true">
          编辑团队信息
        </el-button>
      </el-col>
    </el-row>

    <div class="gva-table-box" style="margin-top: 2%;">
      <div class="gva-btn-list">
        <el-col :span="16"></el-col>
        <div class="flex-grow"></div>

        <el-input
          v-model="searchedInput"
          placeholder="搜索成员"
          class="input-with-select"
          @keyup.enter="searchTeamMember"
        >
          <template #append>
            <el-button :icon="Search" @click="searchTeamMember" />
          </template>
        </el-input>
        <el-button type="primary" icon="plus" @click="inviteUser" v-if="userStore.auth <= 1">邀请成员</el-button>
      </div>
      <el-table
        :data="orgMemberList"
        row-key="user.id"
        :row-class-name="membersRow"
        style="width: 100%"
      >
        <el-table-column label="昵称" min-width="180">
          <template #default="scope">
            <div class="team-member-wrapper">
              <img v-if="scope.row.user.avatarUrl" :src="scope.row.user.avatarUrl" style="width: 24px; height: 24px; margin-right: 10px; border-radius: 50%" />
              <img v-else src="@/assets/noBody.png" style="width: 24px; height: 24px; margin-right: 10px; border-radius: 50%" />
              <span v-if="userStore.userInfo.id == scope.row.user.id">{{ scope.row.member.nickname }}（我）</span>
              <span v-else>{{ scope.row.member.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" min-width="180" prop="user.email" />
        <el-table-column label="角色" min-width="180">
          <template #default="scope">
            <span>{{ authToRole(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="460">
          <template #default="scope">
            <el-button v-if="userStore.auth == 0 && scope.row.member.auth == 1"
              icon="setting"
              type="primary"
              link
              @click="changeAuth(scope.row, 2)"
            >设为普通用户</el-button>
            <el-button v-if="userStore.auth <= 1 && userStore.userInfo.id != scope.row.user.id && scope.row.member.auth == 2"
              icon="setting"
              type="primary"
              link
              @click="changeAuth(scope.row, 1)"
            >设为管理员</el-button>
            <el-button v-if="userStore.auth < scope.row.member.auth || userStore.userInfo.id == scope.row.user.id"
              icon="edit"
              type="primary"
              link
              @click="changeProfile(scope.row)"
            >编辑</el-button>
            <el-button v-if="userStore.auth <= 1 && userStore.userInfo.id != scope.row.user.id && scope.row.member.auth == 2"
              icon="delete"
              type="primary"
              link
              @click="deleteMember(scope.row)"
            >移出团队</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="邀请链接"
    width="30%"
  >
    <span>{{ inviteLink }}</span>
    <div class="invite-msg-wrapper">
      有效期 3 天，请及时使用
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyInviteLink">
          复制链接
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="changeProfileVisible"
    title="修改信息"
    width="30%"
  >
    <div class="nickname-wrapper">
      <span>昵称</span>
      <el-input v-model="changingMemberNickname" placeholder="{{ changingMemberNickname}}">
      </el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="changeProfileVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmChangeProfile">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editOrgVisible"
    title="编辑团队信息"
    width="30%"
  >
    <div class="org-name-wrapper">
      <span>团队名称</span>
      <el-input v-model="changingOrgName" placeholder="{{ changingOrgName }}">
      </el-input>
    </div>
    <div class="org-desc-wrapper">
      <span>团队简介</span>
      <el-input
        v-model="changingOrgDesc"
        type="textarea"
        placeholder="{{ changingOrgDesc }}"
      >
      </el-input>
    </div>
    <div class="org-avatar-wrapper">
      <span>团队头像</span>
      <AvatarUpload />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editOrgVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmChangeOrgInfo">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DefaultHome',
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import { onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrgInfo, getOrgAllMemberInfo } from '@/api/org'
import { useUserStore } from '@/stores/modules/user'
import { getInviteLink } from '@/api/org'
import settings from '@/settings/basic'
import { Search } from '@element-plus/icons-vue'
import { updateOrgMemberInfo, deleteOrgMember } from '@/api/org'
import AvatarUpload from '@/components/avatar/AvatarUpload.vue'

const searchedInput = ref('')
const orgMemberList = ref([])
const orgMemberListCopy = ref([])
const orgName = ref('团队名')
const orgDesc = ref('团队简介 BlaBla...')
const orgAvatarUrl = ref('')
const userStore = useUserStore()

const dialogVisible = ref(false)
const inviteLink = ref('')
const inviteUser = async () => {
  try {
    const res = await getInviteLink({
      orgId: userStore.orgId,
      expires: 3,
      review: false,
    })
    if (res.meta.status == 0) {
      inviteLink.value = settings.appURL + 'org/member/auth/activate?token=' + res.data.token
      dialogVisible.value = true
    } else {
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }
}

const authToRole = (row) => {
  const auth = row.member.auth
  switch (auth) {
    case 2:
      return '成员'
    case 1:
      return '管理员'
    case 0:
      return '创建者'
    default:
      return '未知'
  }
}

const copyInviteLink = () => {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', inviteLink.value)
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    ElMessage({
      type: 'success',
      message: '复制成功',
    })
  }
  document.body.removeChild(input)
  dialogVisible.value = false
}

onMounted(() => {
  GetOrgInfo()
})

onActivated(() => {
  GetOrgInfo()
})

const GetOrgInfo = async () => {
  try {
    console.log('start getOrgInfo', userStore.orgId)
    const orgInfo = await getOrgInfo({ orgId: userStore.orgId })
    console.log(orgInfo)
    if (orgInfo.meta.status == 0) {
      orgName.value = orgInfo.data.org.name
      orgDesc.value = orgInfo.data.org.description
      orgAvatarUrl.value = orgInfo.data.org.avatarUrl
      userStore.setAuth(orgInfo.data.auth.auth)
      userStore.setOrgInfo(orgInfo.data.org)
    } else {
      console.log(orgInfo)
    }
    const orgMembers = await getOrgAllMemberInfo({ orgId: userStore.orgId })
    if (orgMembers.meta.status == 0) {
      const members = orgMembers.data.members
      const targetIndex = members.findIndex(item => item.user.id == userStore.userInfo.id)
      if (targetIndex != -1) {
        const targetElement = members.splice(targetIndex, 1)[0]
        members.unshift(targetElement)
      }
      orgMemberList.value = members
      orgMemberListCopy.value = members
    } else {
      console.log(orgMembers)
    }
  } catch(e) {
    console.log(e)
  }
}

const searchTeamMember = () => {
  orgMemberList.value = orgMemberListCopy.value
  if (!searchedInput.value) {
    GetOrgInfo()
    return
  }
  orgMemberList.value = orgMemberList.value.filter(item => item.member.nickname.includes(searchedInput.value))
}

const changeUserChoose = ref()

const changeAuth = async (row, auth) => {
  try {
    const res = await updateOrgMemberInfo({
      orgId: userStore.orgId,
      userId: row.user.id,
      auth: auth,
    })
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
      row.member.auth = auth
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败',
      })
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }
}

const deleteMember = async (row) => {
  try {
    const res = await deleteOrgMember({
      orgId: userStore.orgId,
      users: [row.user.id],
    })
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '移除成功',
      })
      GetOrgInfo()
    } else {
      ElMessage({
        type: 'error',
        message: '移除失败',
      })
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }
}

const changeProfileVisible = ref(false)
const changingMemberNickname = ref('')
const changeProfile = (row) => {
  changeProfileVisible.value = true
  changeUserChoose.value = row
  changingMemberNickname.value = row.member.nickname
}
const confirmChangeProfile = async () => {
  try {
    const res = await updateOrgMemberInfo({
      orgId: userStore.orgId,
      userId: changeUserChoose.value.user.id,
      profile: {
        nickname: changingMemberNickname.value,
      }
    })
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
      changeUserChoose.value.member.nickname = changingMemberNickname.value
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败',
      })
      console.log(res)
    }
  } catch (e) {
    console.log(e)
  }
  changeProfileVisible.value = false
}

const membersRow = (row, index) => {
  if (row.row.user.id == userStore.userInfo.id) {
    return 'first-row-wrapper'
  } else {
    return ''
  }
}

const editOrgVisible = ref(false)
const changingOrgName = ref(userStore.orgInfo.name)
const changingOrgDesc = ref(userStore.orgInfo.description)
const confirmChangeOrgInfo = async () => {
  editOrgVisible.value = false
}
</script>

<style scoped>
.main-wrapper {
  padding-top: 1%;
}
.row-wrapper {
  padding: 10px;
}

.avatar-wrapper {
  height: 96px;
  line-height: 96px;
  color: var(--el-text-color-primary);
  text-align: center;
  border-radius: 50%;
}

.orgAvatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
}

.orgName {
  font-size: 24px;
  font-weight: bold;
}

.orgDesc {
  font-size: 16px;
  font-weight: bold;
  color: #999999;
}

.invite-msg-wrapper {
  margin-top: 10px;
  font-size: 14px;
  color: #999999;
}

.nickname-wrapper {
  margin-top: 10px;
  display: flex;
}

.nickname-wrapper span {
  width: 80px;
  line-height: 32px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

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

.team-member-wrapper {
  display: flex;
  align-items: center;
}

.org-name-wrapper {
  margin-top: 10px;
  display: flex;
}

.org-desc-wrapper {
  margin-top: 10px;
  display: flex;
}

.org-avatar-wrapper {
  margin-top: 10px;
  display: flex;
}
</style>

<style>
.el-table .first-row-wrapper {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>
