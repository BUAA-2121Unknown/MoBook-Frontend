<!-- 项目概况 -->
<template>
  <div class="container">
    <h1 class="header-container">项目概览</h1>
    <!--  -->
    <!-- 简介头栏 -->
    <div class="project-header-container">
      <!-- 背景头图 -->
      <!-- <img :src="projectHeadUrl" class="header-background-image" /> -->
      <!-- 模糊背景 -->
      <div class="project-header-intro-container header-blur-container"></div>
      <!-- <div class="project-header-bk header-blur-container"></div> -->

      <!-- 编辑按钮 -->
      <button class="edit-button" type="button" @click="handleEdit">
        编辑
      </button>

      <!-- 项目卡片 -->
      <el-row :gutter="10">
        <el-col :span="5" class="avatar-container">
          <!-- 头像 -->
          <img :src="projectAvatarUrl" class="project-header-avatar" />
        </el-col>
        <el-col :span="19">
          <!-- 名称 -->
          <h2 class="project-header-name header-blur-container">
            {{ projectInfo.name }}
          </h2>
          <div class="project-header-label header-blur-container">项目简介</div>
          <!-- 简介 -->
          <div class="project-header-intro header-blur-container">
            {{ projectInfo.description }}
          </div>
          <div style="display: flex">
            <div class="project-header-item header-blur-container">
              <span class="project-header-item-text"
                >项目创建于 | {{ projectInfo.created }}</span
              >
              <!-- <MiniUserCard :userInfo="creatingUser"></MiniUserCard> -->
            </div>
            <div class="project-header-item header-blur-container">
              <span class="project-header-item-text"
                >最后修改于 | {{ projectInfo.updated }}</span
              >
              <!-- <MiniUserCard :userInfo="lastModifyUser"></MiniUserCard> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 项目信息修改框 -->
    <el-dialog v-model="dialogFormVisible" title="修改项目基础字段">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input
            v-model="form.description"
            :rows="2"
            type="textarea"
            placeholder="请输入项目简介"
          />
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
          <PictureUploader :form="form"></PictureUploader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadEdit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import head from "@/assets/project/projectHeadBackground.jpg";
import avatar from "@/assets/project/projectAvatar.jpg";
import MiniUserCard from "../../components/project/MiniUserCard.vue";
import PictureUploader from "../../components/project/PictureUploader.vue";
import { getProjectInfo, updateProjectInfo } from "../../api/project";
import { useUserStore } from "../../stores/modules/user";

import defaultImgUrl from "@/assets/logo.png";

export default {
  name: "ProjectInfo",
  components: {
    MiniUserCard,
    PictureUploader,
  },
  data() {
    return {
      projectInfo: {
        name: "墨书团队",
        description: "墨书开发团队",
        url: "",
        created: "2023-8-24",
        updated: "2023-9-3",
      },
      // 修改项目
      form: {
        name: "",
        description: "",
        url: "",
      },
      creatingUser: {
        name: "testuser3",
        avatarUrl: avatar,
      },
      lastModifyUser: {
        name: "testuser2",
        avatarUrl: avatar,
      },
      projectHeadUrl: head,
      projectAvatarUrl: defaultImgUrl,
      dialogFormVisible: false,
      formLabelWidth: "140px",
    };
  },
  methods: {
    // 展开项目修改
    handleEdit() {
      this.dialogFormVisible = true;
    },
    async uploadEdit() {
      const userStore = useUserStore();
      const data = {
        projId: userStore.projectId,
        name: this.form.name,
        description: this.form.description,
      };
      try {
        const res = await updateProjectInfo(data);
        console.log("成功更新项目信息", res);
        // 再导入一次
        this.getInfo()
        
        this.$message({
          message: "成功修改项目字段",
          type: "success",
        });
        this.dialogFormVisible = false;
      } catch (e) {
        console.log(e);
        this.dialogFormVisible = false;
      }
    },
    // 读取项目信息
    async getInfo() {
      const userStore = useUserStore();
      const params = {
        projId: userStore.projectId,
      };
      try {
        const res = await getProjectInfo(params);
        console.log("成功导入项目信息", res);
        this.projectInfo = res.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
  activated() {
    this.getInfo();
  },
};
</script>

<style scoped>
.header-container {
  background-color: rgba(243, 243, 243, 0.8);
  align-items: center;
  padding: 5px 40px;
}
.project-header-container {
  position: relative;
  width: 95%;
  /* max-height: 50%; */
  min-height: 250px;
  margin: 0 auto;
}

/* 头图 */
.header-background-image {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 头像 */
.project-header-avatar {
  width: 160px;
  height: 160px;
  border-radius: 4px;
  margin: 10px;
  /* 边框 */
  /* border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2); */
  object-fit: cover;
  z-index: 5;
}

/* 模糊背景 */
.header-blur-container {
  z-index: 4;
  background-color: rgba(238, 238, 238, 0.5);
  backdrop-filter: blur(4px);
  /* -webkit-backdrop-filter: blur(2px); */
}

/* 名称 */
.project-header-name {
  text-align: start;
  border-radius: 5px;
  padding: 3px 2px;
  max-width: 50%;
  /* 字体 */
  font-size: 30px;
  font-weight: bold;
  color: rgba(5, 5, 5, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 模糊背景 */
.project-header-intro-container {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(236, 235, 235, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  z-index: 0;
  border-radius: 10px;
}
.project-header-bk {
  position: absolute;
  left: 16%;
  top: 0;
  width: 84%;
  height: 100%;
  background-color: rgba(214, 214, 214, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  z-index: 0;
}
.project-header-label {
  width: 90px;
  border-radius: 10px;
  background-color: rgba(240, 240, 240, 0.5);
  /* padding: 1%; */
  text-align: left;
  /* width: 75%; */
  /* 字体 */
  font-weight: bold;
  font-size: 20px;
  color: rgba(5, 5, 5, 0.9);
}

/* 简介 */
.project-header-intro {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  /* position: absolute; */
  max-height: 25%;
  /* left: 26%;
    top: 25%; */
  border-radius: 10px;
  background-color: rgba(255, 249, 249, 0.6);
  margin: 1%;
  padding: 1%;
  text-align: left;
  /* width: 75%; */
  /* 字体 */
  font-size: 14px;
  color: rgba(5, 5, 5, 0.9);

  overflow: hidden;
  text-overflow: ellipsis;
}

.project-header-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* position: absolute; */
  width: 40%;
  /* left: 26%;
    top: 25%; */
  border-radius: 10px;
  background-color: rgba(255, 248, 248, 0.6);
  margin: 1%;
  padding: 0 1%;
  text-align: left;
  /* width: 75%; */

  overflow: hidden;
  text-overflow: ellipsis;
}
.project-header-item-text {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 字体 */
  font-size: 14px;
  font-weight: 600;
  color: rgba(70, 70, 70, 0.9);
  margin: 0 3%;
}
.project-header-button-project {
  /* 弹性布局 设置子按钮的位置 */
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;

  /* 在父元素的位置 */
  position: absolute;
  right: 26px;
  bottom: 100px;
  border-radius: 5px;
  height: 34px;
}

.project-header-button-selected {
  width: 120px;
  /* 背景 边界 阴影 */
  background-color: rgb(254, 224, 224, 0.8);
  border: 2px solid rgba(252, 231, 231, 0.7);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 7px;
  margin: 10px;
  /* 字体 */
  font-size: 17px;
  font-weight: 700;
  color: rgba(49, 49, 49, 0.9);
  /* 手型 */
  cursor: pointer;
  transition: 0.5s ease;
}

.project-header-button-unselected {
  width: 120px;
  /* 背景 边界 阴影 */
  background-color: rgba(252, 236, 236, 0.6);
  border: 2px solid rgba(252, 231, 231, 0.7);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 7px;
  margin: 10px;
  /* 字体 */
  font-size: 17px;
  font-weight: 700;
  color: rgba(49, 49, 49, 0.9);
  /* 手型 */
  cursor: pointer;
  transition: 0.5s ease;
}

.project-header-button-unselected:hover,
.project-header-button-selected:hover {
  background-color: rgba(255, 158, 158, 0.8);
  border: 2px solid rgba(253, 160, 160, 0.8);
}

.edit-button {
  position: absolute;
  right: 10px;
  top: 10px;

  margin: 0 4px;
  width: 80px;
  height: 40px;
  outline: none;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 4px 6px;
  font-size: 16px;
  /* line-height: 1px; */
  transition: all 0.3s ease;
  background-color: rgba(171, 167, 167, 0.6);

  border: 2px solid rgba(248, 247, 237, 0.8);
  box-shadow: 0px 1px 2px 0px rgba(232, 247, 61, 0.2);

  cursor: pointer;

  z-index: 10;
}

.edit-button:hover {
  background-color: rgb(244, 187, 187);
  color: #fcfeec;
}
</style>
