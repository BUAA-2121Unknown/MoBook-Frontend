<template>
  <button @click="handleClick" class="del-button">删除</button>

  <!-- 删除原型设计 -->
  <el-dialog v-model="dialogDelVisible" title="提示" width="30%" v-if="recycle">
    <span>确认删除原型设计？该原型设计将被放入回收站。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取消</el-button>
        <el-button type="danger" @click="delDesign"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 从回收站删除原型设计 -->
  <el-dialog
    v-model="dialogDelForeverVisible"
    title="提示"
    width="30%"
    v-if="!recycle"
  >
    <span>确认彻底删除原型设计？彻底删除后将无法恢复！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogDelForeverVisible = false">取消</el-button>
        <el-button type="danger" @click="delForeverDesign"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { updatePrototypeStatus } from "../../../api/artifact";

export default {
  name: "DelButton",
  props: ["fatherHandler", "design", "recycle"],
  data() {
    return {
      dialogDelForeverVisible: false,
      dialogDelVisible: false,
    };
  },
  methods: {
    handleClick() {
      this.dialogDelForeverVisible = true;
    },
    async delForeverDesign() {
      const data = { status: 2, artifacts: [this.design.id] };
      try {
        const res = await updatePrototypeStatus(data);

        console.log("删除原型设计：", res);
        this.fatherHandler(this.design.id);
        this.$message({
          message: "原型设计已彻底删除",
          type: "success",
        });
        this.dialogDelForeverVisible = false;
      } catch (e) {
        this.dialogDelForeverVisible = false;
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.del-button {
  cursor: pointer;

  margin: 5px 10px;
  --color: #fb5959;
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

.del-button::before {
  position: absolute;
  content: "";
  background: var(--color);
  width: 280px;
  height: 220px;
  z-index: -1;
  border-radius: 50%;
}

.del-button:hover {
  color: white;
}

.del-button:before {
  top: 100%;
  left: 100%;
  transition: 0.3s all;
}

.del-button:hover::before {
  top: -30px;
  left: -30px;
}
</style>