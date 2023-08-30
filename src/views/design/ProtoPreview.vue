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
          <!-- <Preview :is-screenshot="false" @close="handlePreviewChange" /> -->
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Editor from "../../components/Editor/index.vue";
import Preview from "../../components/Editor/Preview.vue";
import { mapState } from "vuex";
import RealTimeComponentList from "../../components/Editor/RealTimeComponentList.vue";
import CanvasAttr from "../../components/Editor/CanvasAttr.vue";
import { Project } from "../../api/project";
import { File } from "../../api/file";

export default {
  components: {
    Editor,
    RealTimeComponentList,
    CanvasAttr,
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
    this.code = this.$route.params.code;
    let data = new FormData();
    data.append("previewCode", this.code);
    File.previewByCode(data).then((res) => {
      console.log(res);
      if (res.data.status == 200) {
        const data = new FormData();
        data.append("protoId", res.data.prototypeId);
        Project.getProto(data)
          .then((res) => {
            this.$store.commit(
              "setComponentData",
              JSON.parse(res.data.canvasData).array
            );
            this.$store.commit(
              "setCanvasStyle",
              JSON.parse(res.data.canvasStyle)
            );
          })
          .catch((err) => {
            console.log(err);
          });
        this.loading = false;
      } else if (res.data.status == 431) {
        ElMessage.error("链接已失效！");
        this.$router.push("/");
      } else {
        ElMessage.error("预览失败！");
      }
    });
    this.restore();
  },
  methods: {
    // 读取数据 初始化画布
    async restore() {
      // 是已保存的项目
      const params = {
        artId: Number(this.$route.query.artId),
      };
      try {
        const res = await getPrototype(params);
        const val = JSON.parse(res.data.content);
        console.log("原型设计：尝试获取已保存的画板信息", res, val);
        this.$store.commit("setComponentData", val.canvasData.array);
        this.$store.commit("setCanvasStyle", val.canvasStyle);
        // this.isPreviewing = false;
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    // restore() {
    //   const data = new FormData();
    //   data.append("protoId", this.prototypeId);
    //   Project.getProto(data)
    //     .then((res) => {
    //       this.$store.commit(
    //         "setComponentData",
    //         JSON.parse(res.data.canvasData).array
    //       );
    //       this.$store.commit(
    //         "setCanvasStyle",
    //         JSON.parse(res.data.canvasStyle)
    //       );
    //       this.loading = false;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.loading = false;
    //     });
    // },
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
  background: #fff;
  main {
    height: calc(100% - 20px);
    position: relative;
    .center {
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;
      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
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
