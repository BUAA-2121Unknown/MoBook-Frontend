<!-- 项目文档的卡片组件 -->
<template>
  <div class="doc-card" @mouseenter="expandCard" @mouseleave="shrinkCard">
    <div class="doc-image-container" :style="{ backgroundImage: `url(${doc.img})`, height: imageHeight }"></div>
    <div class="doc-text-container" :style="{ height: textHeight }">
      <div class="doc-title">{{ doc.name }}</div>
      <div v-if="expanded" class="doc-intro">{{ doc.intro }}</div>
    </div>
    <transition name="slide-up">
      <el-row class="mb-4 doc-buttom-group" v-if="expanded">
        <DelButton></DelButton>
        <ShareButton></ShareButton>
      </el-row>
    </transition>
  </div>
</template>

<script>
import DelButton from './DelButton.vue';
import ShareButton from './ShareButton.vue';

export default {
  name: "DocCard",
  props: ["doc"],
  components: {
    DelButton,
    ShareButton,
  },
  data() {
    return {
      expanded: false,
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
  },
};
</script>

<style scoped>
.doc-card {
  margin: 20px 0;
  width: 250px;
  height: 370px;
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
</style>
