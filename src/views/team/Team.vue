<template>
  <div class="container">
    <DefaultHome />
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<script setup>
import { onMounted, ref } from 'vue';
import DefaultHome from './Default.vue'
// import NoOrgHome from './NoOrg.vue'
import { useUserStore } from '@/stores/modules/user'

const noOrg = ref(false)

const userStore = useUserStore()

onMounted(() => {
  if (userStore.orgId != -1) {
    noOrg.value = false
  } else {
    noOrg.value = true
  }
})

</script>

<style scoped>
.container {
  text-align: center;
}
</style>
