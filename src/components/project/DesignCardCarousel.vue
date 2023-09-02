<!-- 项目原型设计的卡片组件 -->
<template>
  <div class="design-card" @mouseenter="expandCard" @mouseleave="shrinkCard">
    <div class="design-image-container" @click="jumpForDesign">
      <img :src="data.url" />
    </div>
    <div class="project-header-intro-container"></div>
    <div class="title-container" :style="{ height: textHeight }">
      <div class="cr-title" :style="{ 'font-size': fontSize }">
        {{ data.name }}
      </div>
    </div>
  </div>

  <!-- <div
      class="design-text-container"
      :style="{ height: textHeight }"
      @click="jumpForDesign"
    >
      <div class="design-title">{{ data.name }}</div>
      <div v-if="expanded" class="design-intro">
        创建于 | {{ data.created }}
      </div>
      <div v-if="expanded" class="design-intro">
        更新于 | {{ data.updated }}
      </div>
    </div> -->
</template>
  
  <script>
import designImg from "@/assets/project/projectDesignImg.png";
import lodash from "lodash";

export default {
  name: "DesignCardCarousel",
  props: ["design", "projId", "fatherHandler"],
  components: {},
  data() {
    return {
      expanded: false,
      data: {
        id: "",
        name: "",
        intro: "",
        url: "",
      },
    };
  },
  computed: {
    fontSize() {
      return this.expanded ? "24px" : "20px";
    },
    textHeight() {
      return this.expanded ? "60%" : "50%";
    },
  },
  methods: {
    jumpForDesign() {
      console.log("跳转至原型设计界面, artId:", this.design.id);
      //   this.$router.push({
      //     path: "/prototype",
      //     query: {
      //       artId: this.design.id,
      //     },
      //   });
    },
    expandCard() {
      this.expanded = true;
    },
    shrinkCard() {
      this.expanded = false;
    },
  },
  mounted() {
    this.data = lodash.cloneDeep(this.design);
    this.data.url = designImg;
    // console.log('成功加载原型设计卡片',this.data)
  },
};
</script>
    
  <style scoped>
.design-card {
  height: 100%;
  margin: 0 auto;
  /* width: 380px;
    height: 280px; */
  overflow: hidden;
  /* border: 2px solid rgba(255, 255, 255, 0.8); */
  border-radius: 6px;
  /* box-shadow: 0px 2px 4px 0px rgba(52, 51, 51, 0.2); */
  position: relative;

  cursor: pointer;
}

.design-image-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;

  width: 100%;
  transition: height 0.7s ease;
  cursor: pointer;
}

.title-container {
  transition: height 0.3s ease;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(
    to top,
    rgba(97, 97, 97, 0.5),
    rgba(233, 233, 233, 0.2)
  );

  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  padding: 0 20px;
  /* padding: 10px; */
  /* background-color: rgba(61, 3, 3, 0.3); */
  z-index: 10;
}
.cr-title {
  margin: 10px;
  font-size: 20px;
  font-weight: 700;
  color: rgba(58, 58, 58, 0.9);
  transition: 0.7s ease;
}
/* 模糊背景 */
.project-header-intro-container {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  background-color: rgba(233, 233, 233, 0.3);
  backdrop-filter: blur(1px);
  border: 2px solid rgba(218, 218, 218, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  z-index: 0;
  border-radius: 10px;
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
    