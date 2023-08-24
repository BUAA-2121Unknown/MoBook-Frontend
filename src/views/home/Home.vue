<script setup>
import DefaultHome from './Default.vue'
import NoOrgHome from './NoOrg.vue'

const noOrg = false // TODO: useStore needed
</script>

<template>
  <div v-if="noOrg" class="container">
    <NoOrgHome />
  </div>
  <div v-else class="container">
    <DefaultHome />
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
