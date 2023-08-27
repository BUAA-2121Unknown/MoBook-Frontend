<template>
  <div class="main-wrapper">
    <div class="gva-table-box" style="margin-top: 2%;">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="centerDialogVisible = true">新建文档</el-button>
      </div>
      <el-table
        :data="coWorkerList"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="authorityId"
        style="width: 100%"
      >
        <el-table-column label="名称" min-width="180" prop="name" />
        <el-table-column label="创建者" min-width="180" prop="creator" />
      </el-table>
    </div>

    <el-dialog v-model="centerDialogVisible" title="输入你的文档名" width="30%" center>
      <span>
        <el-input v-model="input" placeholder="" />
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createDoc(); centerDialogVisible = false">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const centerDialogVisible = ref(false)
const input = ref('')
</script>

<script>
export default {
  name: 'ProjectDoc',
  props: {
    project_id: {
      type: String,
      required: true,
    },
    team_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchedInput: "",
      coWorkerList: [
        {
          name: '文档1',
          creator: '张三',
        }
      ],
      teamName:  '团队名',
      teamIntro: '团队简介 BlaBla...',
    }
  },

  methods: {
    createDoc(){
      //这里调用后端接口，先设置为：先确定标题再进入文档
      const doc_id = '1'
      this.$router.push({
        path: '/doc',
        query: { doc_id: doc_id }
      })
    }
  },
}
</script>

<style scoped>
.main-wrapper {
  padding-top: 1%;
}
.header-wrapper {
  padding-top: 12px;
  border-top: #777777 solid 1px;
}

.row-wrapper {
  padding: 10px;
}

.avatar-wrapper {
  height: 96px;
  line-height: 96px;
  color: var(--el-text-color-primary);
  text-align: center;
}

.teamName {
  font-size: 24px;
  font-weight: bold;
}

.teamIntro {
  font-size: 16px;
  font-weight: bold;
}

/* 弹出框 */
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>