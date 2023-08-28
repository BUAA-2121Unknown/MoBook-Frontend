<template>
  <div class="main-wrapper">
    <div class="gva-table-box" style="margin-top: 2%;">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="centerDialogVisible = true">新建文档</el-button>
      </div>
      <el-table
        :data="docList"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="authorityId"
        style="width: 100%"
        @row-click="clickRow"
      >
        <el-table-column label="名称" min-width="100" prop="name" />
        <el-table-column label="创建者" :formatter="formatUsername" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              type="primary" size="small"
              @click.stop="handleShareView(scope.$index, scope.row)"
              >分享（仅查看）</el-button
            >
            <el-button
              type="primary" size="small"
              @click.stop="handleShareEdit(scope.$index, scope.row)"
              >分享（可编辑）</el-button
            >
            <el-button
              type="danger" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="centerDialogVisible" title="输入你的文档名" width="30%" center>
      <span>
        <el-input v-model="form.name" placeholder="" />
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createDocument(); centerDialogVisible = false">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { createDoc, updateDocStatus } from '@/api/artifact.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getDocList } from '../../api/artifact'

const centerDialogVisible = ref(false)

const userStore = useUserStore()
const router = useRouter()

const form = ref({
  projId: '',
  name: '',
  type: '',
  live: ''
})
const projectIdFormData = ref({
  projId: ''
})


const createDocument = async () => {
  // TODO
  try {
    form.value.projId = userStore.projectId
    form.value.type = 'Doc'
    form.value.live = true
    const res = await createDoc(form.value)
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '创建成功'
      })
      router.push({
        path: '/doc',
        query: {
          doc_id: res.data.id
        }
      })
      return res
    }
  } catch (e) {
    console.log(e)
  }
}

const docList = ref([])

onMounted(async () => {
  projectIdFormData.value.projId = userStore.projectId
  try {
    console.log(projectIdFormData.value)
    console.log(userStore.projectId)
    const res = await getDocList(projectIdFormData.value)
    console.log(res)
    if (res.meta.status == 0) {
      docList.value = res.data.artifacts
    }
  } catch (e) {
    console.log(e)
  }
});
</script>

<script>

export default {
  name: 'ProjectDoc',
  // props: {
  //   project_id: {
  //     type: String,
  //     required: true,
  //   },
  //   team_id: {
  //     type: String,
  //     required: true,
  //   },
  // },
  data() {
    return {
      searchedInput: "",
      projectIdFormData: {
        projId: ""
      },
    }
  },
  methods: {
    async clickRow(row) {
      console.log(row)
      this.$router.push({
        path: '/doc',
        query: {
          doc_id: row.id
        }
      })
    },
    formatUsername(row) {
      return row.creator.username
    },
    handleShareView(index, row){
      console.log(index)
      console.log(row)
    },

    handleShareEdit(index, row){
      console.log(index)
      console.log(row)
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

.el-table__row:hover {
  background-color: #f5f7fa;
  cursor: pointer
}
</style>