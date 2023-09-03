<!-- 项目文档的卡片组件 -->
<template>
  <div class="doc-card" @mouseenter="expandCard" @mouseleave="shrinkCard" @click="chooseProject">
      <div class="doc-image-container" :style="{ backgroundImage: `url(${project.avatarUrl})`, height: imageHeight }"></div>
      <div class="doc-text-container" :style="{ height: textHeight }">
          <div class="doc-title">{{ project.name }}</div>
          <div v-if="expanded" class="doc-intro">{{ project.description }}</div>
      </div>

      <div class="button-wrapper">
        <el-icon class="shift-button" @click.stop="shift">
          <RefreshLeft />
        </el-icon>
        <el-icon class="delete-button" @click.stop="open">
          <Delete />
        </el-icon>
      </div>

      <transition name="slide-up">
          <el-row class="mb-4 doc-buttom-group" v-if="expanded">
          </el-row>
      </transition>
  </div>
</template>


<script>
import { useUserStore } from '@/stores/modules/user'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateStatus } from '@/api/project'
import { Delete, RefreshLeft } from '@element-plus/icons-vue'

const userStore = useUserStore()
export default {
  name: "TrashProjectCard",
  props: ["project"],
  setup() {
    return {
      Delete,
      RefreshLeft,
    }
  },

  data() {
      return {
          expanded: false,
          projectFormData: {
            status: '',
            projects: [],
          }
      };
  },
  computed: {
      imageHeight() {
          return this.expanded ? "40%" : "80%";
      },
      textHeight() {
          return this.expanded ? "60%" : "20%";
      },
  },
  methods: {
      expandCard() {
          this.expanded = true;
      },
      shrinkCard() {
          this.expanded = false;
      },
      chooseProject() {
        userStore.setProjectId(this.project.id)
        this.$router.push({
            name: "info"
        });
      },
      async deepDelete(){
        // console.log(this.project.id)
        this.projectFormData.status = 2
        this.projectFormData.projects.push(this.project.id);
        console.log(this.projectFormData)
        const res = await updateStatus(this.projectFormData)
        console.log(res)
      },
      shiftProject(){
        this.projectFormData.status = 0
        this.projectFormData.projects.push(this.project.id);
        updateStatus(this.projectFormData)
      },
      async open() {
        ElMessageBox.confirm(
          '删除的文件会彻底删除，确认删除吗?',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            await this.deepDelete()
            //假删除
            this.$emit('delete', this.project.id)
            ElMessage({
              type: 'success',
              message: '已删除',
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
      },
      async shift() {
        ElMessageBox.confirm(
          '确认把回收站的文件放回吗?',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            this.shiftProject()
            this.$emit('delete', this.project.id)
            ElMessage({
              type: 'success',
              message: '已删除',
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
      }
  },
};
</script>

<style scoped lang="scss">
.doc-card {
  margin: 10px;
  width: 22%;
  height: 200px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  box-shadow: 0px 2px 4px 0px rgba(52, 51, 51, 0.2);
  position: relative;
}

.doc-image-container {
  width: 100%;
  background-size: cover;
  background-position: center;
  transition: height 0.3s ease;
}

.doc-text-container {
  background-color: rgba(237, 244, 249, 0.7);
  backdrop-filter: blur(6px);

  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
  transition: height 0.5s ease, background-color 0.3s ease;
}

.doc-title {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  color: rgba(5, 5, 5, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-intro {
  margin: 10px;
  font-size: 16px;
  color: rgba(39, 39, 39, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-buttom-group {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease;
}

.v-leave-from,
.v-enter-to {
  transform: translateY(0);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(150%);
}

.button-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60px;
  height: 30px;
  z-index: 1;
  display: none;

  .shift-button {
    font-size: 24px;
    color: #0099cc;
    cursor: pointer;
  }

  .delete-button {
    font-size: 24px;
    color: red;
    cursor: pointer;
  }
}

/* 删除按钮 */
/* When mouse hovers over the box, the delete button is displayed */
.doc-card:hover .button-wrapper {
  display: flex;
}
</style>
