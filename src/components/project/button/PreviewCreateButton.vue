<template>
  <!-- Form -->
  <el-button
    @click="dialogFormVisible = true"
    color="#303133"
    class="design-button"
  >
    创建预览链接
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="创建预览链接" append-to-body>
    <div class="main-container">
        <div class="title">
            {{ title }}
        </div>
      <el-switch
        v-model="activited"
        class="ml-2 switch"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
        :change="changeLinkStatus"
      />
      <el-button
        @click="copyLink"
        color="#303133"
        class="design-button"
        v-if="activited"
      >
        复制链接
      </el-button>
    </div>
  </el-dialog>
</template>
    
  <script>
import PictureUploader from "../PictureUploader.vue";
import { useRouter } from "vue-router";
import { createPrototype, savePrototype } from "@/api/artifact";
import { useUserStore } from "@/stores/modules/user";
import { emptyTemplateContent } from "@/enums/prototypeTemplateEnum.js";

export default {
  name: "PreviewCreateButton",
  props: ["handler"],
  components: {
    PictureUploader,
  },
  data() {
    return {
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
  },
  methods: {
    // 复制共享链接
    copyLink(){
        this.$message({
          message: "已复制到剪切板",
          type: "success",
        });
    },
    // 改变了共享链接的状态
    changeLinkStatus() {
        const userStore = useUserStore()
        const projectId = useUserStore.projectId
        if(this.activited){
        
        }
        else{
        
        }
    }
  },
};
</script>
  <style scoped>
  .main-container{
    margin: 20px;
    display: flex;
    align-items: center;
    background-color: rgba(229, 227, 227, 0.7);
}
.switch{
    margin: 20px;
}
  .title{
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
    