<template>
  <div class="container">
    <h1 class="error-info">Error Logs</h1>
    <el-row class="mb-4">
      <el-button @click="testVueError">testError</el-button>
    </el-row>
    <el-table :data="errorLogStore.errorLogInfoList">
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="url" label="URL" />
      <el-table-column prop="time" label="时间" />
      <el-table-column prop="file" label="文件" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="detail" label="错误信息" />
      <el-table-column prop="stack" label="Stack信息" />
    </el-table>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useErrorLogStore } from '@/stores/modules/errorLog'

function testVueError() {
  throw new Error('fire vue error!')
}

const errorLogStore = useErrorLogStore()

watch(
  () => errorLogStore,
  () => {},
)
</script>

<style scoped>
.container {
  text-align: center;
}

.error-info {
  font-size: 16px;
  margin: 10px;
}
</style>
