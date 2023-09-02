<template>
  <div class="file-tree-container">
    <div class="header-wrapper">
      <span class="root-title">项目文件</span>
      <div class="button-wrapper">
        <el-button class="button" icon="DocumentAdd" @click="addAtRoot(2, props.itemProperty)"></el-button>
        <el-button class="button" icon="FolderAdd" @click="addAtRoot(1, 0)"></el-button>
      </div>
    </div>

    <el-dialog v-model="templateVisible" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">选择你想要使用的模版</h4>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          </el-button>
        </div>
        <div v-for="(item, key) in docTemplate" :key="key">
          <div>
            <el-button type="primary" @click="createFromTemplate(item.content)">{{ item.name }}</el-button>
          </div>
        </div>
      </template>
      
    </el-dialog>
    
    
    <el-tree
      v-if="treeVisible"
      :data="dataSource"
      :allow-drop="allowDrop"
      ref="treeRef"
      node-key="id"
      draggable
      :expand-on-click-node="true"
      :default-expanded-keys="expandedList"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
      @node-drag-start="handleDragStart"
      @node-drop="handleDrop"
      class="file-tree"
    >
      <template #default="{ node, data }">
        <span class="file-tree-node-wrapper">
          <!-- 编辑文件名 -->
          <span v-if="data.isInputVisible" class="file-tree-node">
            <el-input
              class="input"
              textareaStyle="backgound-color: #eeeeee;"
              v-model="editingName"
              ref="editingRef"
              @blur="handleEditComplete(data, editingName)"
              @keydown.enter.stop="$event.target.blur()"
            />
          </span>

          <!-- 正常显示文件名 -->
          <span v-else class="file-tree-node">
            <span class="file-wrapper">
              <span v-if="data.data.type === 1" class="icon-wrapepr">
                <el-icon class="icon"><Folder /></el-icon>
              </span>
              <span v-else class="icon-wrapepr">
                <el-icon class="icon"><Document /></el-icon>
              </span>

              <span class="file-name">{{ data.data.name }}</span>
            </span>

            <span>
              <el-button
                v-if="data.data.type === 1"
                class="file-tree-node-button"
                icon="DocumentAdd"
                @click="appendItem(2, data)"
              />
              <el-button
                v-if="data.data.type === 1"
                class="file-tree-node-button"
                icon="FolderAdd"
                @click="appendItem(1, data)"
              />
              <el-button
                class="file-tree-node-button"
                icon="Edit"
                @click="editFile(data)"
              />
              <el-button
                class="file-tree-node-button"
                icon="Delete"
                @click="deleteFile(node, data)"
              />
            </span>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'FileTree'
}
</script>

<script setup>
import { useRouter,useRoute } from 'vue-router'
import { ref, nextTick, defineProps, onMounted, provide } from 'vue'
import { ElButton, ElInput, ElMessage, ElMessageBox, ElDialog } from 'element-plus'
import { getAllItems, moveItem, createFolder, createFile, updateItemStatus, updateItemName } from '@/api/fileTree'
import { useUserStore } from '@/stores/modules/user'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { fromUint8Array, toUint8Array } from 'js-base64'
import docTemplate from '@/utils/docTemplate.js'

const templateVisible = ref(false)

// 从文档模版创建文件
const createFromTemplate = async(content) => {
  const res = await createFile({
    'projId': userStore.projectId,
    'itemId': rootId.value,
    'filename': "新建文档",
    'prop': props.itemProperty,
    'live': true,
    'sibling': false,
    'content': content
  })
  if (res.meta.status == 0) {
    ElMessage({
      type: 'success',
      message: '创建成功',
    })
    console.log(res.data)
  } else {
    ElMessage({
      type: 'error',
      message: '创建失败',
    })
    console.log(res.data)
  }
}

import { createNewItem } from './helper'

/**
 * 调用该组件时所需的 props
 * @itemProperty: 1: Document, 2: Prototype
 */
const props = defineProps({
  itemProperty: {
    type: Number,
    default: () => 1
  }
})

const userStore = useUserStore()
const router = useRouter()

const treeVisible = ref(true)
const rootId = ref(1)
const dataSource = ref([])
const dataSourceCopy = ref([])

const treeRef = ref()

const editingName = ref('')
const editingStatus = ref('')
const editingRef = ref()
const expandedList = ref([])

const GetAllItems = async () => {
  try {
    const res = await getAllItems({
      projId: userStore.projectId,
      status: 0,
    })
    if (res.meta.status == 0) {
      console.log('GET_ALL', res)
      rootId.value = res.data.id
      dataSource.value = res.data.children || []
    } else {
      dataSource.value = fileTreeList
      console.log(res)
    }
  } catch(e) {
    dataSource.value = fileTreeList
    console.log(e)
  }
}

onMounted(async () => {
  await GetAllItems()
})

const handleNodeExpand = (node, data) => {
  console.log(node)
  if (!expandedList.value.includes(node.id)) {
    expandedList.value.push(node.id)
  }
}

const handleNodeCollapse = (node, data) => {
  console.log(node)
  const index = expandedList.value.findIndex((id) => id === node.id)
  expandedList.value.splice(index, 1)
}

const nodeClick = (data, node, item) => {
  router.push({ name: 'doc', query: {doc_id: data.id}})
}

const allowDrop = (draggingNode, dropNode, type) => {
  if (dropNode.data.data.type === 2) {
    return false
  } else {
    return true
  }
}

const copyDataSource = () => {
  if (!dataSource.value) {
    return
  }
  dataSourceCopy.value = JSON.parse(JSON.stringify(dataSource.value))
}

const handleDragStart = (node, ev) => {
  copyDataSource()
}

const handleDrop = async (draggingNode, dropNode, dropType, ev) => {
  const movingItemId = draggingNode.data.id
  const targetFolderId = dropNode.data.children ? dropNode.data.id : rootId.value
  ElMessageBox.confirm('确认移动？', '确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await moveItem({
        'projId': userStore.projectId,
        'folderId': targetFolderId,
        'items': [movingItemId],
      })
      if (res.meta.status == 0) {
        ElMessage({
          type: 'success',
          message: '移动成功',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '移动失败',
        })
        dataSource.value = dataSourceCopy.value
        console.log(res)
      }
    } catch(e) {
      console.log(e)
    }
  }).catch(() => {
    dataSource.value = dataSourceCopy.value
  })

  restoreExpandedState()
}

const restoreExpandedState = async () => {
  console.log('start restore')
  console.log(expandedList.value)
  treeVisible.value = false
  await nextTick()
  treeVisible.value = true
}

/**
 * @type: 0: Root, 1: Folder, 2: File
 * @prop: 0: Folder, 1: Document, 2: Prototype
 */
const addAtRoot = async (type, prop) => {
  copyDataSource()

  const newItem = createNewItem(type, prop)

  dataSource.value.push(newItem)
  dataSource.value = [...dataSource.value]
  editingStatus.value = (type === 1 ? 'folder' : 'file')

  restoreExpandedState()

  await editFile(newItem)
}

const editFile = async (data) => {
  if (!editingStatus.value) {
    editingStatus.value = 'editing'
    copyDataSource()
  }
  restoreExpandedState()

  data.isInputVisible = true
  editingName.value = data.data.name

  while (!editingRef.value) {
    await nextTick()
  }
  editingRef.value.focus()
}

const handleEditComplete = async (node, name) => {
  console.log('handleEditComplete', node)
  node.isInputVisible = false
  if (!name) {
    dataSource.value = dataSourceCopy.value
    ElMessage({
      type: 'error',
      message: '名字不可为空',
    })
  } else {
    node.data.name = name
    if (editingStatus.value === 'folder') {
      const res = await createFolder({
        'projId': userStore.projectId,
        'itemId': rootId.value,
        'filename': node.data.name,
      })

      if (res.meta.status == 0) {
        if (editingStatus.value === 'editing') {

        } else {
          node.data.id = res.data.id
          node.data.created = res.data.created
          node.data.updated = res.data.updated
        }
        console.log('after folder')
        ElMessage({
          type: 'success',
          message: editingStatus.value === 'editing' ? '修改成功' : '创建成功',
        })
      } else {
        console.log(res)
      }
    } else if (editingStatus.value === 'file') {
      const res = await createFile({
        'projId': userStore.projectId,
        'itemId': rootId.value,
        'filename': node.data.name,
        'prop': props.itemProperty,
        'live': true,
        'sibling': false,
      }).then((res) => {
        return res;
      }).catch((error) => {
        console.log("🚀 > error:", error);
      });

      if (res.meta.status == 0) {
        if (editingStatus.value === 'editing') {

        } else {
          node.data.id = res.data.id
          node.data.created = res.data.created
          node.data.updated = res.data.updated
        }
        console.log('after file')
        ElMessage({
          type: 'success',
          message: editingStatus.value === 'editing' ? '修改成功' : '创建成功',
        })
      } else {
        console.log(res)
      }
    } else if (editingStatus.value === 'editing') {
      const res = await updateItemName({
        'projId': userStore.projectId,
        'itemId': node.id,
        'filename': node.data.name,
      })

      if (res.meta.status == 0) {
        if (editingStatus.value === 'editing') {

        } else {
          node.data.id = res.data.id
          node.data.created = res.data.created
          node.data.updated = res.data.updated
        }
        console.log('after editing')
        ElMessage({
          type: 'success',
          message: editingStatus.value === 'editing' ? '修改成功' : '创建成功',
        })
      } else {
        console.log(res)
      }
    }
    editingStatus.value = ''
  }
  restoreExpandedState()
}

const appendItem = async (type, data) => {
  copyDataSource()

  const newItem = createNewItem(type, props.itemProperty)

  if (!data.children) {
    data.children = []
  }
  if (!expandedList.value.includes(data.id)) {
    expandedList.value.push(data.id)
  }
  data.children.push(newItem)
  dataSource.value = [...dataSource.value]
  editingStatus.value = (type === 1 ? 'folder' : 'file')

  await editFile(newItem)
}

const deleteFile = async (node, data) => {
  ElMessageBox.confirm('确认删除？', '确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await updateItemStatus({
        'projId': userStore.projectId,
        'status': 1,
        'items': [data.id],
      })
      if (res.meta.status == 0) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex((d) => d.id === data.id)
        children.splice(index, 1)
        dataSource.value = [...dataSource.value]

        restoreExpandedState()
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
        dataSource.value = dataSourceCopy.value
        console.log(res)
      }
    } catch(e) {
      console.log(e)
    }
  }).catch(() => {
    console.log('Cancelled');
  })
}

const fileTreeList = [
  {
    "data": {
      "name": "Folder",
      "extension": "",
      "type": 1,
      "prop": 0,
      "created": "2023-08-30 22:40:02",
      "updated": "2023-08-30 22:40:02",
      "status": 0,
      "live": false,
      "version": 1,
      "proj_id": 2,
      "org_id": 1,
      "file_id": 0
    },
    "id": 2,
    "children": [
      {
        "data": {
          "name": "File1",
          "extension": "",
          "type": 2,
          "prop": 1,
          "created": "2023-08-30 22:41:53",
          "updated": "2023-08-30 22:48:08",
          "status": 0,
          "live": false,
          "version": 1,
          "proj_id": 2,
          "org_id": 1,
          "file_id": 0
        },
        "id": 4
      },
      {
        "data": {
          "name": "File2",
          "extension": "",
          "type": 2,
          "prop": 1,
          "created": "2023-08-30 22:53:22",
          "updated": "2023-08-30 22:53:22",
          "status": 0,
          "live": false,
          "version": 1,
          "proj_id": 2,
          "org_id": 1,
          "file_id": 0
        },
        "id": 5
      }
    ]
  },
  {
    "data": {
      "name": "File 2",
      "extension": "",
      "type": 2,
      "prop": 1,
      "created": "2023-08-30 22:57:05",
      "updated": "2023-08-30 22:57:05",
      "status": 0,
      "live": false,
      "version": 1,
      "proj_id": 2,
      "org_id": 1,
      "file_id": 0
    },
    "id": 6
  }
]
</script>

<style scoped lang="scss">
.file-tree-container {
  width: 24%;
  height: 100vh;
  border-right: 1px solid #aaaaaa;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 0;
  background-color: #eeeeee;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #bbbbbb;
  margin-bottom: 3px;
  background-color: #eeeeee;

  .root-title {
    font-size: 18px;
    padding-left: 16px;
    font-weight: bold;
  }

  .button-wrapper {
    padding: 4px 0;
    padding-right: 12px;
    border-radius: 10%;

    .button {
      margin-left: 6px;
      height: 28px;
      width: 28px;
      padding: 0 0;
      background-color: #eeeeee;
      border: none;
    }
  }
}

.file-tree {
  background-color: #eeeeee;
}

.file-wrapper {
  display: flex;
  padding-right: 4px;
  align-items: center;
}

.file-tree-node-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  height: 32px;

  .file-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    height: 28px;

    .input {
      height: 22px;
    }
  }

  .icon-wrapepr {
    margin-right: 6px;
    padding: 4px 0;
    line-height: 20px;
    font-size: 14px;

    .icon {
      width: 24px;
      height: 24px;
    }
  }

  .file-name {
    font-size: 14px;
    padding: 4px 1px;
    color: #606266;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.file-tree-node-button {
  display: none;
  padding: 0 1px;
  margin: 0px;
  font-size: 16px;
  color: #666;
  height: 100%;
  border: none;
}
.file-tree-node:hover .file-tree-node-button {
  display: inline-block;
}

/* 模版页面的header */
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
