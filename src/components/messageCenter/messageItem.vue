<template>
  <div class="message-container" v-if="!onlyUnread || !info.status">
    <!-- 删除与已读 -->
    <div class="button-group">
      <el-icon size="14" class="message-button" @click="readMessage" v-if="!info.status">
        <Finished />
      </el-icon>
      <el-icon size="14" class="message-button" @click="delMessage">
        <Close />
      </el-icon>
    </div>
    <div class="type-container">
      {{ messageType }}
    </div>
    <div class="content-container" @click="jumpForMessage">
      <el-row :gutter="20">
        <el-col :span="4" class="avatar-container">
          <img class="pos-img message-img" :src="posUrl" />
          <img class="user-img message-img" :src="userUrl" />
        </el-col>
        <el-col :span="20">
          <div class="notread-icon" v-if="!info.status">未读</div>
          <div class="message-sender" :class="readClass">
            {{ messageSender }}
          </div>
          <div class="message-text" :class="readClass">
            {{ messageText }}
          </div>
          <div class="message-discription" :class="readClass">
            {{ messageDiscription }}
          </div>
        </el-col>
      </el-row>
      <div class="message-time">
        {{ info.timestamp }}
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script>
import defaultImgUrl from "@/assets/logo.png";
import settings from "@/settings/basic"

export default {
  name: "messageItem",
  props: ["info", "readHandler", "delHandler", "onlyUnread"],
  data() {
    return {
      type: 1,
      payload: {},
    };
  },
  computed: {
    messageType() {
      let str = "";
      switch (this.type) {
        case 2:
          str = "@消息";
          break;
        case 6:
          str = "项目新建";
          break;
        default:
          str = "系统通知";
          break;
      }
      return str;
    },
    messageSender() {
      let str = "";
      switch (this.type) {
        case 2:
          str = this.payload.user.username + " | " + this.payload.user.email;
          break;
        case 6:
          str = this.payload.user.username + " | " + this.payload.user.email;
          break;
        case 7:
          str = this.payload.user.username + " | " + this.payload.user.email;
          break;
        default:
          str = "系统默认通知";
          break;
      }
      return str;
    },
    messageText() {
      let str = "";
      switch (this.type) {
        case 2:
          str = "在群聊 " + this.payload.chat.name + " 中@了您";
          break;
        case 6:
          str = "新建了项目 " + this.payload.project.name;
          break;
        case 7:
          str = "在项目文档 " + this.payload.artifact.name + " 中@了您 ";
          break;
        default:
          str = "系统默认通知";
          break;
      }
      return str;
    },
    messageDiscription() {
      let str = "";
      switch (this.type) {
        case 2:
          str = this.payload.chat.description
            ? this.payload.chat.description
            : "点击前往群聊";
          break;
        case 6:
          str = this.payload.project.description
            ? this.payload.project.description
            : "点击前往项目";
          break;
        case 7:
          str = "点击前往项目文档";
          break;
        default:
          str = "";
          break;
      }
      return str;
    },
    readClass() {
      return this.info.status ? "read-class" : "";
    },
    userUrl() {
      let url = "";
      switch (this.type) {
        case 2:
          url = this.payload.user.avatarUrl;
          break;
        case 6:
          url = this.payload.user.avatarUrl;
          break;
        default:
          url = "";
          break;
      }
      return this.transAvaterUrl(url);
    },
    posUrl() {
      let url = "";
      switch (this.type) {
        case 2:
          url = this.payload.chat.avatar;
          break;
        default:
          url = "";
          break;
      }
      return this.transAvaterUrl(url);
    },
  },
  methods: {
    transAvaterUrl(url) {
      return url ? url : defaultImgUrl;
    },
    // 跳转到消息
    jumpForMessage() {
      this.readMessage()
      console.log("从消息中心跳转：");
      // let str = settings.appURL;
      switch (this.type) {
        // 群聊
        case 2:
          this.$router.push({
            path: "/chat",
            query: {
              roomId: this.info.payload.chat.id,
              id: this.info.id
            }
          })
          break;
        case 7:
          this.$router.push({
            path: "/chat",
            query: {
              roomId: this.info.payload.chat.id,
              id: this.info.id
            }
          })
          break;
        default:
          break;
      }
      // if (str != settings.appURL) {
      //   this.$router.push({
      //     path: "/chat",
      //     query: {
      //       roomId: this.info.chat.id,
      //       id: this.info.id
      //     }
      //   })
      // }
    },
    readMessage() {
      console.log("read", this.info.id);
      this.readHandler(this.info.id);
    },
    delMessage() {
      console.log("del", this.info.id);
      this.delHandler(this.info.id);
    },
  },
  mounted() {
    this.payload = this.info.payload;
    this.type = this.info.type ? this.info.type : -1;
  },
};
</script>

<style scoped>
.type-container {
  font-size: 12px;
  font-weight: 300;
  color: rgb(158, 158, 158);
  margin: 0 2px 10px -2px;
  display: flex;
  align-items: center;
}

.message-sender {
  font-size: 16px;
  font-weight: 600;
  color: rgb(28, 28, 28);
  margin: -2px 2px 5px 2px;

  display: flex;
  align-items: center;
}

.message-text {
  font-size: 14px;
  font-weight: 500;
  color: rgb(53, 53, 53);
  margin: 5px 2px;
  line-height: 16px;
}

.message-discription {
  margin: 13px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(65, 65, 65, 0.8);
  margin: 3px 2px;
  line-height: 14px;
}

.message-time {
  font-size: 12px;
  font-weight: 300;
  color: rgb(164, 164, 164);
  margin-top: 10px;
}

.message-container {
  padding: 0 5px 5px 5px;
  margin: 0 5px;
  position: relative;
}

.button-group {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
}

.message-button {
  margin: 5px;
  cursor: pointer;
}

.message-button :hover {
  color: rgb(0, 179, 255);
}

.content-container {
  cursor: pointer;
}

.read-class {
  font-weight: 300;
  color: rgb(164, 164, 164);
}

.notread-icon {
  margin: -28px 20px 5px 5px;
  background-color: rgba(77, 163, 255, 0.5);
  height: 20px;
  width: 40px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: black;
}

.avatar-container {
  position: relative;
}

.message-img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 2px solid rgba(50, 50, 50, 0.2);
  box-shadow: 0px 2px 4px 0px rgba(52, 51, 51, 0.2);
}

.user-img {
  position: absolute;
  left: 0;
}

.pos-img {
  position: absolute;
  left: 15px;
}
</style>