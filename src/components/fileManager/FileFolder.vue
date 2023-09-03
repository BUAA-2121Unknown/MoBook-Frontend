<template>
  <div class="main-wrapper">
    <div class="header-wrapper">
      <div class="breadcrumb-wrapper" id="tour-file-step-1">
        <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb-item-wrapper">
          <el-breadcrumb-item v-for="item in pathInfo" :key="item.id" @click="breadClickHandler(item.id)"
            class="breadcrumb-item-wrapper">
            <drop @drop="breadDropHandler(item.id, ...arguments)">
              <span class="breadcrumb-item">
                {{ item.data.name }}
              </span>
            </drop>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div>
        <el-button type="primary" icon="DocumentAdd" @click="addItem(2, props.itemProperty)"></el-button>
        <el-button type="primary" icon="FolderAdd" @click="addItem(1, 0)"></el-button>
      </div>
    </div>

    <div class="file-top-wrapper">
      <el-row :gutter="12">
        <el-col :span="16">
          <span class="name">名称</span>
        </el-col>
        <el-col :span="4">
          <span class="creator">创建者</span>
        </el-col>
        <el-col :span="4">
          <span class="last-modify-time">上次更新时间</span>
        </el-col>
      </el-row>
    </div>

    <div v-for="item in dataSource" :key="item.id">
      <!-- <div @dblclick="doubleClickHandler(item.id, item)"> -->
      <drag @drag="dragHandler(item.id, ...arguments)" id="tour-file-step-0">
        <!-- 可 drop -->
        <!-- TODO: drag 时设置自己为不可 drop-->
        <drop v-if="item.data.type === 1" @drop="dropHandler(item.id, ...arguments)">
          <FileCard :item="item" />
        </drop>
        <!-- 不可 drop -->
        <FileCard v-else :item="item" />
      </drag>
      <!-- </div> -->
    </div>
  </div>


  <Tour
    :steps="tourSteps"
    mask
    arrow
    v-model:show="showTour"
    v-model:current="tourCurrent"
    :padding="{ x: 10, y: 6 }"
  />

</template>

<script>
export default {
  name: 'FileFolder',
}
</script>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import FileCard from './FileCard.vue'
import { getAllItems, moveItem, createFile, createFolder } from '@/api/fileTree'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import emitter from '@/utils/emitter'
import { createNewItem } from './helper'
import { useRouter } from 'vue-router'


import { updateGuide } from '@/api/user'
import { Tour } from "vue3-quick-tour"
const showTour = ref(false)
const tourCurrent = ref(0)
const tourSteps = [
  {
    el: () => document.getElementById("tour-file-step-0"),
    title: "文件列表",
    message: "在这里你可以拖动文件到文件夹，双击打开文件或文件夹，右键可以重命名或删除文件",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "top",
  },
  {
    el: () => document.getElementById("tour-file-step-1"),
    title: "文件路径",
    message: "这是当前的文件路径，点击可以返回上级目录，或将文件拖拽至此处移动文件",
    mask: {
      color: "rgba(0, 0, 0, .8)",
    },
    placement: "right",
  },
]


const props = defineProps({
  itemProperty: {
    type: Number,
    default: () => 1,
  },
})

const userStore = useUserStore()
const router = useRouter()

const dataSource = ref([])
const dataSourceCopy = ref([])
const root = ref()
const path = ref([])
const pathInfo = ref([])

const movingItemId = ref()

const GetAllItems = async () => {
  try {
    const res = await getAllItems({
      projId: userStore.projectId,
      // TODO: 获取的类型？文档 / 原型设计
      status: 0,
    })
    console.log('GET_ALL', res)
    if (res.meta.status == 0) {
      root.value = res.data
      dataSource.value = res.data.children || []
      dataSourceCopy.value = dataSource.value
    } else {
      dataSource.value = testData
      dataSourceCopy.value = dataSource.value
      console.log(res)
    }
  } catch (e) {
    dataSource.value = testData
    console.log(e)
  }
}

onMounted(async () => {
  // TODO: For Test
  dataSource.value = testData
  dataSourceCopy.value = testData
  await GetAllItems()
  console.log(root.value)
  path.value.push(root?.value?.id || 1)
  pathInfo.value.push(root?.value || testRoot)
  console.log(dataSource.value)

  // 开启新手指引 TODO：判断权限位
  const res = await updateGuide({ type: 0 })
  console.log(res)
  if (res.meta.status == 0) {
    // 开启新手指引 TODO：判断权限位
    showTour.value = !res.data.value
    tourCurrent.value = 0
  }
})

const updatePath = async (op, itemId = 0) => {
  if (op === 1) {
    path.value.push(itemId)
    const nxt = dataSource.value.find(item => item.id === itemId)
    console.log(nxt)
    pathInfo.value.push(nxt)
  } else if (op < 0) {
    path.value.splice(op)
    pathInfo.value.splice(op)
  }
  await GetAllItems()
  for (let i = 1; i < path.value.length; i++) {
    const item = dataSource.value.find(item => item.id === path.value[i])
    console.log(dataSource.value, item)
    dataSource.value = item.children
  }
  console.log(dataSource.value)
  console.log(pathInfo.value)
}

const move = async (itemId, to) => {
  ElMessageBox.confirm('确认移动？', '确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await moveItem({
        'projId': userStore.projectId,
        'folderId': to,
        'items': [itemId],
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
        console.log(res)
      }
      updatePath(0)
    } catch (e) {
      console.log(e)
    }
  }).catch(() => {
    console.log('cancel')
  })
}

const addItem = async (type, prop) => {
  const newItem = createNewItem(type, prop)
  dataSource.value.push(newItem)
  dataSource.value = [...dataSource.value]
  if (type === 1) {
    const res = await createFolder({
      'projId': userStore.projectId,
      'itemId': path.value[path.value.length - 1],
      'filename': newItem.data.name,
    })
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '创建成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: '创建失败',
      })
      console.log(res)
    }
  } else if (type === 2) {
    const res = await createFile({
      'projId': userStore.projectId,
      'itemId': path.value[path.value.length - 1],
      'filename': newItem.data.name,
      'prop': newItem.data.prop,
      'live': true,
      'sibling': false,
      'content': '',
    })
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '创建成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: '创建失败',
      })
      console.log(res)
    }
  }
  updatePath(0)
}

const dragHandler = (itemId, transferData, nativeEvent) => {
  // console.log('drag: myArg', itemId)
  // console.log(transferData, nativeEvent)
  movingItemId.value = itemId
  console.log(movingItemId.value)
}

const dropHandler = async (itemId, transferData, nativeEvent) => {
  console.log('drop: itemId', itemId)
  await move(movingItemId.value, itemId)
}

const breadDropHandler = async (itemId, transferData, nativeEvent) => {
  console.log('breadDrop: itemId', itemId)
  await move(movingItemId.value, itemId)
}

const breadClickHandler = async (itemId) => {
  console.log('breadClick: itemId', itemId)
  const index = path.value.findIndex(item => item === itemId)
  await updatePath(-(path.value.length - 1 - index))
}

const doubleClickHandler = async (itemId, item) => {
  if (item.data.type === 2) {
    console.log('open file', itemId)
    if (item.data.prop == 2 || item.data.prop == 3) {
      router.push({
        path: "/prototype",
        query: {
          itemId: itemId,
        },
      });
    }
    else if (item.data.prop == 1) {
      router.push({
        path: "/doc",
        query: {
          doc_id: itemId
        }
      })
    }
    return
  }
  console.log('double click', itemId)
  await updatePath(1, itemId)
}

emitter.on('openFileOrFolder', async (data) => {
  await doubleClickHandler(data.itemId, data.item)
})

emitter.on('updatePath', async (data) => {
  await updatePath(data.op, data?.itemId)
})

const testData = [
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
  },
  {
    "data": {
      "name": "File 3",
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
    "id": 7
  }
]

const testRoot = {
  "data": {
    "name": "根目录",
    "extension": "",
    "type": 0,
    "prop": 0,
    "created": "2023-08-30 22:57:05",
    "updated": "2023-08-30 22:57:05",
    "status": 0,
    "live": false,
    "version": 1,
    "proj_id": 2,
    "org_id": 1,
    "file_id": 0
  },
  "id": 1,
  "children": testData,
}
</script>

<style scoped lang="scss">
.main-wrapper {}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.breadcrumb-wrapper {
  display: flex;
  align-items: center;
}

.breadcrumb-item-wrapper {
  font-size: 20px;
}

.breadcrumb-item {
  font-size: 20px;
}

.breadcrumb-item:hover {
  cursor: pointer;
}

.file-top-wrapper {
  padding: 5px 10px;
  border-bottom: 1px solid #dddddd;
  margin-bottom: 5px;

  .name {
    color: #888888;
    padding-left: 48px;
  }

  .creator {
    color: #888888;

  }

  .last-modify-time {
    color: #888888;

  }
}

.draggable-file {
  cursor: move;
}
</style>