import { useUserStore } from '@/stores/modules/user'

let increasingId = 114514191
let fileID = 1
let folderID = 1

const userStore = useUserStore()

const getFormatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const createNewItem = (type, prop) => {
  return {
    "data": {
      "name": (type === 1 ? "新建文件夹" : "新建文件") + (type === 1 ? folderID++ : fileID++),
      "extension": "",
      "type": type,
      "prop": prop,
      "created": getFormatDate(),
      "updated": getFormatDate(),
      "status": 0,
      "live": false,
      "version": 1,
      "proj_id": userStore.projectId,
      "org_id": 1,
      "file_id": 0,
      "creator": {
        "name": userStore.nameInOrg,
      }
    },
    "id": increasingId++,
    "children": []
  }
}
