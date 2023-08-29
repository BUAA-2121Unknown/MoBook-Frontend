<!-- 项目原型设计的卡片组件 -->
<template>
  <div class="design-card" @mouseenter="expandCard" @mouseleave="shrinkCard">
    <div
      class="design-image-container"
      :style="{ backgroundImage: `url(${data.url})`, height: imageHeight }"
      @click="jumpForDesign"
    ></div>
    <div
      class="design-text-container"
      :style="{ height: textHeight }"
      @click="jumpForDesign"
    >
      <div class="design-title">{{ data.name }}</div>
      <div v-if="expanded" class="design-intro">创建于 | {{  data.created }}</div>
      <div v-if="expanded" class="design-intro">更新于 | {{  data.updated }}</div>
    </div>
    <transition name="slide-up">
      <el-row class="mb-4 doc-buttom-group" v-if="expanded">
        <DelButton :handler="delHandler" v-if="design.status == 0"></DelButton>
        <DelButton
          :handler="delForeverHandler"
          v-if="design.status != 0"
        ></DelButton>
        <ShareButton
          :handler="shareHandler"
          v-if="design.status == 0"
        ></ShareButton>
        <ModifyButton
          :handler="modifyHandler"
          v-if="design.status == 0"
        ></ModifyButton>
      </el-row>
    </transition>

    <!-- 项目信息修改 -->
    <el-dialog v-model="dialogFormVisible" title="项目字段修改">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input
            v-model="form.description"
            :rows="2"
            type="textarea"
            placeholder="请输入简介"
          />
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
          <PictureUploader :form="form"></PictureUploader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadModify"> 确认修改 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除原型设计 -->
    <el-dialog v-model="dialogDelVisible" title="提示" width="30%">
      <span>确认删除原型设计？该原型设计将被放入回收站。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDelVisible = false">取消</el-button>
          <el-button type="danger" @click="delDesign"> 删除 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 从回收站删除原型设计 -->
    <el-dialog v-model="dialogDelForeverVisible" title="提示" width="30%">
      <span>确认彻底删除原型设计？彻底删除后将无法恢复！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDelForeverVisible = false">取消</el-button>
          <el-button type="danger" @click="delForeverDesign"> 删除 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import designImg from "@/assets/project/projectDesignImg.png";
import DelButton from "./button/DelButton.vue";
import ShareButton from "./button/ShareButton.vue";
import ModifyButton from "./button/ModifyButton.vue";
import PictureUploader from "./PictureUploader.vue";
import lodash from "lodash";

import { updatePrototypeStatus, updatePrototypeInfo } from "../../api/artifact";

export default {
  name: "DesignCard",
  props: ["design", "fatherDelHandler", "projId"],
  components: {
    DelButton,
    ShareButton,
    ModifyButton,
    PictureUploader,
  },
  data() {
    return {
      expanded: false,
      data: {
        id: "",
        name: "",
        intro: "",
        url: "",
      },
      form: {
        id: "",
        name: "",
        intro: "",
        url: "",
      },
      dialogFormVisible: false,
      dialogDelVisible: false,
      dialogDelForeverVisible: false,
      formLabelWidth: "140px",
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
    jumpForDesign() {
      console.log('跳转至原型设计界面, artId:', this.design.id)
      this.$router.push({
        path: "/prototype",
        query: this.design.id,
      });
    },
    expandCard() {
      this.expanded = true;
    },
    shrinkCard() {
      this.expanded = false;
    },

    // 将原型设计放入回收站
    delHandler() {
      this.dialogDelVisible = true;
    },
    async delDesign() {
      const data = { status: 1, artifacts: this.design.artId };
      try {
        const res = await updatePrototypeStatus(data);

        console.log(res);
        this.$message({
          message: "已将原型设计放入回收站",
          type: "success",
        });
        this.dialogDelVisible = false;
      } catch (e) {
        this.dialogDelVisible = false;
        console.log(e);
      }
      this.fatherDelHandler(this.design.id);
    },

    // 将原型设计从回收站删除
    delForeverHandler() {
      this.dialogDelForeverVisible = true;
    },
    async delForeverDesign() {
      const data = { status: 2, artifacts: this.design.artId };
      try {
        const res = await updatePrototypeStatus(data);

        console.log(res);
        this.$message({
          message: "原型设计已彻底删除",
          type: "success",
        });
        this.dialogDelForeverVisible = false;
        this.fatherDelHandler(design.id);
      } catch (e) {
        this.dialogDelForeverVisible = false;
        console.log(e);
      }
    },

    shareHandler() {
      this.$message({
        message: "成功分享原型设计",
        type: "success",
      });
    },
    modifyHandler() {
      this.dialogFormVisible = true;
    },

    // 更新原型设计信息
    uploadModify() {
      this.dialogFormVisible = false;
      this.$message({
        message: "成功修改原型设计信息",
        type: "success",
      });
      // console.log(this.form.url)
      this.data = lodash.cloneDeep(this.form);
    },
    // activated() {
    //   this.data = lodash.cloneDeep(this.design);
    //   this.data.url = this.data.url ? this.data.url : designImg
    //   this.form = lodash.cloneDeep(this.design);
    // },
  },
  mounted() {
      console.log('开始加载原型设计卡片',this.design)
      this.data = lodash.cloneDeep(this.design);
      this.data.url = designImg
      this.form = lodash.cloneDeep(this.design);
      console.log('成功加载原型设计卡片',this.data)
    },
};
</script>
  
<style scoped>
.design-card {
  margin: 20px 0;
  width: 350px;
  height: 280px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  box-shadow: 0px 2px 4px 0px rgba(52, 51, 51, 0.2);
  position: relative;

  cursor: pointer;
}

.design-image-container {
  width: 100%;
  background-size: cover;
  background-position: center;
  transition: height 0.3s ease;
  cursor: pointer;
}

.design-text-container {
  background-color: rgba(237, 244, 249, 0.7);
  backdrop-filter: blur(6px);

  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
  transition: height 0.5s ease, background-color 0.3s ease;
  cursor: pointer;
}

.design-title {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  color: rgba(5, 5, 5, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
}

.design-intro {
  margin: 10px;
  font-size: 13px;
  color: rgba(69, 69, 69, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: flex-start;
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
</style>
  