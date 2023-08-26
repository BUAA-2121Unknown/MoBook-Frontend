<script>
import { $on, $off, $once, $emit } from '../../utils/design/gogocodeTransfer'
import eventBus from '@/utils/design/eventBus'

export default {
  props: {
    linkage: {
      type: Object,
      default: () => {},
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    if (this.linkage?.data?.length) {
      $on(eventBus, 'v-click', this.onClick)
      $on(eventBus, 'v-hover', this.onHover)
    }
  },
  mounted() {
    const { data, duration } = this.linkage || {}
    if (data?.length) {
      this.$el.style.transition = `all ${duration}s`
    }
  },
  beforeUnmount() {
    if (this.linkage?.data?.length) {
      $off(eventBus, 'v-click', this.onClick)
      $off(eventBus, 'v-hover', this.onHover)
    }
  },
  methods: {
    changeStyle(data = []) {
      data.forEach((item) => {
        item.style.forEach((e) => {
          if (e.key) {
            this.element.style[e.key] = e.value
          }
        })
      })
    },

    onClick(componentId) {
      const data = this.linkage.data.filter(
        (item) => item.id === componentId && item.event === 'v-click'
      )
      this.changeStyle(data)
    },

    onHover(componentId) {
      const data = this.linkage.data.filter(
        (item) => item.id === componentId && item.event === 'v-hover'
      )
      this.changeStyle(data)
    },
  },
}
</script>
