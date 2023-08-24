<script setup>
const teamID = 1
</script>

<template>
  <el-aside width="200px">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#333333"
      class="el-menu-vertical-demo"
      :default-active="$route.path"
      router
      text-color="#fff"
    >
      <el-menu-item index="/">
        <div class="logo">
          <img src="@/assets/logo.png" style="height: 100%" />
        </div>
      </el-menu-item>

      <el-menu-item index="/team" :route="{ path: '/team', query: {teamID: teamID}}">
        <el-icon><User /></el-icon>
        <span>团队</span>
      </el-menu-item>
      <el-menu-item index="/chat" :route="{ path: '/chat', query: {teamID: teamID}}">
        <el-icon><ChatDotRound /></el-icon>
        <span>群聊</span>
      </el-menu-item>
      <el-menu-item index="/project" :route="{ path: '/project', query: {teamID: teamID}}">
        <el-icon><Document /></el-icon>
        <span>项目</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.response-sider {
  background-color: #333333;
  color: #fff;
  overflow: hidden;
  width: 200px;
  transition: all 0.3s;
  margin: 0 20px;
}

.el-menu {
  height: 98vh;
}

.logo {
  height: 48px;
  line-height: 24px;
  color: var(--el-text-color-primary);
  font-size: 24px;
  text-align: center;
  background-color: #333333;
}
</style>
