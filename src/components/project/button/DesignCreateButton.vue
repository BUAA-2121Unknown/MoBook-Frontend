<template>
  <!-- Form -->
  <el-button @click="dialogFormVisible = true" color="#303133">
    创建原型
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="创建原型设计">
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item label="简介" :label-width="formLabelWidth">
        <el-input
          v-model="form.intro"
          :rows="2"
          type="textarea"
          placeholder="请输入简介"
        />
      </el-form-item>
      <el-form-item label="封面" :label-width="formLabelWidth">
        <PictureUploader :form="form"></PictureUploader>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script>
import PictureUploader from "../PictureUploader.vue";
import { useRouter } from "vue-router";
import { createPrototype } from "@/api/artifact";
import { useUserStore } from "@/stores/modules/user";

export default {
  name: "DesignCreateButton",
  props: ["handler"],
  components: {
    PictureUploader,
  },
  data() {
    return {
      form: {
        name: "",
        intro: "",
        url: "",
      },
      dialogFormVisible: false,
      formLabelWidth: "140px",
    };
  },
  setup() {
    const router = useRouter();
  },
  methods: {
    // 创建原型设计
    async handleCreate() {
      const userStore = useUserStore()
      const data = {
        projId: userStore.projectId,
        name: this.form.name,
        type: "prototype",
        live: false,
      };
      try {
        const res = await createPrototype(data);
        this.dialogFormVisible = false;
        this.$message({
          message: "成功创建原型设计",
          type: "success",
        });
        // 让父组件刷新一下状态
        this.handler()
        
        console.log(res)
        this.form = {
          name: "",
          intro: "",
          url: "",
        };
        this.$router.push({ path: "/prototype", query: { artId: res.data.id} });
      } catch (e) {
        this.dialogFormVisible = false;
        console.log(e);
      }
    },
  },
};
</script>
<style scoped>
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
  