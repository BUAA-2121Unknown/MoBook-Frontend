<template>
  <div>
    团队
  </div>

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

  <div>
    <el-row>
      <el-col :span="12"></el-col>
      <el-col :span="8">
        <div class="searchBar">
          <el-input
            v-model="searchedInput"
            placeholder="搜索成员"
            class="input-with-select"
          >
            <template #append>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="inviteUser">邀请成员</el-button>
      </el-col>
    </el-row>

    <el-table :data="coWorkerList">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="身份" />
    </el-table>
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
