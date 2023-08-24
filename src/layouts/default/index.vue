<script setup>
import Header from './header/index.vue'
import Footer from './footer/index.vue'
</script>

<template>
  <Header></Header>
  <el-container>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
  <Footer></Footer>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>
