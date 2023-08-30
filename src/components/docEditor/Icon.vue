<template>
  <div
    class="icon"
    :class="[`icon--${name}`, `icon--${size}`, { 'has-align-fix': fixAlign }]"
  >
    <!-- <img :src="() => import(`@/assets/icons/${title}.svg`)" :alt="`${title}`" /> -->
    <img :src="'/docEditorIcons/' + name + '.svg'" :alt="`${name}`" />
  </div>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'normal',
    },
    modifier: {
      type: Object,
      default: null,
    },
    fixAlign: {
      type: Boolean,
      default: false,
    },
  },
  // created: function() {}
};
</script>

<style lang="scss" scoped></style>
