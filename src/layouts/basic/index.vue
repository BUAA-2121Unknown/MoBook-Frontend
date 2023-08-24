<script setup>
import Header from '@/layouts/components/header/index.vue'
import Sider from '@/layouts/components/sider/Basic.vue'
</script>

<template>
  <el-container>
    <Sider></Sider>
    <el-container>
      <el-header><Header /></el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'BasicLayout',
}
</script>
