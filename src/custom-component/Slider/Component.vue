<template>
  <el-slider
    v-model="propValue.val"
    :step="propValue.step"
    :show-input="propValue.showInput"
    :vertical="propValue.vertical"
    :show-tooltip="propValue.showTooltip"
  />
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
