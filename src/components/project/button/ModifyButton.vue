<template>
  <button @click="handleClick" class="button1">修改</button>

  <!-- 项目信息修改 -->
  <el-dialog v-model="dialogFormVisible" title="字段修改">
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入标题" />
      </el-form-item>
      <!-- <el-form-item label="简介" :label-width="formLabelWidth">
        <el-input
          v-model="form.description"
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
        <el-button type="primary" @click="modifyDesign"> 确认修改 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { updatePrototypeInfo } from "../../../api/artifact";
import PictureUploader from "../PictureUploader.vue";
import { useUserStore } from "../../../stores/modules/user";

export default {
  name: "ModifyButton",
  props: ["fatherHandler", "design"],
  components: {
    PictureUploader,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
        // imgUrl: "",
      },
      formLabelWidth: "140px",
      projId: 0,
    };
  },
  methods: {
    handleClick() {
      this.dialogFormVisible = true;
    },
    async modifyDesign() {
      this.form.name = this.form.name ? this.form.name : "未命名原型设计";
      const data = {
        projId: this.projId,
        itemId: this.design.id,
        filename: this.form.name,
      };
      try {
        const res = await updatePrototypeInfo(data);
        console.log("修改原型设计字段：", res);
        this.fatherHandler(this.form.name, '');
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.dialogFormVisible = false;
      } catch (e) {
        this.dialogFormVisible = false;
        console.log(e);
      }
    },
  },
  mounted() {
    this.form.name = this.design.name;
    const userStore = useUserStore()
    this.projId = userStore.projId
  },
};
</script>

<style scoped>
.button1 {
  cursor: pointer;

  margin: 5px 10px;
  --color: #a0a0a0;
  font-family: inherit;
  display: inline-block;
  width: 70px;
  height: 35px;
  line-height: 17.5px;
  overflow: hidden;
  font-size: 14px;
  z-index: 1;
  color: var(--color);
  border: 2px solid var(--color);
  border-radius: 6px;
  position: relative;
}

.button1::before {
  position: absolute;
  content: "";
  background: var(--color);
  width: 280px;
  height: 220px;
  z-index: -1;
  border-radius: 50%;
}

.button1:hover {
  color: white;
}

.button1:before {
  top: 100%;
  left: 100%;
  transition: 0.3s all;
}

.button1:hover::before {
  top: -30px;
  left: -30px;
}
</style>