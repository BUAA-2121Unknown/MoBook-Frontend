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
      <div class="design-title">{{ data.data.name }}</div>
      <div v-if="expanded" class="design-intro">
        创建于 | {{ data.data.created }}
      </div>
      <div v-if="expanded" class="design-intro">
        更新于 | {{ data.data.updated }}
      </div>
    </div>
    <transition name="slide-up">
      <el-row class="mb-4 doc-buttom-group" v-if="expanded">
        <DelButton :fatherHandler="fatherHandler" :design="design"></DelButton>
        <ShareButton
          :fatherHandler="shareHandler"
          :design="design"
          v-if="data.data.status == 0"
        ></ShareButton>
        <ModifyButton
          :fatherHandler="changeData"
          :design="design"
          v-if="data.data.status == 0"
        ></ModifyButton>
      </el-row>
    </transition>
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
  props: ["design", "fatherHandler", "projId"],
  components: {
    DelButton,
    ShareButton,
    ModifyButton,
    PictureUploader,
  },
  data() {
    return {
      expanded: false,
      id: '',
      data: {
        name: "",
        status: "",
        created,
        updated,
        url: "",
      },
      dialogFormVisible: false,
      dialogDelVisible: false,
      dialogDelForeverVisible: false,
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
      console.log("跳转至原型设计界面, artId:", this.design.id);
      this.$router.push({
        path: "/prototype",
        query: {
          itemId: this.design.id,
        },
      });
    },

    // 前端假修改
    changeData(name, url) {
      // console.log(name, url)
      this.data.data.name = name ? name : this.data.data.name;
      this.data.url = url ? url : this.data.url;
    },
    expandCard() {
      this.expanded = true;
    },
    shrinkCard() {
      this.expanded = false;
    },
    shareHandler() {
      this.$message({
        message: "成功分享原型设计",
        type: "success",
      });
    },
  },
  mounted() {
    console.log('尝试加载原型设计卡片', this.design)
    this.data = lodash.cloneDeep(this.design.data);
    this.data.url = designImg;
    this.form = lodash.cloneDeep(this.design);
    // console.log('成功加载原型设计卡片',this.data)
  },
};
</script>
  
<style scoped>
.design-card {
  margin: 20px 0;
  width: 380px;
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
  