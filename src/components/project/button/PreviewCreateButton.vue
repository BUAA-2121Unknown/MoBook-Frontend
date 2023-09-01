<template>
  <!-- Form -->
  <el-button @click="dialogFormVisible = true" :color="buttonColor" class="design-button">
    管理预览链接
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="管理预览链接" append-to-body>
    <div class="main-container">
      <div class="title">
        {{ title }}
      </div>
      <el-switch v-model="activited" class="ml-2 switch"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;" :change="changeLinkStatus" />
      <el-button @click="copyLink" color="#303133" class="design-button" v-if="activited">
        复制链接
      </el-button>
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
    };
  },
  setup() {
    const router = useRouter();
  },
  computed: {
    title() {
      return this.activited ? "预览链接已开启" : "预览链接已关闭";
    },
    buttonColor(){
      return this.placedAtBar ?  '' : '#303133'
    }
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
      const projectId = useUserStore.projectId
      const data = {
        projectId: userStore.projectId,
        activited: this.activited,
      }
      try {
        const res = await updatePrototypeShareStatus(data)
        console.log('成功改变项目分享状态', res)
        this.activited = !this.activited
      } catch (e) {
        console.log(e)
      }
    },
    // 获取当前项目的分享链接
    async getLink() {
      const userStore = useUserStore()
      const params = {
        projectId: userStore.projectId
      }
      try {
        // const res = await getPrototypeShareLink(params)
        // console.log('成功加载项目分享地址', res)
        // const token = res.data.token
        const token = '1111'
        this.link = "http://" + window.location.host + "/prototype-preview/" + token;
      } catch (e) {
        console.log(e)
      }
    },
  },
  activated() {
    this.getLink()
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
    