<template>
  <div class="attr-list v-talbe-attr">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="滑块值">
        <el-input-number v-model="propValue.val" :min="0" :max="100"/>
      </el-form-item>
      <el-form-item label="步长">
        <el-input-number v-model="propValue.step" :min="1" :max="100"/>
      </el-form-item>
      <el-form-item label="垂直摆放">
        <el-switch v-model="propValue.vertical"></el-switch>
      </el-form-item>
      <el-form-item label="显示输入框">
        <el-switch v-model="propValue.showInput"></el-switch>
      </el-form-item>
      <el-form-item label="显示Tooltips">
        <el-switch v-model="propValue.showTooltip"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'

export default {
  components: { CommonAttr },
  computed: {
    curComponent() {
      return this.$store.state.curComponent
    },
    propValue() {
      return this.$store.state.curComponent.propValue
    },
  },
}
</script>
