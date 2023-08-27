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
              <el-select v-model="value" class="m-2" placeholder="Select">
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
          >
          </messageItem>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
  
<script>
import messageItem from "../../components/messageCenter/messageItem.vue";

export default {
  name: "MessageCenter",
  components: {
    messageItem,
  },
  data() {
    return {
      unreadNumber: 10,
      //   原始信息列表
      messageList: [
        {
          id: 1,
          read: true,
          type: 1,
          sender: "二道湾",
          text: "行提供 gutter 属性来指定列之间的间距，其默认值为0。",
          time: "2023-8-27 14:21",
        },
        {
          id: 2,
          read: false,
          type: 0,
          sender: "发你我",
          text: "通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。",
          time: "2023-8-27 14:21",
        },
      ],
      //   选择已读未读
      value: "all",
      options: [
        {
          value: "all",
          label: "全部消息",
        },
        {
          value: "unread",
          label: "未读消息",
        },
      ],
    };
  },
  computed: {
    number() {
      return this.unreadNumber >= 100 ? "99+" : this.unreadNumber;
    },
    list() {
      return this.messageList;
    },
  },
  methods: {
    delReadMessage() {
        this.$message.success('已删除全部已读消息')
    },
    readAllMessage() {
        this.$message.success('已将全部消息设为已读')
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
  
  <script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
const drawer = ref(false);
const direction = ref("rtl");

const userStore = useUserStore();

const handleClose = () => {
  drawer.value = false;
};
const showSettingDrawer = () => {
  drawer.value = true;
};
const changeMode = (e) => {
  if (e === null) {
    userStore.changeSideMode("dark");
    return;
  }
  userStore.changeSideMode(e);
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
  