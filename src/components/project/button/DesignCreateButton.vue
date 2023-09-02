<template>
  <!-- Form -->
  <el-button @click="dialogFormVisible = true" color="#303133" class="design-button">
    创建原型设计
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="创建原型设计" append-to-body>
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入标题"
        />
      </el-form-item>
      <!-- <el-form-item label="简介" :label-width="formLabelWidth">
        <el-input
          v-model="form.intro"
          :rows="2"
          type="textarea"
          placeholder="请输入简介"
        />
      </el-form-item> -->
      <!-- <el-form-item label="封面" :label-width="formLabelWidth">
        <PictureUploader :form="form"></PictureUploader>
      </el-form-item> -->
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
import { createPrototype, savePrototype } from "@/api/artifact";
import { useUserStore } from "@/stores/modules/user";
import { emptyTemplateContent } from "@/enums/prototypeTemplateEnum.js"

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
      },
      dialogFormVisible: false,
      formLabelWidth: "140px",
      projId: 0,
    };
  },
  mounted(){
    const userStore = useUserStore()
    this.projId = userStore.projectId
  },
  setup() {
    const router = useRouter();
  },
  methods: {
    // y创建原型设计
    async handleCreate() {
      const data = {
        projId: this.projId,
        itemId: 148,
        filename: this.form.name,
        prop: 2,
        live: false,
        sibling: false,
        content: emptyTemplateContent,
      };
      try {
        // 创建原型设计
        const res = await createPrototype(data);
        console.log("成功创建原型设计", data, res);
        this.dialogFormVisible = false;
        this.$message({
          message: "成功创建原型设计",
          type: "success",
        });
        // 让父组件刷新一下状态
        this.handler();
        this.form = {
          name: "",
        };
        // 跳转到新页面
        this.$router.push({
          path: "/prototype",
          query: { itemId: res.data.id },
        });
      } catch (e) {
        this.dialogFormVisible = false;
        console.log(e);
      }
    },
  },
};
</script>
<style scoped>
.design-button{
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
  