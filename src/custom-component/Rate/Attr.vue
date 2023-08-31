<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="评分值">
        <el-input-number v-model="propValue.rate" :step="0.5" :precision="1" :max="5" :min="0"/>
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
