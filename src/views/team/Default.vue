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
          <span class="teamName">
            {{ teamName }}
          </span>
        </el-row>
        <el-row>
          <span class="teamIntro">
            {{ teamIntro }}
          </span>
        </el-row>
      </el-col>
    </el-row>

    <div class="gva-table-box" style="margin-top: 2%;">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="inviteUser">邀请成员</el-button>
      </div>
      <el-table
        :data="coWorkerList"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="authorityId"
        style="width: 100%"
      >
        <el-table-column label="姓名" min-width="180" prop="name" />
        <el-table-column label="邮箱" min-width="180" prop="email" />
        <el-table-column label="角色" min-width="180" prop="role" />
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

  data() {
    return {
      searchedInput: "",
      coWorkerList: [
        {
          name: '张三',
          email: 'fuckBUAA.edu.cn',
          role: '管理员',
        }
      ],
      teamName:  '团队名',
      teamIntro: '团队简介 BlaBla...',
    }
  },

  methods: {
    inviteUser() {
      console.log('inviteUser')
    },
  },
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

.teamName {
  font-size: 24px;
  font-weight: bold;
}

.teamIntro {
  font-size: 16px;
  font-weight: bold;
}
</style>
