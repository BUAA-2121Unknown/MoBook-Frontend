<template>
  <div class="main-wrapper">
    <el-row>
      <el-col :span="4">
        <div class="avatar-wrapper">
          <img v-if="orgAvatarUrl" :src="orgAvatarUrl" style="height: 100%" />
          <img v-else src="@/assets/logo.png" style="height: 100%" />
        </div>
      </el-col>
      <el-col :span="20">
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
    </el-row>

    <div class="gva-table-box" style="margin-top: 2%;">
      <div class="gva-btn-list">
        <el-col :span="16"></el-col>
        <div class="flex-grow"></div>

        <el-input
          v-model="searchedInput"
          placeholder="搜索成员"
          class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" @click="searchTeamMember" />
          </template>
        </el-input>
        <el-button type="primary" icon="plus" @click="inviteUser">邀请成员</el-button>
      </div>
      <el-table
        :data="orgMemberList"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="authorityId"
        style="width: 100%"
      >
        <el-table-column label="姓名" min-width="180" prop="user.username" />
        <el-table-column label="昵称" min-width="180" prop="member.nickname" />
        <el-table-column align="left" label="操作" width="460">
          <template #default="scope">
            <el-button
              icon="setting"
              type="primary"
              link
              @click="opdendrawer(scope.row)"
            >设置权限</el-button>
            <el-button
              icon="plus"
              type="primary"
              link
              @click="addAuthority(scope.row.authorityId)"
            >新增子角色</el-button>
            <el-button
              icon="copy-document"
              type="primary"
              link
              @click="copyAuthorityFunc(scope.row)"
            >拷贝</el-button>
            <el-button
              icon="edit"
              type="primary"
              link
              @click="editAuthority(scope.row)"
            >编辑</el-button>
            <el-button
              icon="delete"
              type="primary"
              link
              @click="deleteAuth(scope.row)"
            >删除</el-button>
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

const searchedInput = ref('')
const orgMemberList = ref([
  {
    "user": {
        "id": 1,
        "username": "Tony",
        "name": null,
        "avatarUrl": null
    },
    "member": {
        "orgId": 5,
        "nickname": "Tony",
        "auth": 0
    }
  },
])
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
    const orgInfo = await getOrgInfo({ orgId: userStore.orgId })
    if (orgInfo.meta.status == 0) {
      orgName.value = orgInfo.data.org.name
      orgDesc.value = orgInfo.data.org.description
      orgAvatarUrl.value = orgInfo.data.org.avatarUrl
      userStore.setAuth(orgInfo.data.auth.auth)
    } else {
      console.log(orgInfo)
    }
    const orgMembers = await getOrgAllMemberInfo({ orgId: userStore.orgId })
    console.log(orgMembers)
    if (orgMembers.meta.status == 0) {
      orgMemberList.value = orgMembers.data.members
    } else {
      console.log(orgMembers)
    }
  } catch(e) {
    console.log(e)
  }
}

const searchTeamMember = () => {
  if (!searchedInput.value) {
    GetOrgInfo()
    return
  }
  orgMemberList.value = orgMemberList.value.filter(item => item.member.nickname.includes(searchedInput.value))
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
</style>
