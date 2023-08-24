<template>

  <div class="header-wrapper">
    <div class="container">
    <div class="router-wrapper">
      面包屑路由
    </div>
    <div class="user-status-wrapper">
      <div class="user-status">
        <el-link :underline="false" :onclick="logout">登出</el-link>
        <router-link to="/my/profile" class="user-avatar-wrapper">
          <el-link :underline="false">
            {{ user.username }}
            <el-avatar class="user-avatar" :size="36" :src="user.avatar" />
          </el-link>
        </router-link>
      </div>
    </div>

    </div>
  </div>

  <!-- <div class="header-container">
    <el-col :span="6">
      面包屑路由
    </el-col>
    <el-col :span="12"></el-col>
    <el-col :span="6" class="user-status-wrapper">
      <div class="user-status">
        <el-link :underline="false" :onclick="logout">登出</el-link>
        <router-link to="/my/profile" class="user-avatar-wrapper">
          <el-link :underline="false">
            {{ user.username }}
            <el-avatar class="user-avatar" :size="36" :src="user.avatar" />
          </el-link>
        </router-link>
      </div>
    </el-col>
  </div> -->


</template>

<script>
export default {
  name: 'Header',

  data() {
    return {
      isLoggedIn: false,
      user: {
        username: 'username',
        avatar: 'https://avatars.githubusercontent.com/u/10000000?v=4',
      },
    }
  },

  methods: {
    logout() {
      console.log('logout')
    },
  }
}
</script>

<style scoped>
.header-wrapper {
  background-color: #333333;
}

.router-wrapper {
  height: 36px;
  line-height: 36px;
  padding: 20px;
  float: left;
  display: inline-block;
}

.user-status-wrapper {
  height: 36px;
  line-height: 36px;
  padding: 20px;
  float: right;
  display: inline-block;
}

.user-avatar-wrapper {
  margin-left: 20px;
}
.user-avatar {
  margin-left: 10px;
}

</style>