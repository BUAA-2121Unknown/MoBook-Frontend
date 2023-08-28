<template>
  <div class="container">
    <div class="search-container">
      <div class="section-title">回收站</div>
      <div class="right-elements">
        <input type="text" placeholder="搜索">
      </div>
    </div>
    <div class="project-container">
      <TrashProjectCard v-for="project in projectList" :key="project.id" @delete="handleDelete" :project="project" />
    </div>

  </div>
</template>

<script>
import project_bg from '@/assets/homeProject/project_bg.png'
import TrashProjectCard from '@/components/homeProject/TrashProjectCard.vue'
import { ref } from 'vue'
import { ElButton, ElDrawer } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { createProject } from '@/api/project'
import { getProjects } from '@/api/project'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// do not use same name with ref
const projectFormData = reactive({
  name: '',
  description: '',
})
export default {
  name: "TrashProject",
  components: {
    TrashProjectCard
  },
  setup() {
    const visible = ref(false)
    return {
      visible,
      ElMessage,
      ElMessageBox,
      CircleCloseFilled,
      ElButton,
      ElDrawer,
      projectFormData
    };
  },
  data() {
    return {
      projectList: [
      ]
    }
  },
  methods: {
    handleDelete(id) {
      this.projectList = this.projectList.filter(project => project.id !== id);
    },
  },
  async mounted(){
    const res = await getProjects({ orgId: userStore.orgId, status: 1 })
    if (res.meta.status == 0) {
      this.projectList = res.data.projects
    } else {
      console.log(data)
    }
  }
}
</script>

<style>
.container {
  text-align: center;
}

/* 搜索框的那一行 */
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 版块标题的字 */
.section-title {
  font-size: 22px;
  font-weight: bold;
  margin: 2px 0;
}

/* 右侧元素 */
.right-elements {
  margin-left: auto;
  /* 将右侧元素推向容器的右边 */
}

/* 搜索框 */
input {
  width: 200px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 0 10px;
}

/* 项目列表的容器 */
.project-container {
  display: flex;
  flex-wrap: wrap;
}

/* 创建项目的卡片 */
.form-container {
  padding: 0 25%;
  text-align: left;
}

/* 创建项目的标题 */
.form-title {
  font-size: 22px;
  font-weight: bold;
  margin: auto;
  margin-bottom: 20px;
}

/* el-image的设置 */
.demo-image .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image .block:last-child {
  border-right: none;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}</style>