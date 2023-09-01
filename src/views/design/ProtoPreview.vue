<template>
  <template v-if="loading">
    <Loading />
  </template>
  <div v-else class="home">
    <main>
      <!-- 中间画布 -->
      <section class="center">
        <div class="content">
          <Editor :isPrevieww="true" />
        </div>
      </section>
      <div class="bottom">
        <el-carousel
          ref="car"
          :interval="4000"
          height="200px"
          :autoplay="false"
          @change="loadNext"
          :setActiveItem="setActiveItem"
        >
          <el-carousel-item
            v-for="item in designList"
            :key="item.id.toString()"
            :name="item.id.toString()"
          >
            <DesignCardCarousel :design="item"></DesignCardCarousel>
            <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
          </el-carousel-item>
        </el-carousel>
      </div>
    </main>
  </div>
  <!-- <Preview :is-screenshot="false" @close="handlePreviewChange" /> -->
</template>

<script>
import Editor from "../../components/Editor/index.vue";
import Preview from "../../components/Editor/Preview.vue";
import { mapState } from "vuex";
import RealTimeComponentList from "../../components/Editor/RealTimeComponentList.vue";
import CanvasAttr from "../../components/Editor/CanvasAttr.vue";
import { Project } from "../../api/project";
import { File } from "../../api/file";
import DesignCardCarousel from "../../components/project/DesignCardCarousel.vue";

import { getPrototype } from "../../api/artifact";
import { templateList } from "../../enums/prototypeTemplateEnum";

export default {
  components: {
    Editor,
    RealTimeComponentList,
    CanvasAttr,
    DesignCardCarousel,
  },
  data() {
    return {
      designList: [],

      activeName: "attr",
      reSelectAnimateIndex: undefined,
      provider: null,
      doc: null,
      dataArray: null,
      prototypeId: 0,
      code: "",
      isPreview: true,
      isPreviewing: false,
      loading: true,
    };
  },
  computed: mapState([
    "componentData",
    "curComponent",
    "isClickComponent",
    "canvasStyleData",
    "editor",
  ]),
  mounted() {},
  created() {
    // this.code = this.$route.params.code;
    // let data = new FormData();
    // data.append("previewCode", this.code);
    // File.previewByCode(data).then((res) => {
    //   console.log(res);
    //   if (res.data.status == 200) {
    //     const data = new FormData();
    //     data.append("protoId", res.data.prototypeId);
    //     Project.getProto(data)
    //       .then((res) => {
    //         this.$store.commit(
    //           "setComponentData",
    //           JSON.parse(res.data.canvasData).array
    //         );
    //         this.$store.commit(
    //           "setCanvasStyle",
    //           JSON.parse(res.data.canvasStyle)
    //         );
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //     this.loading = false;
    //   } else if (res.data.status == 431) {
    //     ElMessage.error("链接已失效！");
    //     this.$router.push("/");
    //   } else {
    //     ElMessage.error("预览失败！");
    //   }
    // });
    this.restore();
  },
  methods: {
    // 将n个元素移到末尾
    // moveElementsToEnd(arr, n) {
    //   if (n <= 0 || n >= arr.length) {
    //     return arr; // No change needed
    //   }
    //   const movedElements = arr.splice(0, n);
    //   arr.push(...movedElements);
    //   return arr;
    // },
    loadNext(tar, cur) {
      console.log("原型设计预览：切换浏览对象", tar, cur);
      this.loadPrototype(this.designList[tar].content)
    },
    loadPrototype(content) {
      const val = JSON.parse(content);
      console.log("原型设计预览：尝试加载原型设计");
      this.$store.commit("setComponentData", val.canvasData.array);
      this.$store.commit("setCanvasStyle", val.canvasStyle);
    },
    // 读取数据 初始化画布
    async restore() {
      const code = Number(this.$route.query.code);
      const params = {
        code: code,
      };
      console.log("尝试加载预览，code:", code);
      try {
        this.designList = templateList;
        // const res = await getPrototype(params);
        // const val = JSON.parse(res.data.content);
        // console.log("原型设计：尝试获取已保存的画板信息", res, val);
        // this.$store.commit("setComponentData", val.canvasData.array);
        // this.$store.commit("setCanvasStyle", val.canvasStyle);
        // this.$store.commit("setEditMode", "preview");
        // this.isPreviewing = false;

        this.loadPrototype(this.designList[0].content)
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    // 获取当前的原型列表
    async getList() {
      const params = {
        projId: this.projId,
      };
      try {
        const res = await getPrototypeList(params);
        if (res.data && res.data.artifacts) {
          this.designList = res.data.artifacts.filter(function (item) {
            return item.isLive === false && item.type == "p";
          });
        } else {
          this.designList = [];
        }
        console.log("成功导入原型设计列表", res, this.designList);
      } catch (e) {
        console.log(e);
      }
    },
    handlePreviewChange() {
      this.isShowPreview = false;
      this.$store.commit("setEditMode", "edit");
    },
  },
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  background: #f5f5f5;
  main {
    height: calc(100% - 20px);
    position: relative;
    .center {
      background: #f5f5f5;
      height: 80%;
      overflow: auto;
      padding: 20px;
      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
    .bottom {
      background: #f5f5f5;
      width: 60%;
      height: 16%;
      overflow: auto;
      margin: 0 auto;
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }

  .global-attr {
    padding: 10px;
  }
}

.el-carousel__item h3 {
  color: #c1c3c6;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #d9dbde;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #e1e4e7;
}
</style>

<!-- <style src="../../styles/reset.css"></style> -->
<style src="../../styles/design/global.scss" lang="scss"></style>
<style src="../../styles/design/animate.scss"></style>
<style scoped>
li {
  list-style: none;
}
</style>
<style src="../../assets/iconfont/iconfont.css"></style>
