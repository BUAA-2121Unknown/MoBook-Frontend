<template>
  <el-rate v-model="propValue.rate" allow-half />
</template>

<script>
import OnEvent from '../common/OnEvent.vue'

export default {
  extends: OnEvent,
  props: {
    propValue: {
      type: Object,
      // required: true,
      default: () => {},
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return{
    }
  }
}
</script>

<style lang="scss" scoped>
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
