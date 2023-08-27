<template>
  <template v-if="loading">
    <Loading />
  </template>
  <div v-else class="home">
    <Toolbar :isPreview="isPreview" :isPreviewing="isPreviewing" />
    <!-- {{ componentData }} -->
    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList />
        <RealTimeComponentList />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-if="curComponent" v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <!-- {{ curComponent }}
            <hr />
            {{ curComponent.component }} -->
            <component :is="curComponent.component + 'Attr'" />
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation" style="padding-top: 20px">
            <AnimationList />
          </el-tab-pane>
          <el-tab-pane label="事件" name="events" style="padding-top: 20px">
            <EventList />
          </el-tab-pane>
        </el-tabs>
        <CanvasAttr v-else></CanvasAttr>
      </section>
    </main>
  </div>
</template>

<script>
import Editor from "../../components/Editor/index.vue";
import ComponentList from "../../components/Editor/ComponentList.vue"; // 左侧列表组件
import AnimationList from "../../components/Editor/AnimationList.vue"; // 右侧动画列表
import EventList from "../../components/Editor/EventList.vue"; // 右侧事件列表
import { useList } from "../../custom-component/component-list"; // 左侧列表数据
import Toolbar from "../../components/Editor/Toolbar.vue";
import { deepCopy } from "../../utils/design/utils";
import { mapState } from "vuex";
import generateID from "../../utils/design/generateID";
import { listenGlobalKeyDown } from "../../utils/design/shortcutKey";
import RealTimeComponentList from "../../components/Editor/RealTimeComponentList.vue";
import CanvasAttr from "../../components/Editor/CanvasAttr.vue";
import { Project } from "../../api/project";
import { useRoute } from "vue-router";
// 实时协作
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
import { $on } from "../../utils/design/gogocodeTransfer";
import eventBus from "@/utils/design/eventBus";

export default {
  components: {
    Editor,
    ComponentList,
    AnimationList,
    EventList,
    Toolbar,
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
      isPreview: false,
      isPreviewing: false,
      loading: false,
    };
  },
  computed: mapState([
    "componentData",
    "curComponent",
    "isClickComponent",
    "canvasStyleData",
    "editor",
  ]),
  mounted() {
    console.log(this.$route.query.prototype_id);
  },
  created() {
    // this.restore();
    // this.initCollaboration();
    // 全局监听按键事件
    listenGlobalKeyDown();
    $on(eventBus, "updateCanvas", (newComponentData) => {
      console.log("updateCanvas", newComponentData);
      this.dataArray.delete(0, this.dataArray.length);
      this.dataArray.insert(0, [
        JSON.stringify(newComponentData),
        JSON.stringify(this.canvasStyleData),
      ]);
    });
  },
  methods: {
    // TODO 1.初始化在线协作
    initCollaboration() {
      this.doc = new Y.Doc();
      this.provider = new WebsocketProvider(
        // 后端端口
        "ws://101.42.173.97:1235",
        // 后端房间号
        `newproto${this.$route.params.id}`,
        // 对应doc文档
        this.doc
      );
      // 设置共享数组
      this.dataArray = this.doc.getArray("dataArray");
      // 监听数据变化
      this.dataArray.observe((event) => {
        // TODO 3.将变化数据发送给画布
        // e.g. this.XXX = this.dataArray.toArray();
        if (this.dataArray.toArray().length > 0) {
          console.log("OBSERVE");
          this.$store.commit(
            "setComponentData",
            JSON.parse(this.dataArray.get(0))
          );
          this.$store.commit(
            "setCanvasStyle",
            JSON.parse(this.dataArray.get(1))
          );
        }
      });
      this.provider.on("status", (event) => {
        console.log("event.status: ", event.status); // 'connected' or 'disconnected'
      });
    },
    // TODO 2.dataArray获取画布数据
    setDocArray() {
      // e.g. this.dataArray = XXX;
      if (!this.dataArray) {
        return;
      }
      this.dataArray.delete(0, this.dataArray.length);
      this.dataArray.insert(0, [
        JSON.stringify(this.componentData),
        JSON.stringify(this.canvasStyleData),
      ]);
    },
    restore() {
      const route = useRoute();
      const data = new FormData();
      data.append("protoId", route.params.id);
      console.log(route.params, route.query);
      Project.getProto(data)
        .then((res) => {
          console.log("res", res);
          this.$store.commit(
            "setComponentData",
            JSON.parse(res.data.canvasData).array
          );
          this.$store.commit(
            "setCanvasStyle",
            JSON.parse(res.data.canvasStyle)
          );
          this.isPreviewing = res.data.isPreviewing;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      const index = e.dataTransfer.getData("index");
      const rectInfo = this.editor.getBoundingClientRect();
      if (index) {
        const componentList = useList();
        console.log("componentList", componentList, index);
        const component = deepCopy(componentList[index]);
        component.style.top = e.clientY - rectInfo.y;
        component.style.left = e.clientX - rectInfo.x;
        component.id = generateID();
        this.$store.commit("addComponent", { component });
        this.$store.commit("recordSnapshot");
        this.setDocArray();
      }
    },

    handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },

    handleMouseDown(e) {
      e.stopPropagation();
      this.$store.commit("setClickComponentStatus", false);
      this.$store.commit("setInEditorStatus", true);
    },

    deselectCurComponent(e) {
      if (!this.isClickComponent) {
        this.$store.commit("setCurComponent", { component: null, index: null });
      }

      // 0 左击 1 滚轮 2 右击
      if (e.button != 2) {
        this.$store.commit("hideContextMenu");
      }
    },
  },
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  background: #fff;
  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;
      // background-color: #333;

      & > div {
        overflow: auto;

        &:first-child {
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 0;

      .el-select {
        width: 100%;
      }
    }

    .center {
      margin-left: 200px;
      margin-right: 288px;
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

<style src="../../styles/design/reset.css"></style>
<style src="../../styles/design/global.scss" lang="scss"></style>
<style src="../../styles/design/animate.scss"></style>
<style scoped>
li {
  list-style: none;
}
</style>
<style src="../../assets/iconfont/iconfont.css"></style>
