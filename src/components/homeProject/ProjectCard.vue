<!-- 项目文档的卡片组件 -->
<template>
  <div class="doc-card" @mouseenter="expandCard" @mouseleave="shrinkCard" @click="chooseProject">
    <div class="doc-image-container" :style="{ backgroundImage: `url(${project.avatarUrl})`, height: imageHeight }"></div>
    <div class="doc-text-container" :style="{ height: textHeight }">
      <div class="doc-title">{{ project.name }}</div>
      <div v-if="expanded" class="doc-intro">{{ project.description }}</div>
      <div v-if="expanded" class="doc-create-time">{{ project.created.split(' ')[0] }}</div>
    </div>

    <div class="button-wrapper">
      <el-icon class="edit-button" @click.stop="openEdit">
        <Edit />
      </el-icon>
      <el-icon class="copy-button" @click.stop="openCopy">
        <CopyDocument />
      </el-icon>
      <el-icon class="delete-button" @click.stop="openDelete">
        <Delete />
      </el-icon>
    </div>

    <transition name="slide-up">
      <el-row class="mb-4 doc-buttom-group" v-if="expanded">
    </el-row>
  </transition>

  <div @click.stop="">
    <el-dialog
      v-model="editDialogVisible"
      title="修改项目信息"
      width="50%"
    >
      <div class="proj-name-wrapper">
        <span>项目名称</span>
        <el-input v-model="changingProjName" placeholder="{{ changingProjName }}">
        </el-input>
      </div>
      <div class="proj-desc-wrapper">
        <span>项目简介</span>
        <el-input
          v-model="changingProjDesc"
          type="textarea"
          placeholder="{{ changingProjDesc }}"
        >
        </el-input>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEdit">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</div></template>


<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateStatus, duplicateProject, updateProjectInfo } from '@/api/project'
import { useUserStore } from '@/stores/modules/user'
import { ref } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'

const userStore = useUserStore()
export default {
  name: "ProjectCard",
  props: ["project"],

  data() {
    return {
      expanded: false,
      editDialogVisible: false,
      changingProjName: this.project.name,
      changingProjDesc: this.project.description,
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
      userStore.setProjectId(this.project.id);
      this.$router.push({
        name: "info"
      });
    },

    async handleEdit() {
      console.log(this.changingProjName, this.changingProjDesc)
      this.editDialogVisible = false
      try {
        const res = await updateProjectInfo({
          projId: this.project.id,
          name: this.changingProjName,
          description: this.changingProjDesc
        })
        if (res.meta.status == 0) {
          ElMessage({
            type: 'success',
            message: '修改成功',
          });
        } else {
          ElMessage({
            type: 'error',
            message: '修改失败',
          });
        }
        this.$emit('update')
      } catch (e) {
        console.log(e)
      }
    },

    openEdit() {
      this.editDialogVisible = true;
    },

    async openCopy() {
      ElMessageBox.confirm(`确认生成「${this.project.name}」的副本吗?`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await duplicateProject({
            projId: this.project.id
          });
          if (res.meta.status == 0) {
            ElMessage({
              type: 'success',
              message: '已复制',
            });
          } else {
            ElMessage({
              type: 'error',
              message: '复制失败',
            });
          }
          this.$emit('update');
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消复制',
          });
        });
    },

    async openDelete() {
      ElMessageBox.confirm(`确认删除 「${this.project.name}」吗?`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await updateStatus({
            status: 1,
            projects: [this.project.id],
          })
          if (res.meta.status == 0) {
            ElMessage({
              type: 'success',
              message: '已删除',
            });
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败',
            });
          }
          this.$emit('update');
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          });
        });
    }
  },
  mounted() {
  },
  components: { CopyDocument }
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

.doc-create-time {
  margin: 10px;
  margin-bottom: 2px;
  font-size: 14px;
  color: #777777;
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
  width: 100px;
  height: 30px;
  z-index: 1;
  display: none;

  .edit-button {
    font-size: 24px;
    color: #0099cc;
    cursor: pointer;
  }

  .copy-button {
    font-size: 24px;
    color: #339933;
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

.proj-name-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  span {
    width: 64px;
    margin-right: 20px;
  }
}

.proj-desc-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  span {
    width: 64px;
    margin-right: 20px;
  }
}
</style>
