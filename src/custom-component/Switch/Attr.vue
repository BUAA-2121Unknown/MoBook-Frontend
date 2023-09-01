<template>
  <div class="attr-list v-talbe-attr">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="开关值">
        <el-switch v-model="propValue.val"></el-switch>
      </el-form-item>
      <el-form-item label="文本显示位置">
        <el-switch
          v-model="propValue.inlinePrompt"
          inline-prompt
          active-text="开关内"
          inactive-text="开关外"
        ></el-switch>
      </el-form-item>
      <el-form-item label="开启时文本">
        <el-input v-model="propValue.activeText" placeholder="文本将在开关打开时显示" />
      </el-form-item>
      <el-form-item label="关闭时文本">
        <el-input v-model="propValue.inactiveText" placeholder="文本将在开关关闭时显示"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonAttr from "@/custom-component/common/CommonAttr.vue";

export default {
  components: { CommonAttr },
  computed: {
    curComponent() {
      return this.$store.state.curComponent;
    },
    propValue() {
      return this.$store.state.curComponent.propValue;
    },
  },
};
</script>
