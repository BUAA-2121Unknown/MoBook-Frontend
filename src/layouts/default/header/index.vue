<template>
  <el-header>
    <div class="header-menu-wrapper">
      <div class="container">
        <el-menu mode="horizontal" :default-active="$route.path" router
          :ellipsis="false" background-color="#333333" text-color="#ffffff"
          active-text-color="#ffffff"
          class="header-menu">
          <el-menu-item index="/">
            首页
          </el-menu-item>
          <el-menu-item index="/error">
            错误
          </el-menu-item>
          <el-menu-item index="/log">
            日志
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>
.header-menu-wrapper {
  background-color: #333333;
  color: #ffffff;
}
.header-menu {
  border: none;
}
</style>