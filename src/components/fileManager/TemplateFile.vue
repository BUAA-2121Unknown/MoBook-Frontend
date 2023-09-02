<template>
  <el-dialog v-model="templateVisible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">选择你想要使用的模版</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        </el-button>
      </div>
      <div class="template-container">
        <div class="common-layout">
          <el-container>
            <el-aside width="200px">
              <div class="template" @click="myTemplate=false">默认模板</div>
              <div class="template" @click="myTemplate=true">我的模版</div>
            </el-aside>
            <el-main>Main</el-main>
          </el-container>
        </div>
        <!-- <div v-for="(item, key) in docTemplate" :key="key">
          <div>
            <el-button type="primary" @click="createFromTemplate(item.content)">{{ item.name }}</el-button>
          </div>
        </div> -->
      </div>
    </template>
  </el-dialog>
    
</template>

<script>
export default {

}
</script>

<style scoped>

</style>