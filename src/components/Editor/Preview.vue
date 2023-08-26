<template>
  <div ref="container" class="bg">
    <div class="canvas-container">
      <div
        class="canvas"
        id="previewCanvas"
        :style="{
          ...getCanvasStyle(canvasStyleData),
          width: changeStyleWithScale(canvasStyleData.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.height) + 'px',
        }"
      >
        <ComponentWrapper
          v-for="(item, index) in copyData"
          :key="index"
          :config="item"
        />
      </div>
    </div>
    <div>
      <template v-if="isScreenshot">
        <el-button @click="htmlToPngImage" class="btn">导出为PNG</el-button>
        <br/>
        <el-button @click="htmlToJpegImage" class="btn">导出为JPEG</el-button>
        <br/>
      </template>
      <el-button @click="close" class="btn">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from "../../utils/design/gogocodeTransfer";
import { getStyle, getCanvasStyle } from "@/utils/design/style";
import { mapState } from "vuex";
import ComponentWrapper from "./ComponentWrapper.vue";
import { changeStyleWithScale } from "../../utils/design/translate";
import { toJpeg, toPng } from "html-to-image";
import { deepCopy } from "../../utils/design/utils";

export default {
  components: { ComponentWrapper },
  props: {
    isScreenshot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copyData: [],
    };
  },
  computed: mapState(["componentData", "canvasStyleData"]),
  created() {
    this["copyData"] = deepCopy(this.componentData);
  },
  methods: {
    getStyle,
    getCanvasStyle,
    changeStyleWithScale,

    close() {
      $emit(this, "close");
    },

    htmlToPngImage() {
      toPng(document.getElementById("previewCanvas"))
        .then((dataUrl) => {
          const a = document.createElement("a");
          a.setAttribute("download", "screenshot");
          a.href = dataUrl;
          a.click();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        })
        .finally(this.close);
    },
    htmlToJpegImage() {
      toJpeg(document.getElementById("previewCanvas"))
        .then((dataUrl) => {
          const a = document.createElement("a");
          a.setAttribute("download", "screenshot");
          a.href = dataUrl;
          a.click();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        })
        .finally(this.close);
    },
  },
  emits: ["close"],
};
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;
  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    overflow: auto;

    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
    }
  }
.btn {
  padding: 12px;
  margin: 10px;
  color: #063273;
  border: 2px solid #cfe1f7;
  background: #cfe1f7;
  text-align: center;
  height: 35px;
  line-height: normal;
  border-radius: 6px;
  font-size: 13px;
  transition: 0.3s linear;
  font-weight: 550;
}
.btn:hover {
  background: #063273;
  color: #f2f2f2;
}
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
