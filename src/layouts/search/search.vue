<template>
  <div class="search-component">
      <div class="gvaIcon gvaIcon-refresh" :class="[reload ? 'reloading' : '']" @click="handleReload" />
      <div class="gvaIcon gvaIcon-customer-service" @click="toService" />
  </div>
</template>

<script>
export default {
  name: 'BtnBox',
}
</script>

<script setup>
import emitter from '@/utils/emitter'
import { ref } from 'vue'

const reload = ref(false)
const handleReload = () => {
  reload.value = true
  emitter.emit('reload')
  setTimeout(() => {
    reload.value = false
  }, 500)
}

const toService = () => {
  window.open('https://github.com/BUAA-2121Unknown')
}
</script>

<style scoped lang="scss">
.search-component {
  @apply inline-flex overflow-hidden text-center gap-5 mr-5;
  div{
    @apply cursor-pointer;
  }
  .el-input__inner {
    @apply border-b border-solid border-gray-300;
  }
  .el-dropdown-link {
    @apply cursor-pointer;
  }
}

.reload {
  font-size: 18px;
}


.reloading{
  animation:turn 0.5s linear infinite;
}

@keyframes turn {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
