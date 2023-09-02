<template>
  <!-- Form -->
  <el-button @click="dialogFormVisible = true" :color="buttonColor" class="design-button" :disabled="tmp">
    管理预览链接
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="管理预览链接" append-to-body>
    <div class="main-container">
      <div class="title">
        {{ title }}
      </div>
      <el-switch v-model="activited" class="ml-2 switch"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;" @change="changeLinkStatus" />
      <el-button @click="copyLink" color="#303133" class="design-button" v-if="activited">
        复制链接
      </el-button>
      <div class="expires" v-if="activited">
        有效期至 {{ expires }}
      </div>
    </div>
  </el-dialog>
</template>
    
<script>
import { ElMessage } from "element-plus";
import PictureUploader from "../PictureUploader.vue";
import { useRouter } from "vue-router";
import { createPrototype, savePrototype } from "@/api/artifact";
import { useUserStore } from "@/stores/modules/user";
import { emptyTemplateContent } from "@/enums/prototypeTemplateEnum.js";
import { getPrototypeToken, createPrototypeToken, revokePrototypeToken } from "../../../api/artifact";

export default {
  name: "PreviewCreateButton",
  props: ["handler", "placedAtBar"],
  components: {
    PictureUploader,
  },
  data() {
    return {
      link: '',
      activited: false,
      dialogFormVisible: false,
      expires: '',
      token: '',
    };
  },
  setup() {
    const router = useRouter();
  },
  computed: {
    title() {
      return this.activited ? "预览链接已开启" : "预览链接已关闭";
    },
    buttonColor() {
      return this.placedAtBar ? '' : '#303133'
    },
    // 是否处于调试试用界面
    tmp() {
      return false
    },
    // 拼接字符串
    url(){
      const userStore = useUserStore()
      return "http://" + window.location.host + "/prototype-preview?token=" + this.token + '&projId=' + userStore.projectId;
    },
  },
  methods: {
    // 复制共享链接
    copyLink() {
      navigator.clipboard.writeText(this.link).then(() => {
        ElMessage.success("链接已复制到剪切板");
      });
    },
    // 改变共享链接的状态
    async changeLinkStatus() {
      const userStore = useUserStore()
      // 变为激活
      if (this.activited) {
        const data = {
          itemId: 0,
          projId: userStore.projectId,
          expires: 7,
          auth: 1,
          orgOnly: false,
        }
        try {
          const res = await createPrototypeToken(data)
          console.log('成功创建项目Token', res)
          this.token = res.data.token
          this.activited = res.data.active
          this.expires = res.data.expires
          this.link = this.url
          ElMessage.success("共享链接已开启，有效期至" + this.expires);
        } catch (e) {
          console.log(e)
        }
      }
      // 变为失效
      else {
        const data = {
          token: this.token,
        }
        try {
          const res = await revokePrototypeToken(data)
          console.log('成功取消项目Token', res)
          this.token = res.data.token
          this.activited = res.data.active
          this.expires = res.data.expires
          this.link = this.url
          ElMessage.success("共享链接已关闭");
        } catch (e) {
          console.log(e)
        }
      }
    },
    // 获取当前项目的分享链接状态
    async getTokenStatus() {
      const userStore = useUserStore()
      const params = {
        itemId: 0,
        projId: userStore.projectId,
      }
      try {
        const res = await getPrototypeToken(params)
        console.log('成功加载项目分享地址', res, params)
        if (res.data.token) {
          this.token = res.data.token.token
          this.activited = res.data.token.active
          this.expires = res.data.token.expires
          this.link = this.url
        }
        else{
          this.activited = false
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
  activated() {
    this.getTokenStatus()
  }
};
</script>
<style scoped>
.main-container {
  margin: 20px;
  display: flex;
  align-items: center;
  background-color: rgba(229, 227, 227, 0.7);
}

.switch {
  margin: 20px;
}

.title {
  margin: 20px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(25, 25, 25, 0.8);
}
.expires {
  margin: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(71, 71, 71, 0.8);
}

.design-button {
  margin: 0 10px;
}

.el-button--text {
  margin-right: 15px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
    