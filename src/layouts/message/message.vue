<template>
  <div>
    <div class="icon-container" @click="showSettingDrawer">
      <el-icon size="18"><Message /></el-icon>
      <div class="number-container">
        {{ number }}
      </div>
    </div>
    <el-drawer
      v-model="drawer"
      :direction="direction"
      :before-close="handleClose"
      :modal="false"
      title="消息中心"
    >
      <div class="setting_body">
        <div class="setting_card">
          <div class="message-header">
            <div class="left-container">
              <el-icon size="18"><Bell /></el-icon>
              <el-select v-model="onlyUnread" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <el-dropdown class="op-header">
              <span class="el-dropdown-link">
                操作
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delReadMessage"
                    >清除已读消息</el-dropdown-item
                  >
                  <el-dropdown-item @click="readAllMessage"
                    >全部设为已读</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-divider />
          <messageItem
            v-for="message in list"
            :key="message.id"
            :info="message"
            :readHandler="readMessagel"
            :delHandler="delMessagel"
            :onlyUnread="onlyUnread"
          >
          </messageItem>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
  
<script>
import messageItem from "../../components/messageCenter/messageItem.vue";

import { editMessage, getMessage } from "../../api/message";

export default {
  name: "MessageCenter",
  components: {
    messageItem,
  },
  data() {
    return {
      unreadNumber: 0,
      //   原始信息列表
      messageList: [],

      //   选择已读未读
      onlyUnread: false,
      options: [
        {
          value: false,
          label: "全部消息",
        },
        {
          value: true,
          label: "未读消息",
        },
      ],
      userId: undefined,
      orgID: undefined,

      // wb参数
      // 连接标志位
      lockReconnect: false,

      newSocket: null,
    };
  },
  computed: {
    number() {
      return this.unreadNumber >= 100 ? "99+" : this.unreadNumber;
    },
    list() {
      return this.messageList;
    },
    wsCfg() {
      const userStore = useUserStore();
      const str = '' + userStore.userInfo.id + '/3/' 
      // websocket地址
      return {
        url: "ws://81.70.161.76:5000/ws/notif/" + str
      };
    },
  },
  methods: {
    async delMessagel(id) {
      const data = {
        status: 2,
        notifications: [id],
      };
      try {
        const res = await editMessage(data);
        console.log(res);
        this.$message.success("已删除消息");
      } catch (e) {
        console.log(e);
      }
      // this.messageList = this.messageList.filter(function (item) {
      //   return item.msgId != id;
      // });
    },
    async delReadMessage() {
      const dataList = [];
      this.messageList.forEach((item, index, arr) => {
        if(item.status == 1){
          dataList.push(item.id);
        }
      });
      const data = {
        status: 2,
        notifications: dataList,
      };
      try {
        const res = await editMessage(data);
        console.log(res, data);
        // this.messageList = this.messageList.filter(function (item) {
        //   item.msgId != id;
        // });
        this.$message.success("已删除全部已读消息");
      } catch (e) {
        console.log(e);
      }
    },
    async readMessagel(id) {
      const data = {
        status: 1,
        notifications: [id],
      };
      try {
        const res = await editMessage(data);
        console.log(res, data);
        this.$message.success("设置为已读消息");
      } catch (e) {
        console.log(e);
      }
    },
    async readAllMessage() {
      const dataList = []
      this.messageList.forEach((item, index, arr) => {
        if(item.status == 0){
          dataList.push(item.id)
        }
      });
      const data = {
        status: 1,
        notifications: dataList,
      };
      try {
        console.log(data)
        const res = await editMessage(data);
        console.log(res);
        // this.messageList = this.messageList.filter(function (item) {
        //   item.msgId != id;
        // });
        this.$message.success("已将全部消息设为已读");
      } catch (e) {
        console.log(e);
      }
    },

    // 加载全部消息列表
    async loadAllMessage() {
      const data = {
        orgId: this.orgId,
        status: 0,
      };
      try {
        const res = await getMessage(data);
        console.log(res, data);
        this.messageList = res.data.notifications;
        this.unreadNumber = res.data.unread;
        console.log("成功加载全部消息列表", this.messageList);
      } catch (e) {
        console.log(e);
      }
    },

    // websocket
    // 创建websocket
    createWebSocket() {
      try {
        // 创建Web Socket 连接
        const socket = new WebSocket(this.wsCfg.url);
        // 初始化事件
        this.initEventHandle(socket);
        console.log(socket)
      } catch (e) {
        console.log(e)
        // 出错时重新连接
        this.reconnect(this.wsCfg.url);
      }
    },
    initEventHandle(socket) {
      // 连接关闭时触发
      socket.onclose = () => {
        console.log("连接关闭");
      };
      // 通信发生错误时触发
      socket.onerror = () => {
        // 重新创建长连接
        this.reconnect();
        console.log("连接错误");
      };
      // 连接建立时触发
      socket.onopen = () => {
        console.log("连接成功");
        this.newSocket = socket
      };
      // 客户端接收服务端数据时触发
      socket.onmessage = (msg) => {
        // 业务逻辑处理
        console.log(msg.data, "收到了ws:data");
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
        this.createWebSocket(this.wsCfg.url);
      }, 2000);
    },
    //websocket接受回调函数
    receiveNewMessage(msg) {
      // this.newSocket.recv(JSON.stringify(message))
      // this.messageList.unshift(msg);
      console.log("当前消息列表新增", msg);
    },
  },
  mounted() {
    const userStore = useUserStore();
    this.userId = userStore.userInfo.id;
    this.orgId = 3;
    this.loadAllMessage();

    this.createWebSocket();
  },
};
</script>
  
  <script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const drawer = ref(false);
const direction = ref("rtl");

const handleClose = () => {
  drawer.value = false;
};
const showSettingDrawer = () => {
  drawer.value = true;
};
</script>
  
  <style lang="scss" scoped>
.left-container {
  display: flex;
  align-items: center;
}
.op-header {
  margin: 0 20px 5px 0;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-container {
  cursor: pointer;
  position: relative;
  width: 30px;
}
.number-container {
  position: absolute;
  top: -4px;
  right: 0;
  background-color: #ff0000;
  border-radius: 8px;
  min-width: 22px;
  color: #ffffff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drawer-container {
  transition: all 0.2s;
  &:hover {
    right: 0;
  }
  position: fixed;
  right: -20px;
  bottom: 15%;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  color: #fff;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 10%);
}
.setting_body {
  padding: 0 5px;
  .setting_card {
    margin-bottom: 20px;
  }
  .setting_content {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    > .theme-box {
      display: flex;
    }
    > .color-box {
      div {
        display: flex;
        flex-direction: column;
      }
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-right: 20px;
      .item-top {
        position: relative;
      }
      .check {
        position: absolute;
        font-size: 20px;
        color: #00afff;
        right: 10px;
        bottom: 10px;
      }
      p {
        text-align: center;
        font-size: 12px;
      }
    }
  }
}
</style>
  