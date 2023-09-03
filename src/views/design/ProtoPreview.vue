<template>
  <template v-if="loading">
    <el-skeleton :rows="15" animated />
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
        <el-carousel ref="car" :interval="4000" height="200px" :autoplay="false" @change="loadNext"
          :setActiveItem="setActiveItem">
          <el-carousel-item v-for="item in designList" :key="item.id.toString()" :name="item.id.toString()">
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

import { verifyPrototypeToken, getPrototype, getPrototypeToken, getPrototypeList, getPrototypeListWithToken } from "../../api/artifact";
import { templateList } from "../../enums/prototypeTemplateEnum";
import { ElMessage } from "element-plus";

export default {
  components: {
    Editor,
    RealTimeComponentList,
    CanvasAttr,
    DesignCardCarousel,
  },
  data() {
    return {
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

      token: '',
      projId: '',
      designList: [],

      timer: null,
    };
  },
  computed: mapState([
    "componentData",
    "curComponent",
    "isClickComponent",
    "canvasStyleData",
    "editor",
  ]),
  mounted() { },
  created() {
    // p先根据token验证身份
    if (this.verifyToken()) {
      // // 验证成功 加载全部原型设计列表
      this.loadPrototypeList()
      this.loading = false;
    }
    this.timer = setInterval(this.verifyToken, 10000);
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
      // 先验证权限
      this.verifyToken()
      if (this.designList) {
        this.restore(this.designList[tar].content)
      }
    },
    // y加载json至画布
    restore(content) {
      const val = JSON.parse(content);
      this.$store.commit("setComponentData", val.canvasData.array);
      this.$store.commit("setCanvasStyle", val.canvasStyle);
      console.log("原型设计预览：成功加载", val);
    },

    // y加载指定数组下标的原型设计
    async loadPrototype(index) {
      // 然后再加载
      if (!this.designList) {
        return
      }
      const params = {
        projId: this.projId,
        itemId: this.designList[index].id,
        version: 1,
      }
      try {
        const res = await getPrototype(params)
        console.log("原型设计预览,加载元素", index, res);
        this.designList[index].content = res.data.content
        if (index == 0) {
          this.restore(this.designList[0].content)
        }
      } catch (e) {
        console.log(e)
      }
      this.loading = false;
    },

    // y加载项目的所有原型设计 以及载入第一个元素
    async loadPrototypeList() {
      const params = {
        token: this.token
      };
      try {
        const res = await getPrototypeListWithToken(params);
        if (res.data.auth) {
          // prop为2：原型设计
          this.designList = res.data.protos.filter(function (item) {
            return item.data.prop == 2;
          });
        } else {
          this.designList = [];
        }
        // 一次性全部读入
        if (this.designList) {
          this.designList.forEach((item, index, arr) => {
            this.loadPrototype(index)
          })
        }
        console.log("原型设计预览：成功导入原型设计列表", res, this.designList, this.contentList);
      } catch (e) {
        console.log(e);
      }
    },
    // y根据token来验证权限
    async verifyToken() {
      this.token = this.$route.query.token;
      this.projId = this.$route.query.projId;
      if (!this.token) {
        ElMessage.error("链接无效");
        this.$router.push("/");
        return false
      }
      const params = {
        token: this.token
      }
      try {
        const res = await verifyPrototypeToken(params)
        console.log('原型设计预览：开始权限验证，token', this.token, 'projId', this.projId, res)
        if (res.data.auth) {
          console.log('原型设计预览：权限验证通过')
          return true
        }
        else {
          ElMessage.error("链接无效");
          this.$router.push("/");
          return false
        }
      } catch (e) {
        console.log(e)
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
<style src="../../assets/iconfont/iconfont.css"></style>
<style scoped>
li {
  list-style: none;
}
</style>

