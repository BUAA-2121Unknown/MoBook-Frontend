<template>
  <div class="main-wrapper">
    <el-row>
      <el-col :span="4">
        <div class="avatar-wrapper">
          <img src="@/assets/logo.png" style="height: 100%" />
        </div>
      </el-col>
      <el-col :span="20">
        <el-row class="row-wrapper">
          <span class="orgName">
            {{ orgName }}
          </span>
        </el-row>
        <el-row>
          <span class="orgDesc">
            {{ orgDesc }}
          </span>
        </el-row>
      </el-col>
    </el-row>

    <div class="gva-table-box" style="margin-top: 2%;">
      <div class="gva-btn-list">
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
</template>

<script>
export default {
  name: 'DefaultHome',
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import { onActivated } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { getOrgInfo, getOrgAllMemberInfo } from '@/api/org'
import { useUserStore } from '@/stores/modules/user'

const searchedInput = ''
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

const inviteUser = () => {
  // TODO
  console.log('inviteUser')
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
    console.log(orgInfo)
    if (orgInfo.meta.status == 0) {
      orgName.value = orgInfo.data.org.name
      orgDesc.value = orgInfo.data.org.description
      orgAvatarUrl.value = orgInfo.data.org.avatarUrl
      userStore.setAuth(orgInfo.data.auth.auth)
    } else {
      console.log(orgInfo)
    }
    const orgMembers = await getOrgAllMemberInfo({ orgId: userStore.orgId })
    if (orgMembers.meta.status == 0) {
      orgMemberList.value = orgMembers.data.members
    } else {
      console.log(orgMembers)
    }
  } catch(e) {
    console.log(e)
  }
}
</script>

<style scoped>
.main-wrapper {
  padding-top: 1%;
}
.header-wrapper {
  padding-top: 12px;
  border-top: #777777 solid 1px;
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
}
</style>
