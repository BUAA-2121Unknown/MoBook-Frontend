<template>
  <router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  background: #eee;
  height: 100vh;
  overflow: hidden;
  font-weight: 400 !important;
}

.el-button{
  font-weight: 400 !important;
}
</style>
