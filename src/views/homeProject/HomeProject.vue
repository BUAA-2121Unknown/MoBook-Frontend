<template>
  <div class="container">
    <div class="search-container">
      <el-col :span="4">
        <div class="section-title">团队项目</div>
      </el-col>

      <el-col :span="12"></el-col>
      <div class="flex-grow"></div>
      <el-input v-model="searchedInput" placeholder="搜索项目" class="search-input" @keyup.enter="searchProject">
        <template #append>
          <el-button :icon="Search" @click="searchProject" />
        </template>
      </el-input>
      <el-button class="create-button" type="primary" @click="visible = true">创建项目</el-button>
    </div>

    <div class="project-container">
      <ProjectCard v-for="project in projectList" :key="project.id" @update="handleUpdate" :project="project" />
    </div>

    <el-drawer v-model="visible" :show-close="false" direction="rtl" size="80%">
      <template #header="{ close }">
        <div class="form-title">填写项目信息</div>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          关闭
        </el-button>
      </template>

      <div class="form-container">
        <el-form :model="projectFormData" label-width="120px">
          <el-form-item label="项目名字">
            <el-input v-model="projectFormData.name" />
          </el-form-item>
          <el-form-item label="项目简介">
            <el-input v-model="projectFormData.description" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import project_bg from '@/assets/homeProject/project_bg.png'
import ProjectCard from '@/components/homeProject/ProjectCard.vue'
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
  name: "Project",
  components: {
    ProjectCard,
  },
  data(){
    return {
      searchedInput: '',
      projectList: [],
      projectListCopy: [],
    }
  },
  methods: {
    handleDelete(id) {
      this.projectList = this.projectList.filter(project => project.id !== id);
    },

    handleUpdate() {
      this.GetProjects()
    },

    async submitForm() {
      try {
        projectFormData.orgId = userStore.orgId
        console.log(userStore.orgId)
        console.log(projectFormData)
        const res = await createProject(projectFormData)
        console.log(res)
        if (res.meta.status == 0) {
          ElMessage({
            type: 'success',
            message: '创建成功'
          })
          this.$router.push({
              name: "info"
          });
          userStore.setProjectId(res.data.id)
          return res
        }
      } catch (e) {
        console.log(e)
      }
    },

    async GetProjects() {
      try {
        const res = await getProjects({ orgId: userStore.orgId, status: 0 })
        console.log(res)
        if (res.meta.status == 0) {
          this.projectList = res.data.projects
          this.projectListCopy = res.data.projects
        } else {
          console.log(data)
        }
      } catch(e) {
        console.log(e)
      }
    },

    async searchProject() {
      console.log(this.searchedInput)
      this.projectList = this.projectListCopy
      if (!this.searchedInput) {
        await this.GetProjects()
        return
      }
      this.projectList = this.projectList.filter(item => item.name.includes(this.searchedInput))
    }
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
      projectFormData,
      Search
    };
  },

  async mounted(){
    await this.GetProjects()
  }
}
</script>

<style scope lang="scss">
.container {
  text-align: center;
}

/* 搜索框的那一行 */
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 18px;
}

/* 版块标题的字 */
.section-title {
  font-size: 24px;
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
}

.search-input {
  padding-right: 10px;
}

.create-button {
  margin-right: 6%;
}
</style>