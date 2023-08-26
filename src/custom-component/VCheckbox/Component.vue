<template>
  <input type="checkbox" class="v-checkbox" v-model="curComponent.propValue" />
</template>
<script>
import OnEvent from "../common/OnEvent.vue";
export default {
  extends: OnEvent,
  props: {
    propValue: {
      type: Boolean,
      default: true,
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style scoped>
.v-checkbox {
  margin: 0;
}
</style>