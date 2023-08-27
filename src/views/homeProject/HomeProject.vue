<template>
  <div class="container">
    <div class="search-container">
      <div class="section-title">团队项目</div>
      <div class="right-elements">
        <input type="text" placeholder="搜索">
        <el-button type="primary" @click="visible = true">创建项目</el-button>
      </div>
    </div>
    <div class="project-container">
      <ProjectCard v-for="item in items" :key="item.id" :project="item" />
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
          <el-form-item label="项目封面">
            <el-input />
          </el-form-item>
          <el-form-item label="项目名字">
            <el-input v-model="projectForm.name" />
          </el-form-item>
          <el-form-item label="项目简介">
            <el-input v-model="projectForm.description" type="textarea" />
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
import project_bg from '@/assets/homeProject/project_bg.png'
import ProjectCard from '@/components/homeProject/ProjectCard.vue'
import { ref } from 'vue'
import { ElButton, ElDrawer } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { createProject } from '@/api/project'
// do not use same name with ref
const projectFormData = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
export default {
  name: "Project",
  components: {
    ProjectCard
  },
  methods: {
    submitForm() {
      projectFormData.org
      createProject(projectFormData).then(res => {
        console.log(res)
        ElMessage({
          message: '创建成功',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        ElMessage({
          message: '创建失败',
          type: 'error'
        })
      }
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
      form,
    };
  },
  data() {
    return {
      items: [
        { id: 1, img: project_bg, title: "项目1", intro: "这是项目1的描述" },
        { id: 2, img: project_bg, title: "项目2", intro: "这是项目2的描述" },
        { id: 3, img: project_bg, title: "项目3", intro: "这是项目3的描述" },
        { id: 4, img: project_bg, title: "项目4", intro: "这是项目4的描述" }
      ]
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