<template>
  <div>
    <FileFolder :itemProperty="2"/>
  </div>
</template>

<script>
export default {
  name: 'ProjectDesignList'
}
</script>
  
<script setup>
import FileFolder from '@/components/fileManager/FileFolder.vue'
import { ref, onMounted } from 'vue'
import { updateGuide } from '@/api/user'

// 新手指引
import { Tour } from "vue3-quick-tour"
const showTour = ref(false)
const tourCurrent = ref(0)
const tourSteps = [
  {
    el: () => document.getElementById("tour-file-step-0"),
    title: "文件列表",
    message: "在这里你可以拖动文件到文件夹，双击打开文件或文件夹，右键可以重命名或删除文件",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "top",
  },
  {
    el: () => document.getElementById("tour-file-step-1"),
    title: "文件路径",
    message: "这是当前的文件路径，点击可以返回上级目录，或将文件拖拽至此处移动文件",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right",
  },
]

onMounted(async () => {
  // 开启新手指引 TODO：判断权限位
  const res = await updateGuide({ type: 0 })
  console.log(res)
  if (res.meta.status == 0) {
    // 开启新手指引 TODO：判断权限位
    showTour.value = !res.data.value
    tourCurrent.value = 0
  }
})
</script>
  
  <style scoped>
  </style>
  