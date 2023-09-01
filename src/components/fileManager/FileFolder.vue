<template>
  <div class="main-wrapper">
    <!-- <VueDraggableNext class="dragArea list-group w-full" :list="dataSource" @change="log">
      <div
        class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
        v-for="element in dataSource"
        :key="element.id"
      >
        {{ element.data.name }}
      </div>
    </VueDraggableNext>

    <el-table
      :data="dataSource"
      @row-dragend="handleDrop"
    >
      <el-column label="文件名">
        <template slot-scope="{ row, $index }">
          <div v-draggable="row" @dragstart="handleDragStart(row, $index)">
            {{ row }}
          </div>
        </template>
      </el-column>

      <el-column label="修改时间">
        <template slot-scope="{ row, $index }">
            {{ row }}
        </template>
      </el-column>
    </el-table> -->

    <!-- <table>
      <tr>
        <th>文件名</th>
        <th>修改时间</th>
      </tr>

      <tr
        v-for="element in dataSource"
        class="draggable-file"
        draggable="true"
        :key="element.id"
      >
        <td>{{ element.data.name }}</td>
        <td>{{ element.data.updated }}</td>
      </tr>

    </table> -->

    <draggable 
      v-model="dataSource" 
      :sort="false"
      @start="startHandler" 
      @choose="startHandler" 
      @end="endHandler" 
      @update="updateHandler"
      @change="changeHandler"
      :move="moveHandler"
      item-key="id"
    >
      <template #item="{element}">
        <FileCard
          :name="element.data.name"
          creator="创建者"
          :updatedTime="element.data.updated"
        />
      </template>
    </draggable>

    <!-- <div v-for="element in dataSource" :key="element.id">
      <drag
        @drag="dragHandler('foo', ...arguments)"
      >
        <drop
          @drop="dropHandler('foo', ...arguments)"
        >
          <FileCard
            :name="element.data.name"
            creator="创建者"
            :updatedTime="element.data.updated"
          />
        </drop>
      </drag>
    </div> -->

  </div>
</template>

<script>
export default {
  name: 'FileFolder',
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import draggable from 'vuedraggable'
import FileCard from './FileCard.vue'

const userStore = useUserStore()

const dataSource = ref([])

onMounted(() => {
  dataSource.value = testData
  console.log(dataSource.value)
})

const dragHandler = (myArg, transferData, nativeEvent) => {
  // console.log(transferData, nativeEvent)
}

const dropHandler = (myArg, transferData, nativeEvent) => {
  console.log(transferData)
  console.log(nativeEvent)
}

const startHandler = (evt) => {
  console.log(evt)
}

const endHandler = (evt) => {
  console.log(evt)
  console.log(evt.to)
  console.log(evt.item)
  console.log(evt.target.__draggable_component__.context)
}

const updateHandler = (newItems, movedItem, fromIndex, toIndex) => {
  console.log(newItems, movedItem, fromIndex, toIndex)
}

const changeHandler = (evt) => {
  console.log(evt)
}

const moveHandler = (evt) => {
  console.log(evt)
}



const log = (event) => {
  console.log(event)
}

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
</script>

<style scoped>
.main-wrapper {

}

.draggable-file {
  cursor: move;
}
</style>