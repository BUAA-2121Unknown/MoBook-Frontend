<script setup>
import Header from '@/layouts/components/header/index.vue'
import Sider from '@/layouts/components/sider/Project.vue'
</script>

<template>
  <Header></Header>
  <el-container>
    <Sider></Sider>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'ProjectLayout',
}
</script>
