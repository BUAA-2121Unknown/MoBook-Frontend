<template>
  <div ref="container" class="bg">
    <div class="canvas-container">
      <div class="canvas" id="previewCanvas" :style="{
        ...getCanvasStyle(canvasStyleData),
        width: changeStyleWithScale(canvasStyleData.width) + 'px',
        height: changeStyleWithScale(canvasStyleData.height) + 'px',
      }">
        <ComponentWrapper v-for="(item, index) in copyData" :key="index" :config="item" />
      </div>
    </div>
    <div class="btn-container">
      <template v-if="isScreenshot">
        <el-button @click="DOM2Png" class="btn">导出为PNG</el-button>
        <br />
        <el-button @click="DOM2Jpeg" class="btn">导出为JPEG</el-button>
        <br />
        <el-button @click="DOM2Html" class="btn">导出为HTML</el-button>
        <br />
        <el-button @click="DOM2Json" class="btn">导出为JSON</el-button>
        <br />
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
import { ElNotification } from "element-plus";

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

    DOM2Png() {
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
    DOM2Jpeg() {
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

    // 将DOM节点转换为html文件导出
    // 导出html+ inline-css代码
    DOM2Html() {
      // console.log(window.getComputedStyle(this.$refs.container))
      // // 实现复制
      // const str = this.$refs.container.innerHTML
      // navigator.clipboard.writeText(str).then(() => {
      //   ElMessage.success("复制成功");
      // });
      const str1 = `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css" />
  <title>MoBook | Prototype Design</title>
  </head>
  <body>`
      const str2 = `</body></html>`
      const dom = document.getElementById("previewCanvas").outerHTML
      console.log(dom)
      // this.getBoundContent()
      const stringData = str1 + dom + str2
      // dada 表示要转换的字符串数据，type 表示要转换的数据格式
      const blob = new Blob([stringData], {
        type: "text/plain;charset=utf-8"
      })
      // 根据 blob生成 url链接
      const objectURL = URL.createObjectURL(blob)
      // 创建一个 a 标签Tag
      const aTag = document.createElement('a')
      // 设置文件的下载地址
      aTag.href = objectURL
      // 设置保存后的文件名称
      aTag.download = "prototype_design.html"
      // 给 a 标签添加点击事件
      aTag.click()
      // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
      // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
      URL.revokeObjectURL(objectURL)
      ElNotification({
        title: "导出成功",
        type: "success",
      });
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
  background: rgba(71, 71, 71, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas-container {
    width: calc(100% - 40px);
    // height: calc(100% - 120px);
    overflow: auto;

    .canvas {
      background: #fff;
      position: relative;
      margin: 0 auto;
    }
  }

  // .btn {
  //   padding: 12px;
  //   margin: 10px;
  //   color: #f2f7ff;
  //   border: 2px solid #8d8d8d;
  //   background: #464646;
  //   text-align: center;
  //   height: 35px;
  //   line-height: normal;
  //   border-radius: 6px;
  //   font-size: 13px;
  //   transition: 0.3s linear;
  //   font-weight: 550;
  // }

  // .btn:hover {
  //   background: #063273;
  //   color: #f2f2f2;
  // }
  .btn {
    cursor: pointer;

    margin: 5px 10px;
    --color: #a0a0a0;
    font-family: inherit;
    display: inline-block;
    // width: 120px;
    height: 35px;
    line-height: 17.5px;
    overflow: hidden;
    font-size: 14px;
    z-index: 1;
    color: var(--color);
    border: 2px solid var(--color);
    border-radius: 6px;
    position: relative;
  }

  .btn::before {
    position: absolute;
    content: "";
    background: var(--color);
    width: 280px;
    height: 220px;
    z-index: -1;
    border-radius: 50%;
  }

  .btn:hover {
    color: white;
  }

  .btn:before {
    top: 100%;
    left: 100%;
    transition: 0.3s all;
  }

  .btn:hover::before {
    top: -30px;
    left: -30px;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .btn-container {
    position: absolute;
    bottom: 0;
    // left: 86%;
    width: 100%;
    height: 15%;
    background: linear-gradient(to top,
        rgba(27, 27, 27, 0.2),
        rgba(71, 71, 71, 0.1));
    z-index: -2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
