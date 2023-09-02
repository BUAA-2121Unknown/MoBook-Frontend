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
        <TemplateList :itemId="itemId"></TemplateList>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="组件库" name="1">
            <ComponentList />
          </el-collapse-item>
          <el-collapse-item title="元素列表" name="2">
            <RealTimeComponentList />
          </el-collapse-item>
        </el-collapse>
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div class="content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent" ref="editor">
          <Editor :doc="doc" />
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

  <Tour
    :steps="tourSteps"
    mask
    arrow
    v-model:show="showTour"
    v-model:current="tourCurrent"
    :padding="{ x: 10, y: 6 }"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Tour } from "vue3-quick-tour"
import { updateGuide } from '@/api/user'
const showTour = ref(false)
const tourCurrent = ref(0)

// 新手指引变量设置
const tourSteps = [
  {
    el: () => document.getElementById("tour-prototype-step-0"),
    title: "菜单栏",
    message: "这里是原型设计的菜单栏，你可以在这里执行撤销与重做、导出文件为图片、代码等。",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "top",
  },
  {
    el: () => document.getElementById("tour-prototype-step-1"),
    title: "模板库",
    message: "这里是模板库，你可以在此导入丰富的预制模板，并且可以创建、导入自定义模板",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right",
  },
  {
    el: () => document.getElementById("tour-prototype-step-2"),
    title: "绘画工具栏",
    message: "这里是绘画工具栏，你可以在这里拖拽元素到画布上来进行原型设计。",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right",
  },
  {
    el: () => document.getElementById("tour-prototype-step-3"),
    title: "图层栏",
    message: "这里是图层栏，你可以在此查看当前画布中的元素，调节图层顺序，以及删除元素。",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right",
  },
]

// 开始指引
onMounted(async () => {
  // 开启新手指引 TODO：判断权限位
  const res = await updateGuide({ type: 0 })
  console.log(res)
  if (res.meta.status == 0) {
    // 开启新手指引 TODO：判断权限位
    showTour.value = !res.data.value
    tourCurrent.value = 0
  }
})
</script>

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
import TemplateList from "../../components/Editor/TemplateList.vue";
import { Project } from "../../api/project";
import { useRoute } from "vue-router";
import { ElNotification } from "element-plus";
// 实时协作
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { $on } from "../../utils/design/gogocodeTransfer";
import eventBus from "@/utils/design/eventBus";

import { getPrototype } from "../../api/artifact";
import { useUserStore } from "../../stores/modules/user";

export default {
  components: {
    Editor,
    ComponentList,
    AnimationList,
    EventList,
    Toolbar,
    RealTimeComponentList,
    CanvasAttr,
    TemplateList,
  },
  data() {
    return {
      activeName: "attr",
      reSelectAnimateIndex: undefined,
      provider: null,
      doc: undefined,
      dataArray: null,
      isPreview: false,
      isPreviewing: false,
      loading: false,

      activeNames: ['1', '2'],
      projId: 0,
      itemId: 0,

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
    // console.log("原型设计接收到路由传递的参数", this.$route.query.artId);
    const userStore = useUserStore()
    // 提交当前用户id，组件锁定要用
    this.$store.commit("setUserId", userStore.userInfo.id)

    // 开始指引
    // console.log('start')
    // this.showTour = true
    // this.tourCurrent = 0
    // console.log('here')
  },
  activated() {
    const userStore = useUserStore()
    this.projId = userStore.projectId
    this.itemId = this.$route.query.itemId
    this.restore();
    this.initCollaboration();
  },
  created() {
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
    // 初始化在线协作
    initCollaboration() {
      // if(this.$route.query.artId){
      //   return
      // }
      this.doc = new Y.Doc();
      const roomId = this.itemId ? this.itemId : 0;
      const name = `ws/prototype/${roomId}/`;
      this.provider = new WebsocketProvider(
        // 后端端口
        "ws://81.70.161.76/",
        // 后端房间号
        name,
        // 对应doc文档
        this.doc
      );
      // 设置共享数组
      this.dataArray = this.doc.getArray("dataArray");
      // 共享数组保存至vuex
      this.$store.commit(
        "initDataArray",
        this.dataArray,
      )
      // 监听数据变化 发送给画布
      this.dataArray.observe((event) => {
        if (this.dataArray.toArray().length > 0) {
          this.$store.commit(
            "setComponentData",
            JSON.parse(this.dataArray.get(0))
          );
          this.$store.commit(
            "setCanvasStyle",
            JSON.parse(this.dataArray.get(1))
          );
          console.log('原型设计协作：远程更新', this.dataArray.toArray())
        }
      });
      console.log('原型设计协作：创建成功', this.dataArray)
      this.provider.on("status", (event) => {
        console.log("原型设计协作：websocket状态  ", event.status); // 'connected' or 'disconnected'
      });
    },

    // y读取指定id的原型设计 初始化画布
    async restore() {
      if (!this.itemId) {
        this.$alert(
          "您正在使用临时设计工具，因此不支持保存至任何项目。若要保存，请先在对应项目下创建一个原型设计。",
          "请注意！",
          {
            confirmButtonText: "确定",
          }
        );
        // console.log("未给出artId，无法加载");
        return;
      }
      // 是已保存的项目
      const params = {
        "projId": Number(this.projId),
        "itemId": Number(this.itemId),
        "version": 1,
      };
      try {
        const res = await getPrototype(params);
        const val = JSON.parse(res.data.content);
        console.log("原型设计：尝试获取已保存的画板信息", res, val);
        this.$store.commit("setComponentData", val.canvasData.array);
        this.$store.commit("setCanvasStyle", val.canvasStyle);
        this.isPreviewing = false;
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
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


        // if (!this.isClickComponent) {
        //   this.$store.commit("setCurComponent", { component: null, index: null });
        // }
        // 再存档
        this.$store.commit("recordSnapshot");
        // this.setDocArray();
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


    // cola 鼠标抬起 如果是左键 并且
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
      width: 190px;
      left: 10px;
      top: 0;
      // background-color: #333;
      overflow: auto;

      &>div {
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
