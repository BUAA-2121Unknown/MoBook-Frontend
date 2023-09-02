<template>
  <el-switch
    v-model="propValue.val"
    :inline-prompt="propValue.inlinePrompt"
    :active-text="propValue.activeText"
    :inactive-text="propValue.inactiveText"
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
