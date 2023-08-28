<template>
  <div class="menu-container">
    <el-menu default-active="1" class="vertical-menu">
      <el-sub-menu index="1" popper-class="submenu-up">
        <template #title>
          <span>Submenu</span>
        </template>
        <el-menu-item index="1-1">Sub-item 1</el-menu-item>
        <el-menu-item index="1-2">Sub-item 2</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NoOrgHome',
}
</script>

<style>
.menu-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.vertical-menu {
  flex: 1;
}

/* Apply custom styles to make the submenu expand upward */
.submenu-up {
  bottom: 0 !important;
  top: auto !important;
}
</style>
