<template>
  <div class="component-list" @dragstart="handleDragStart" id="tour-prototype-step-2">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      class="list"
      draggable="true"
      @click="showMsg(item)"
      :data-index="index"
    >
      <span
        class="iconfont"
        :class="'icon-' + item.icon"
        v-if="!isNewComponent(item.component)"
      ></span>
      <span class="newcp-font" v-if="showNewComponent(item.component, 'SVGHexagon')"><img :src="hexagonIcon" class="svg-icon"></span>
      <span class="newcp-font" v-if="showNewComponent(item.component, 'Rate')"><el-icon><StarFilled /></el-icon></span>
      <span class="newcp-font" v-if="showNewComponent(item.component, 'Slider')"><el-icon><Operation /></el-icon></span>
      <span class="newcp-font" v-if="showNewComponent(item.component, 'Switch')"><el-icon><Open /></el-icon></span>
      <span class="newcp-font" v-if="showNewComponent(item.component, 'Select')"><el-icon><ArrowDownBold /></el-icon></span>
    </div>
  </div>
</template>

<script setup>
import { useList } from "@/custom-component/component-list";
import { ref } from "vue";
import hexagonIcon from "@/assets/project/hexagon.png"

const componentList = ref(useList());
function handleDragStart(e) {
  console.log("TUO", e);
  e.dataTransfer.setData("index", e.target.dataset.index);
}
function showMsg(item) {
  console.log(item);
}
function isNewComponent(name) {
  const list = ["SVGHexagon", "Rate", "Slider", "Switch", "Select"];
  return list.includes(name);
}
function showNewComponent(name1, name2) {
  return name1 == name2
}
</script>

<style lang="scss" scoped>
.component-list {
  // height: 60%;
  padding: 5px;
  display: grid;
  grid-gap: 10px 19px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 40px);
  .list {
    width: 70px;
    height: 40px;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    color: #333;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      cursor: grabbing;
    }

    .iconfont {
      margin-right: 4px;
      font-size: 20px;
    }
    .newcp-font {
      margin-right: 4px;
      font-size: 20px;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0);
    }
    .icon-wenben,
    .icon-biaoge {
      font-size: 18px;
    }

    .icon-tupian {
      font-size: 16px;
    }

    .icon-xuanze {
      font-size: 30px;
    }
  }
}
.svg-icon{
  height: 24px;
  width: 27px;
  z-index: 0;
}
</style>
