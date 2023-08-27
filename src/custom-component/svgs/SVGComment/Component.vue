<template>
  <div class="svg-comment-container">
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      data-v-78e17ca8=""
    >
      <path
        fill="currentColor"
        d="M736 504a56 56 0 1 1 0-112 56 56 0 0 1 0 112zm-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112zm-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112zM128 128v640h192v160l224-160h352V128H128z"
      ></path>
    </svg>
  </div>
</template>

<script>
import OnEvent from '../../common/OnEvent.vue'
export default {
    extends: OnEvent,

};
</script>

<style lang="scss" scoped>
.svg-comment-container {
  width: 100%;
  height: 100%;
  svg {
    width: 100%;
    height: 100%;
  }

  .v-text {
    position: absolute;
    top: 58%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 40%;
  }
}
</style>