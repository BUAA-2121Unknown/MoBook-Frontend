<template>
  <div class="file-card-container" @contextmenu.prevent="rightClickHandler">
    <el-dropdown trigger="contextmenu" class="dropdown-wrapper" @visible-change="handleVisibleChange">
      <div class="file-wrapper" @dblclick="openItem(props.item?.id, props.item)">
        <el-row :gutter="12">
          <el-col :span="16" class="col">
            <el-icon v-if="props.item.data.type === 1" class="icon">
              <svg t="1693643378169" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1490" width="200" height="200"><path d="M855.04 385.024q19.456 2.048 38.912 10.24t33.792 23.04 21.504 37.376 2.048 54.272q-2.048 8.192-8.192 40.448t-14.336 74.24-18.432 86.528-19.456 76.288q-5.12 18.432-14.848 37.888t-25.088 35.328-36.864 26.112-51.2 10.24l-567.296 0q-21.504 0-44.544-9.216t-42.496-26.112-31.744-40.96-12.288-53.76l0-439.296q0-62.464 33.792-97.792t95.232-35.328l503.808 0q22.528 0 46.592 8.704t43.52 24.064 31.744 35.84 12.288 44.032l0 11.264-53.248 0q-40.96 0-95.744-0.512t-116.736-0.512-115.712-0.512-92.672-0.512l-47.104 0q-26.624 0-41.472 16.896t-23.04 44.544q-8.192 29.696-18.432 62.976t-18.432 61.952q-10.24 33.792-20.48 65.536-2.048 8.192-2.048 13.312 0 17.408 11.776 29.184t29.184 11.776q31.744 0 43.008-39.936l54.272-198.656q133.12 1.024 243.712 1.024l286.72 0z" fill="#F5A623" p-id="1491"></path></svg>
            </el-icon>
            <el-icon v-if="props.item.data.type === 2 && props.item.data.prop === 1" class="icon">
              <svg t="1693643460167" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2525" width="200" height="200"><path d="M823.296 60.416q65.536 0 99.328 38.4t33.792 93.696l0 543.744q0 25.6-21.504 46.08l-171.008 163.84q-13.312 11.264-22.528 14.336t-23.552 3.072l-459.776 0q-23.552 0-47.104-9.728t-41.984-27.648-30.208-43.008-11.776-55.808l0-634.88q0-60.416 33.28-96.256t94.72-35.84l568.32 0zM608.256 702.464q13.312 0 22.528-9.216t9.216-22.528q0-14.336-9.216-23.04t-22.528-8.704l-320.512 0q-13.312 0-22.528 8.704t-9.216 23.04q0 13.312 9.216 22.528t22.528 9.216l320.512 0zM736.256 509.952q13.312 0 22.528-9.216t9.216-22.528-9.216-22.528-22.528-9.216l-448.512 0q-13.312 0-22.528 9.216t-9.216 22.528 9.216 22.528 22.528 9.216l448.512 0zM799.744 318.464q13.312 0 22.528-9.216t9.216-23.552q0-13.312-9.216-22.528t-22.528-9.216l-512 0q-13.312 0-22.528 9.216t-9.216 22.528q0 14.336 9.216 23.552t22.528 9.216l512 0z" p-id="2526" fill="#1296db"></path></svg>
            </el-icon>
            <el-icon v-if="props.item.data.type === 2 && (props.item.data.prop === 2 || props.item.data.prop === 3)" class="icon">
              <svg t="1693680370706" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13765" width="200" height="200"><path d="M960 0 64 0C28.624 0 0 28.624 0 64l0 896c0 35.376 28.624 64 64 64l896 0c35.376 0 64-28.624 64-64L1024 64C1024 28.624 995.376 0 960 0zM992 960c0 17.664-14.336 32-32 32L64 992c-17.664 0-32-14.336-32-32L32 224l960 0L992 960zM992 192 32 192 32 64c0-17.664 14.336-32 32-32l896 0c17.664 0 32 14.336 32 32L992 192z" fill="#d4237a" p-id="13766"></path><path d="M112 64C85.488 64 64 85.488 64 112s21.488 48 48 48 48-21.488 48-48S138.512 64 112 64zM112 128C103.152 128 96 120.848 96 112s7.152-16 16-16 16 7.152 16 16S120.848 128 112 128z" fill="#d4237a" p-id="13767"></path><path d="M528 64 240 64c-26.512 0-48 21.488-48 48s21.488 48 48 48l288 0c26.512 0 48-21.488 48-48S554.512 64 528 64zM528 128 240 128c-8.848 0-16-7.152-16-16s7.152-16 16-16l288 0c8.848 0 16 7.152 16 16S536.848 128 528 128z" fill="#d4237a" p-id="13768"></path><path d="M176 384l288 0c8.848 0 16-7.152 16-16s-7.152-16-16-16L176 352c-8.848 0-16 7.152-16 16S167.152 384 176 384z" fill="#d4237a" p-id="13769"></path><path d="M176 480l288 0c8.848 0 16-7.152 16-16s-7.152-16-16-16L176 448c-8.848 0-16 7.152-16 16S167.152 480 176 480z" fill="#d4237a" p-id="13770"></path><path d="M176 576l288 0c8.848 0 16-7.152 16-16s-7.152-16-16-16L176 544c-8.848 0-16 7.152-16 16S167.152 576 176 576z" fill="#d4237a" p-id="13771"></path><path d="M176 672l288 0c8.848 0 16-7.152 16-16s-7.152-16-16-16L176 640c-8.848 0-16 7.152-16 16S167.152 672 176 672z" fill="#d4237a" p-id="13772"></path><path d="M176 768l672 0c8.848 0 16-7.152 16-16s-7.152-16-16-16L176 736c-8.848 0-16 7.152-16 16S167.152 768 176 768z" fill="#d4237a" p-id="13773"></path><path d="M176 864l672 0c8.848 0 16-7.152 16-16s-7.152-16-16-16L176 832c-8.848 0-16 7.152-16 16S167.152 864 176 864z" fill="#d4237a" p-id="13774"></path><path d="M560 672l288 0c8.848 0 16-7.152 16-16L864 368c0-8.848-7.152-16-16-16L560 352c-8.848 0-16 7.152-16 16l0 288C544 664.848 551.152 672 560 672zM576 384l256 0 0 256L576 640 576 384z" fill="#d4237a" p-id="13775"></path></svg>
            </el-icon>
            <!-- 修改文件名 -->
            <span v-if="props.item?.editing">
              <el-input
                v-model="editingName"
                ref="editingRef"
                @blur="handleEditComplete(props.item, editingName)"
                @keydown.enter.stop="$event.target.blur()"
              />
            </span>
            <!-- 正常显示 -->
            <span v-else class="filename">
              {{ props.item?.data?.name || '文件名' }}
            </span>
          </el-col>
          <el-col :span="4" class="col">
            <span class="creator">
              {{ props.item?.data?.creator?.name || '创建者' }}
            </span>
          </el-col>
          <el-col :span="4" class="col">
            <span class="last-modify-time">
              {{ props.item?.data?.updated || '2000-01-01 00:00:00' }}
            </span>
          </el-col>
        </el-row>
      </div>

      <template #dropdown>
        <context-menu
          v-model:show="contextMenuVisible"
          :options="optionsComponent"
        >
          <context-menu-item label="打开" @click="openItem(props.item?.id, props.item)">
            <template #icon>
            </template>
          </context-menu-item>

          <context-menu-sperator />

          <context-menu-item label="删除" @click="deleteItem(props.item?.id, props.item)">
            <template #icon>
              <el-icon style="width: 16px; height: 16px;"><Delete /></el-icon>
            </template>
          </context-menu-item>

          <context-menu-item label="重命名" @click="renameItem(props.item?.id, props.item)">
            <template #icon>
              <el-icon style="width: 16px; height: 16px;"><Edit /></el-icon>
            </template>
          </context-menu-item>
        </context-menu>
      </template>

    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'FileCard',
}
</script>

<script setup>
import { defineProps, ref, nextTick, watch } from 'vue'
import { Plus, CirclePlusFilled, CirclePlus } from '@element-plus/icons-vue'
import emitter from '@/utils/emitter'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateItemStatus, updateItemName } from '@/api/fileTree'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const editingRef = ref(null)
const editingName = ref('')
const editingStatus = ref('')

const contextMenuVisible = ref(false)
const optionsComponent = {
  zIndex: 1003,
  minWidth: 100,
  x: 500,
  y: 200
}

watch(optionsComponent, () => {})

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const rightClickHandler = (evt) => {
  optionsComponent.x = evt.clientX
  optionsComponent.y = evt.clientY
}

const handleVisibleChange = (visible) => {
  contextMenuVisible.value = visible
  if (!visible) {
    if (editingRef.value) {
      setTimeout(() => {
        editingRef.value.focus()
        console.log('focus')
      }, 150)
    }
  }
}

const openItem = async (itemId, item) => {
  await emitter.emit('openFileOrFolder', { itemId: itemId, item: item })
}

const deleteItem = async (itemId, item) => {
  ElMessageBox.confirm('确认删除？', '确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await updateItemStatus({
        'projId': userStore.projectId,
        'status': 1,
        'items': [itemId],
      })
      if (res.meta.status == 0) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
        console.log(res)
      }
      // 更新文件树
      await emitter.emit('updatePath', { op: 0 })
    } catch(e) {
      console.log(e)
    }
  }).catch(() => {
    console.log('Cancelled');
  })

}

const renameItem = async (itemId, item) => {
  item.editing = true
  editingName.value = item.data.name

  while (!editingRef.value) {
    await nextTick()
  }
}

const handleEditComplete = async (item, name) => {
  item.editing = false
  if (!name) {
    ElMessage({
      type: 'error',
      message: '名字不可为空',
    })
    return
  }

  try {
    const res = await updateItemName({
      'projId': userStore.projectId,
      'itemId': item.id,
      'filename': name,
    })
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败',
      })
      console.log(res)
    }
  } catch(e) {
    console.log(e)
  }

  await emitter.emit('updatePath', { op: 0 })
  editingStatus.value = ''
}
</script>

<style scoped lang="scss">
.file-card-container {
  padding: 4px 10px;
  border-bottom: 2px solid #dddddd;
  border-radius: 4px;
  background-color: #eeeeee;
  margin-bottom: 1px;
}

.file-card-container:hover {
  cursor: pointer;
}

.dropdown-wrapper {
  width: 100%;
}

.file-wrapper {
  width: 100%;
  height: 100%;

  .col {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  .filename {
    font-size: 16px;
    color: #606266;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .creator {
    font-size: 14px;
    color: #909399;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .last-modify-time {
    font-size: 14px;
    color: #909399;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
