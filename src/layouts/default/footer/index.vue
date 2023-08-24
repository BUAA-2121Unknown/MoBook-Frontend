<script setup>
import siteSetting from '@/settings/siteSetting'
</script>

<template>
  <el-footer>
    <div class="footer-wrapper">
      <div class="footer-body container">
        <el-row>
          <el-col :span="16">
            <div class="footer-title">
              {{ siteSetting.appName }}
            </div>
            <span>© 2023</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>


<style scoped>
.footer-wrapper {
  background-color: #505050;
  color: #b1b3b8;
}
.footer-body {
  padding-top: 20px;
  padding-bottom: 60px;
}
.footer-title {
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 10px;
}
.footer-links {
  line-height: 2;
  text-align: right;
}

.divider {
  border-left: 1px solid var(--el-color-info-dark-2);
}
</style>
