<template>
  <div
    class="icon"
    :class="[`icon--${name}`, `icon--${size}`, { 'has-align-fix': fixAlign }]"
  >
    <!-- <img :src="require(`../../assets/icons/${title}.svg`)" :alt="`${title}`" /> -->
    <img :src="'url(../../src/assets/docEditorIcons/' + name + '.svg'" :alt="`${name}`" />
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
