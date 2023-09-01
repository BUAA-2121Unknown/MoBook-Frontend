<template>
  <div @click="onClick" @mouseenter="onMouseEnter">
    <component
      :is="config.component"
      v-if="config.component.startsWith('SVG')"
      ref="component"
      style="position: absolute;"
      class="component"
      :style="getSVGStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />

    <component
      :is="config.component"
      v-else
      ref="component"
      style="position: absolute;"
      class="component"
      :style="getStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from '../../utils/design/gogocodeTransfer'
import { getStyle, getSVGStyle } from '../../utils/design/style'
import runAnimation from '../../utils/design/runAnimation'
import { mixins } from '../../utils/design/events'
import eventBus from '../../utils/design/eventBus'

export default {
  mixins: [mixins],
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  mounted() {
    runAnimation(this.$refs.component.$el, this.config.animations)
  },
  methods: {
    getStyle,
    getSVGStyle,

    onClick() {
      const events = this.config.events
      Object.keys(events).forEach((event) => {
        this[event](events[event])
      })

      $emit(eventBus, 'v-click', this.config.id)
    },

    onMouseEnter() {
      $emit(eventBus, 'v-hover', this.config.id)
    },
  },
  emits: ['v-click', 'v-hover'],
}
</script>

<style lang="scss" scoped>
.component {
  position: absolute;
}
</style>
