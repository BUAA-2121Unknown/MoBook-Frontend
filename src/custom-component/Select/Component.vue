<template>
  <el-select v-model="propValue.value" :clearable="propValue.clearable" placeholder="Select">
    <el-option
      v-for="item in propValue.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import OnEvent from "../common/OnEvent.vue";

export default {
  extends: OnEvent,
  props: {
    propValue: {
      type: Object,
      default: () => {},
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>
