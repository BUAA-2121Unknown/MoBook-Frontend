<template>
  <div class="file-tree-container">
    <div class="header-wrapper">
      <p>项目文件</p>
      <div>
        <el-button type="primary" icon="DocumentAdd" @click="addAtRoot(2, props.itemProperty)"></el-button>
        <el-button type="primary" icon="FolderAdd" @click="addAtRoot(1, 0)"></el-button>
      </div>
    </div>

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
    >
      <template #default="{ node, data }">
        <span class="file-tree-node">
          <!-- 编辑文件名 -->
          <span v-if="data.isInputVisible" class="file-tree-node">
            <el-input
              v-model="editingName"
              ref="editingRef"
              @blur="handleEditComplete(data, editingName)"
              @keyup.enter="handleEditComplete(data, editingName)"
            />
          </span>

          <!-- 正常显示文件名 -->
          <span v-else class="file-tree-node">
            <span v-if="data.data.type === 1">
              <el-icon><Folder /></el-icon>
            </span>
            <span v-else>
              <el-icon><Document /></el-icon>
            </span>
            <span>{{ data.data.name }}</span>
            <span>
              <el-button
                v-if="data.data.type === 1"
                class="file-tree-node-button"
                icon="DocumentAdd"
                @click="appendFile(data)"
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
import { ref, nextTick, defineProps, onMounted } from 'vue'
import { ElButton, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { getAllItems, moveItem, createFolder, createFile, updateItemStatus, updateItemName } from '@/api/fileTree'
import { useUserStore } from '@/stores/modules/user'

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

let increasingId = 114514191

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
      rootId.value = res.data[0].id
      dataSource.value = res.data[0].children || []
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
  if (!expandedList.includes(node.id)) {
    expandedList.value.push(node.id)
  }
}

const handleNodeCollapse = (node, data) => {
  console.log(node)
  const index = expandedList.value.findIndex((id) => id === node.id)
  expandedList.value.splice(index, 1)
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
  rememberExpandedState()
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

const rememberExpandedState = () => {
  console.log('start remember')
  /* if (!dataSource.value) {
    return
  }
  for (const node of dataSource.value) {
    console.log(node)
    expandedList.value[node.id] = node.expanded
  } */
  console.log(expandedList.value)
}
const restoreExpandedState = async () => {
  console.log('start restore')
  console.log(expandedList.value)
  /* if (!dataSource.value) {
    return
  }
  for (const node of dataSource.value) {
    if (!expandedList.value[node.id]) {
      continue
    }
    node.expanded = expandedList.value[node.id]
  } */
  treeVisible.value = false
  await nextTick()
  treeVisible.value = true
}

const createNewItem = (type, prop) => {
  return {
    "data": {
      "name": "",
      "extension": "",
      "type": type,
      "prop": prop,
      "created": "",
      "updated": "",
      "status": 0,
      "live": false,
      "version": 1,
      "proj_id": userStore.projectId,
      "org_id": 1,
      "file_id": 0
    },
    "id": increasingId++,
    "children": []
  }
}

/**
 * @type: 0: Root, 1: Folder, 2: File
 * @prop: 0: Folder, 1: Document, 2: Prototype
 */
const addAtRoot = async (type, prop) => {
  rememberExpandedState()
  copyDataSource()

  const newItem = createNewItem(type, prop)

  dataSource.value.push(newItem)
  dataSource.value = [...dataSource.value]
  editingStatus.value = (type === 1 ? 'folder' : 'file')

  restoreExpandedState()

  await editFile(newItem)

  // restoreExpandedState()
}

const editFile = async (data) => {
  if (!editingStatus.value) {
    editingStatus.value = 'editing'
    copyDataSource()
  }
  restoreExpandedState()
  // rememberExpandedState()

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
      })

      if (res.meta.status == 0) {
        if (editingStatus.value === 'editing') {

        } else {
          node.data.id = res.data.id
          node.data.created = res.data.created
          node.data.updated = res.data.updated
        }
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

const appendFile = async (data) => {
  rememberExpandedState()
  copyDataSource()

  const newItem = createNewItem(2, props.itemProperty)

  if (!data.children) {
    data.children = []
  }
  if (!expandedList.value.includes(data.id)) {
    expandedList.value.push(data.id)
  }
  data.children.push(newItem)
  dataSource.value = [...dataSource.value]

  await editFile(newItem)
}

const deleteFile = async (node, data) => {
  rememberExpandedState()

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

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.file-tree-container {
  width: 240px;
  height: 100vh;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: auto;
  padding: 8px;
}

.file-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.file-tree-node-button {
  padding: 0 0;
  margin: 0px;
  font-size: 16px;
  color: #666;
}
</style>
