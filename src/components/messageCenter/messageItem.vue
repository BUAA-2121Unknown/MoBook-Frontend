<template>
  <div class="message-container">
    <!-- 删除与已读 -->
    <div class="button-group">
      <el-icon
        size="14"
        class="message-button"
        @click="readMessage"
        v-if="!info.read"
        ><Finished
      /></el-icon>
      <el-icon size="14" class="message-button" @click="delMessage"
        ><Close
      /></el-icon>
    </div>
    <div class="type-container">
      {{ messageType }}
      <div class="notread-icon" v-if="!info.read">未读</div>
    </div>
    <div class="content-container" @click="jumpForMessage">
      <el-row :gutter="20">
        <el-col :span="4">
          <img class="message-img" :src="avaterUrl" />
        </el-col>
        <el-col :span="20">
          <div class="message-sender" :class="readClass">
            {{ info.sender }}
          </div>
          <div class="message-text" :class="readClass">
            {{ messageText }}
          </div>
        </el-col>
      </el-row>
      <div class="message-time">
        {{ info.time }}
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script>
import defaultImgUrl from "@/assets/logo.png";

export default {
  name: "messageItem",
  props: ["info"],
  computed: {
    messageType() {
      return this.info.type === 1 ? "@我的" : "系统通知";
    },
    messageText() {
      return this.info.text;
    },
    avaterUrl() {
      return this.info.avatarUrl ? this.info.avatarUrl : defaultImgUrl;
    },
    readClass() {
      return this.info.read ? "read-class" : "";
    },
  },
  methods: {
    jumpForMessage() {
      console.log("跳转");
    },
    readMessage() {
        this.$message.success('消息设为已读')
      console.log("消息已读", this.info.id);
    },
    delMessage() {
        this.$message.success('成功删除消息')
      console.log("消息删除", this.info.id);
    },
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
.message-time {
  font-size: 12px;
  font-weight: 300;
  color: rgb(164, 164, 164);
  margin-top: 10px;
}
.message-img {
  height: 40px;
  width: 40px;
  border-radius: 20px;
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
  margin: 0 30px;
  background-color: rgba(135, 135, 135, 0.5);
  height: 20px;
  width: 40px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: black;
}
</style>