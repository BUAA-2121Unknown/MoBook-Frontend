<template>
  <!-- 编辑按钮 -->
  <button class="edit-button" type="button" @click="handleEdit">编辑</button>
</template>

<script>
export default {
  props:['editHandler'],
  methods:{
    handleEdit(){
      this.editHandler()
    }
  }
};
</script>

<style>
</style>