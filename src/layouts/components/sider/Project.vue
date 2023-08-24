<script setup>
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="response-sider">
    <el-aside>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#333333"
          class="el-menu-vertical-demo"
          default-active="1"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1">
            <el-icon><User /></el-icon>
            <span>项目概览</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><ChatDotRound /></el-icon>
            <span>原型设计</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Document /></el-icon>
            <span>项目文档</span>
          </el-menu-item>
        </el-menu>
    </el-aside>
  </div>
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
  height: 88vh;
}
</style>
