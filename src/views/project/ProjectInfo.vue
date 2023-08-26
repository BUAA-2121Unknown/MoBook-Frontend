<!-- 项目概况 -->
<template>
  <div class="container">
    <h1>项目概览</h1>
    <!--  -->
    <!-- 简介头栏 -->
    <div class="project-header-container">
      <!-- 背景头图 -->
      <img :src="projectInfo.projectHeadUrl" class="header-background-image" />
      <!-- 模糊背景 -->
      <div class="project-header-intro-container header-blur-container"></div>
      <!-- 编辑按钮 -->
      <button class="edit-button" type="button" @click="handleEdit">
        编辑
      </button>

      <el-row :gutter="10">
        <el-col :span="5">
          <!-- 头像 -->
          <img :src="projectInfo.projectAvatarUrl" class="project-header-avatar" />
        </el-col>
        <el-col :span="19">
          <!-- 名称 -->
          <h2 class="project-header-name header-blur-container">
            {{ projectInfo.projectName }}
          </h2>
          <div class="project-header-label header-blur-container">项目简介</div>
          <!-- 简介 -->
          <div class="project-header-intro header-blur-container">
            {{ projectInfo.projectIntro }}
          </div>
          <div style="display: flex;">
            <div class="project-header-item header-blur-container">
              项目创建于 | {{ projectInfo.createDate }}
            </div>
            <div class="project-header-item header-blur-container">
              最后修改于 | {{ projectInfo.modifyDate }}
            </div>
          </div>
        </el-col>
      </el-row>


      <!-- 小组右侧关注按钮和申请管理员按钮
            <div class="project-header-button-project">
                <button :class="joinButtonClass" @click="joinproject" v-if="isLogin">{{ projectInfo.userInproject ? '退出小组' :
                    '加入小组'
                }}</button>
                <button :class="applyButtonClass" @click="applyForAdmin" v-if="isLogin && projectInfo.userInproject"><i
                        class="fa-solid fa-user-project" v-if="projectInfo.userIsAdmin"></i>{{ projectInfo.userIsAdmin ? '管理员' :
                            '申请管理员'
                        }}</button>
            </div> -->
    </div>
    <!-- 小组 -->
  </div>
</template>

<script>
import head from '@/assets/project/projectHeadBackground.jpg'
import avatar from '@/assets/project/projectAvatar.jpg'

export default {
  name: "ProjectInfo",
  data() {
    return {
      projectInfo: {
        projectHeadUrl: head,
        projectAvatarUrl: avatar,
        projectName: '吃饭',
        projectIntro: '睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉',
        createDate: '2023-8-24',
        modifyDate: '2023-8-25',
      }
    }
  },
  methods: {
    handleEdit() {
      // console.log('成功修改资料')
      this.$message({
        message: '成功修改项目字段',
        type: 'success'
      });
    }
  },
};
</script>

<style scoped>
.project-header-container {
  position: relative;
  width: 80%;
  /* max-height: 50%; */
  min-height: 300px;
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

/* 头像 */
.project-header-avatar {
  width: 160px;
  height: 160px;
  border-radius: 4px;
  margin: 10px;
  /* 边框 */
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  object-fit: cover;
  z-index: 5;
}

/* 模糊背景 */
.header-blur-container {
  z-index: 4;
  background-color: rgba(252, 248, 248, 0.6);
  backdrop-filter: blur(4px);
  /* -webkit-backdrop-filter: blur(2px); */
}

/* 名称 */
.project-header-name {
  text-align: center;
  border-radius: 5px;
  padding: 3px 20px;
  max-width: 20%;
  /* 字体 */
  font-size: 28px;
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
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
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
  align-items: flex-start;
  justify-content: flex-start;
  /* position: absolute; */
  width: 25%;
  /* left: 26%;
    top: 25%; */
  border-radius: 10px;
  background-color: rgba(255, 248, 248, 0.6);
  margin: 1%;
  padding: 1%;
  text-align: left;
  /* width: 75%; */
  /* 字体 */
  font-size: 12px;
  color: rgba(5, 5, 5, 0.9);

  overflow: hidden;
  text-overflow: ellipsis;
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
  transition: .5s ease;
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
  transition: .5s ease;
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
  transition: all .3s ease;
  background-color: rgba(191, 191, 191, 0.6);

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
