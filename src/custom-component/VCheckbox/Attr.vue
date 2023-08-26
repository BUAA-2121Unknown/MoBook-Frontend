<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="切换">
        <el-switch v-model="curComponent.propValue"></el-switch>
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
  },
}
</script>

<style>

</style>