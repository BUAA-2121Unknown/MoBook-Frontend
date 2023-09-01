<template>
  <div class="file-card-container">
    <el-row :gutter="12">
      <el-col :span="16">
        <span>
          {{ props.name }}
        </span>
      </el-col>
      <el-col :span="4">
        <span>
          {{ props.creator }}
        </span>
      </el-col>
      <el-col :span="4">
        <span>
          {{ props.updatedTime }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'FileCard',
}
</script>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  updatedTime: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.file-card-container {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 10px;
}
</style>
