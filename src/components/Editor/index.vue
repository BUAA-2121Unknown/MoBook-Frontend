<template>
  <div id="editor" class="editor" ref="canvas" :class="{ edit: isEdit }" :style="{
    ...getCanvasStyle(canvasStyleData),
    width: changeStyleWithScale(canvasStyleData.width) + 'px',
    height: changeStyleWithScale(canvasStyleData.height) + 'px',
  }" @contextmenu="handleContextMenu" @mousedown="handleMouseDown" v-on:mousemove="handleMouseMove">
    <!-- 网格线 -->
    <template v-if="!isPrevieww">
      <Grid />
    </template>

    <!-- 光标层 -->
    <template v-if="!isPrevieww">
      <Cursor v-for="item in list" :user="item" :key="item.id" :id="userInfo.id">
      </Cursor>
    </template>


    <!--页面组件列表展示-->
    <template v-if="!isPrevieww">
      <Shape v-for="(item, index) in componentData" :key="item.id" :default-style="item.style"
        :style="getShapeStyle(item.style)" :active="item.id === (curComponent || {}).id" :element="item" :index="index"
        :class="{ lock: item.isLock || (item.userId && item.userId != userInfo.id) }">
        <component :is="item.component" v-if="item.component.startsWith('SVG')" :id="'component' + item.id"
          :style="getSVGStyle(item.style)" class="component" :prop-value="item.propValue" :element="item"
          :request="item.request" />

        <component :is="item.component" v-else-if="item.component != 'VText'" :id="'component' + item.id"
          class="component" :style="getComponentStyle(item.style)" :prop-value="item.propValue" :element="item"
          :request="item.request" />

        <component :is="item.component" v-else :id="'component' + item.id" class="component"
          :style="getComponentStyle(item.style)" :prop-value="item.propValue" :element="item" :request="item.request"
          @input="handleInput" />
      </Shape>
    </template>
    <template v-else>
      <Shape v-for="(item, index) in componentData" :key="item.id" :default-style="item.style"
        :style="getShapeStyle(item.style)" :active="false" :element="item" :index="index"
        :class="{ lock: item.isLock || (item.userId && item.userId != userInfo.id) }">
        <component :is="item.component" v-if="item.component.startsWith('SVG')" :id="'component' + item.id"
          :style="getSVGStyle(item.style)" class="component" :prop-value="item.propValue" :element="item"
          :request="item.request" />

        <component :is="item.component" v-else-if="item.component != 'VText'" :id="'component' + item.id"
          class="component" :style="getComponentStyle(item.style)" :prop-value="item.propValue" :element="item"
          :request="item.request" />

        <component :is="item.component" v-else :id="'component' + item.id" class="component"
          :style="getComponentStyle(item.style)" :prop-value="item.propValue" :element="item" :request="item.request"
          @input="handleInput" />
      </Shape>
    </template>

    <template v-if="!isPrevieww">
      <!-- 右击菜单 -->
      <ContextMenu />
      <!-- 标线 -->
      <MarkLine />
      <!-- 选中区域 -->
      <Area v-show="isShowArea" :start="start" :width="width" :height="height" />
    </template>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from "../../utils/design/gogocodeTransfer";
import { mapState } from "vuex";
import Shape from "./Shape.vue";
import {
  getStyle,
  getComponentRotatedStyle,
  getShapeStyle,
  getSVGStyle,
  getCanvasStyle,
} from "../../utils/design/style";
import { $, isPreventDrop } from "../../utils/design/utils";
import ContextMenu from "./ContextMenu.vue";
import MarkLine from "./MarkLine.vue";
import Area from "./Area.vue";
import eventBus from "../../utils/design/eventBus";
import Grid from "./Grid.vue";
import { changeStyleWithScale } from "../../utils/design/translate";
import Cursor from "./Cursor.vue";
import { useUserStore } from "../../stores/modules/user";

export default {
  components: { Shape, ContextMenu, MarkLine, Area, Grid, Cursor },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
    isPrevieww: {
      type: Boolean,
      default: false,
    },
    // doc,
  },
  data() {
    return {
      editorX: 0,
      editorY: 0,
      start: {
        // 选中区域的起点
        x: 0,
        y: 0,
      },
      width: 0,
      height: 0,
      isShowArea: false,
      svgFilterAttrs: ["width", "height", "top", "left", "rotate"],

      // 光标信息数组
      list: [],
      url: '',
      userInfo: {},
      // wb参数
      // 连接标志位
      lockReconnect: false,
      newSocket: null,
      curX: 0,
      curY: 0,
    };
  },
  computed: {
    ...mapState([
      "componentData",
      "curComponent",
      "canvasStyleData",
      "editor",
      "canvasDOM",
    ]),
  },
  activated() {

  },
  mounted() {
    // 获取编辑器元素
    this.$store.commit("getEditor");
    $on(eventBus, "hideArea", () => {
      this.hideArea();
    });
    // this.$store.commit("setCanvasDOM", this.$refs.canvas);
    const userStore = useUserStore()
    // 获取当前用户信息
    this.userInfo = {
      id: userStore.userInfo.id,
      name: userStore.userInfo.username,
    }
    if (!this.isPrevieww) {
      this.createWebSocket()
    }
  },

  // 将当前用户从实时协作光标中注销
  beforeDestroy() {
    this.newSocket.send(JSON.stringify({
      tp: 3,  //1加入 2移动 3离开
      id: this.userInfo.id,
      name: this.userInfo.name,
      x: 0,
      y: 0,
    }));
  },

  methods: {
    getShapeStyle,
    getCanvasStyle,
    changeStyleWithScale,

    // 初始化光标协同
    // 创建websocket
    createWebSocket() {
      if (this.newSocket) {
        return
      }
      const roomId = this.$route.query.artId ? this.$route.query.artId : 1;
      this.url = "ws://82.156.25.78:5000/ws/mouse/" + roomId + "/"
      try {
        // 创建Web Socket 连接
        const socket = new WebSocket(this.url);
        // 初始化事件
        this.initEventHandle(socket);
      } catch (e) {
        console.log(e);
        // 出错时重新连接
        this.reconnect(this.url);
      }
    },
    initEventHandle(socket) {
      // 连接关闭时触发
      socket.onclose = () => {
        console.log("光标协作：连接关闭");
      };
      // 通信发生错误时触发
      socket.onerror = () => {
        // 重新创建长连接
        this.reconnect();
        console.log("光标协作：连接错误");
      };
      // 连接建立时触发 立即向外进行一次广播注册
      socket.onopen = () => {
        this.newSocket = socket;
        // 立即进行注册
        this.newSocket.send(JSON.stringify({
          tp: 1,  //1加入 2移动 3离开
          id: this.userInfo.id,
          name: this.userInfo.name,
          x: 0,
          y: 0,
        }));
        console.log("光标协作：连接成功", socket, this.list);
      };
      // 客户端接收服务端数据时触发
      socket.onmessage = (msg) => {
        // 业务逻辑处理
        this.receiveNewMessage(msg);
      };
    },
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;

      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(() => {
        this.lockReconnect = false;
        this.createWebSocket(this.url);
      }, 2000);
    },

    //websocket接受回调函数
    receiveNewMessage(msg) {
      // console.log('光标协同，收到参数：', msg)
      const op = JSON.parse(msg.data);
      // 加入
      if (op.tp == 1) {
        // 如果是加入请求 那么将其加入渲染列表.
        this.list.push(op)
        // 如果这是他人的加入请求，那么再向外广播一次自己的坐标
        if (op.id != this.userInfo.id) {
          this.newSocket.send(JSON.stringify({
            tp: 2,  //1加入 2移动 3离开
            id: this.userInfo.id,
            name: this.userInfo.name,
            x: this.curX,
            y: this.curY,
          }));
        }
        console.log(this.userInfo.name, "接收到op1:加入", op)
      }
      // 移动
      else if (op.tp == 2) {
        let flag = 0
        this.list.forEach((item, index, arr) => {
          if (item.id == op.id) {
            item.x = op.x
            item.y = op.y
            flag = 1
          }
        })
        // 如果这个人尚未被纳入渲染列表，即自己是新的加入者，那么更新这个人
        if (flag == 0) {
          this.list.push(op)
        }
        // console.log(this.userInfo.name, "接收到op2:移动", op)
      }
      //删除 直接将其从渲染列表里清除
      else {
        this.list = this.list.filter((item) => {
          return item.id != op.id
        })
        console.log(this.userInfo.name, "接收到op3:销毁", op)
      }
    },
    // 处理鼠标移动事件
    handleMouseMove(e) {
      if (!this.newSocket) {
        return
      }
      const rectInfo = this.editor.getBoundingClientRect();
      const x = e.clientX - rectInfo.x
      const y = e.clientY - rectInfo.y
      if (Math.abs(x - this.curX) >= 2 || Math.abs(y - this.curY) >= 2) {
        // 上传更改
        this.newSocket.send(JSON.stringify({
          tp: 2,  //1加入 2移动 3离开
          id: this.userInfo.id,
          name: this.userInfo.name,
          x: x,
          y: y,
        }));
        this.curX = x
        this.curY = y
        // console.log('上传鼠标移动事件', list)
      }
    },

    handleMouseDown(e) {
      console.log('点击画布')
      // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
      if (!this.curComponent || isPreventDrop(this.curComponent.component)) {
        e.preventDefault();
      }

      this.hideArea();

      // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
      const rectInfo = this.editor.getBoundingClientRect();
      this.editorX = rectInfo.x;
      this.editorY = rectInfo.y;

      const startX = e.clientX;
      const startY = e.clientY;
      this.start.x = startX - this.editorX;
      this.start.y = startY - this.editorY;
      // 展示选中区域
      this.isShowArea = true;

      const move = (moveEvent) => {
        this.width = Math.abs(moveEvent.clientX - startX);
        this.height = Math.abs(moveEvent.clientY - startY);
        if (moveEvent.clientX < startX) {
          this.start.x = moveEvent.clientX - this.editorX;
        }

        if (moveEvent.clientY < startY) {
          this.start.y = moveEvent.clientY - this.editorY;
        }
      };

      const up = (e) => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);

        if (e.clientX == startX && e.clientY == startY) {
          this.hideArea();
          return;
        }

        this.createGroup();
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },

    hideArea() {
      this.isShowArea = 0;
      this.width = 0;
      this.height = 0;

      this.$store.commit("setAreaData", {
        style: {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        },
        components: [],
      });
    },

    createGroup() {
      // 获取选中区域的组件数据
      const areaData = this.getSelectArea();
      if (areaData.length <= 1) {
        this.hideArea();
        return;
      }

      // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
      // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
      let top = Infinity,
        left = Infinity;
      let right = -Infinity,
        bottom = -Infinity;
      areaData.forEach((component) => {
        let style = {};
        if (component.component == "Group") {
          component.propValue.forEach((item) => {
            const rectInfo = $(`#component${item.id}`).getBoundingClientRect();
            style.left = rectInfo.left - this.editorX;
            style.top = rectInfo.top - this.editorY;
            style.right = rectInfo.right - this.editorX;
            style.bottom = rectInfo.bottom - this.editorY;

            if (style.left < left) left = style.left;
            if (style.top < top) top = style.top;
            if (style.right > right) right = style.right;
            if (style.bottom > bottom) bottom = style.bottom;
          });
        } else {
          style = getComponentRotatedStyle(component.style);
        }

        if (style.left < left) left = style.left;
        if (style.top < top) top = style.top;
        if (style.right > right) right = style.right;
        if (style.bottom > bottom) bottom = style.bottom;
      });

      this.start.x = left;
      this.start.y = top;
      this.width = right - left;
      this.height = bottom - top;

      // 设置选中区域位移大小信息和区域内的组件数据
      this.$store.commit("setAreaData", {
        style: {
          left,
          top,
          width: this.width,
          height: this.height,
        },
        components: areaData,
      });
    },

    getSelectArea() {
      const result = [];
      // 区域起点坐标
      const { x, y } = this.start;
      // 计算所有的组件数据，判断是否在选中区域内
      this.componentData.forEach((component) => {
        if (component.isLock ||  (component.userId && component.userId != this.userInfo.id)) return;

        const { left, top, width, height } = getComponentRotatedStyle(
          component.style
        );
        if (
          x <= left &&
          y <= top &&
          left + width <= x + this.width &&
          top + height <= y + this.height
        ) {
          result.push(component);
        }
      });

      // 返回在选中区域内的所有组件
      return result;
    },

    handleContextMenu(e) {
      e.stopPropagation();
      e.preventDefault();

      // 计算菜单相对于编辑器的位移
      let target = e.target;
      let top = e.offsetY;
      let left = e.offsetX;
      while (target instanceof SVGElement) {
        target = target.parentNode;
      }

      while (!target.className.includes("editor")) {
        left += target.offsetLeft;
        top += target.offsetTop;
        target = target.parentNode;
      }

      this.$store.commit("showContextMenu", { top, left });
    },

    getComponentStyle(style) {
      // console.log(getStyle(style, this.svgFilterAttrs), )
      return getStyle(style, this.svgFilterAttrs);
    },

    getSVGStyle(style) {
      return getSVGStyle(style, this.svgFilterAttrs);
    },

    handleInput(element, value) {
      // 根据文本组件高度调整 shape 高度
      this.$store.commit("setShapeStyle", {
        height: this.getTextareaHeight(element, value),
      });
    },

    getTextareaHeight(element, text) {
      let { lineHeight, fontSize, height } = element.style;
      if (lineHeight === "") {
        lineHeight = 1.5;
      }

      const newHeight = (text.split("<br>").length - 1) * lineHeight * fontSize;
      return height > newHeight ? height : newHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
