<template>
  <div class="attr-list v-talbe-attr">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item v-for="(item, index) in propValue.options" :label="labelName(index)" :key="index">
        <el-input v-model="item.label" placeholder="请输入选项内容" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="handleAdd">添加新选项</el-button>
      </el-form-item>
      <el-form-item label="选择可取消">
        <el-switch v-model="propValue.clearable" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonAttr from "@/custom-component/common/CommonAttr.vue";

export default {
  components: { CommonAttr },
  computed: {
    curComponent() {
      return this.$store.state.curComponent;
    },
    propValue() {
      return this.$store.state.curComponent.propValue;
    },
  },
  methods: {
    handleAdd(){
      const len = this.propValue.options.length
      this.propValue.options.push({
        value: len,
        label: 'Option' + (len + 1),
      })
    },
    labelName(num) {
      return 'Option' + (num + 1)
    },
  }
};
</script>
