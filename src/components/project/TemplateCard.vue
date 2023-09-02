<!-- 项目原型设计的卡片组件 -->
<template>
  <div class="design-card" @mouseenter="expandCard" @mouseleave="shrinkCard">
    <div
      class="design-image-container"
      :style="{ backgroundImage: `url(${data.url})`, height: imageHeight }"
      @click="designHandler"
    ></div>
    <div
      class="design-text-container"
      :style="{ height: textHeight }"
      @click="designHandler"
    >
      <div class="design-title">{{ data.name }}</div>
      <div v-if="expanded" class="design-intro">
        创建于 | {{ data.created }}
      </div>
      <div v-if="expanded" class="design-intro">
        更新于 | {{ data.updated }}
      </div>
    </div>
    <transition name="slide-up">
      <el-row class="mb-4 doc-buttom-group" v-if="expanded && !isDefault">
        <DelButton :fatherHandler="fatherHandler" :design="design"></DelButton>
        <ModifyButton
          :fatherHandler="changeData"
          :design="design"
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
import lodash from "lodash";

import { getPrototype } from "../../api/artifact";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "TemplateCard",
  props: ["design", "projId", "loadHandler", "isDefault", "fatherHandler"],
  components: {
    DelButton,
    ShareButton,
    ModifyButton,
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
      dialogFormVisible: false,
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
    // 加载指定的原型设计到画板 实现函数
    async loadDesign(id) {
      const params = {
        artId: id,
      };
      try {
        let val = {
          canvasData: [],
          canvasStyle: {},
        }
        if (this.design.id >= 0) {
          const res = await getPrototype(params);
          val = JSON.parse(res.data.content);
          console.log("原型设计：尝试读取自定义模板", res, val, this.design.id);
        }
        else{
          val = JSON.parse(this.design.content);
          console.log("原型设计：读取默认模板", val, this.design.id);
        }

        // cola 加载模板
        this.$store.commit("setComponentData", val.canvasData.array);
        this.$store.commit("setCanvasStyle", val.canvasStyle);
        this.loadHandler();
      } catch (e) {
        console.log(e);
      }
    },
    // 加载原型设计 包装函数
    designHandler() {
      ElMessageBox.confirm(
        "加载模板会覆盖您当前的原型设计！是否继续加载？",
        "加载原型设计模板",
        {
          confirmButtonText: "加载",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          // 调用加载函数
          this.loadDesign(Number(this.design.id));
          ElMessage({
            type: "success",
            message: "原型设计已加载",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消加载",
          });
        });
    },

    // 前端假修改
    changeData(name, url) {
      // console.log(name, url)
      this.data.name = name ? name : this.data.name;
      this.data.url = url ? url : this.data.url;
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
    // console.log("成功加载原型设计模板", this.data);
  },
};
</script>
    
  <style scoped>
.design-card {
  margin: 20px 0;
  width: 300px;
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
    