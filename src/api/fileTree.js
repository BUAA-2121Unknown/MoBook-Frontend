import service from "@/utils/request"
import { fmtForm } from "@/utils/common"

export const createFolder = (data) => {
  const form = [
    'projId',       // 所在项目的 ID
    'itemId',       // 所在文件夹的 ID
    'filename',     // 文件夹名
  ]
  return service({
    url: 'artifact/create/folder',
    method: 'post',
    data: fmtForm(data, form),
  })
}

export const createFile = (data) => {
  const form = [
    'projId',       // 所在项目的 ID
    'itemId',       // 所在文件夹的 ID
    'filename',     // 文件夹名
    'prop',         // 文件类型：1 为文档，2 为原型设计
    'live',          // 是否可共享
    'sibling',
    'content',  //初始内容
  ]
  return service({
    url: 'artifact/create/file',
    method: 'post',
    data: fmtForm(data, form),
  })
}

export const updateItemStatus = (data) => {
  const form = [
    'projId',     // 所在项目的 ID
    'status',     // 更新的状态：0 为正常，1 为移到回收站，2 为完全删除
    'items',      // 一个列表，更新状态的 item 的 ID
  ]
  return service({
    url: 'artifact/update/status',
    method: 'post',
    data: fmtForm(data, form),
  })
}

export const updateItemName = (data) => {
  const form = [
    'projId',       // 所在项目的 ID
    'itemId',       // 更新状态的 item 的 ID
    'filename',     // 更新的文件 / 文件夹的名字
  ]
  return service({
    url: 'artifact/update/filename',
    method: 'post',
    data: fmtForm(data, form),
  })
}

export const moveItem = (data) => {
  const form = [
    'projId',         // 所在项目的 ID
    'folderId',       // 目标文件夹 ID
    'items',          // 一个列表，移动的 item 的 ID
  ]
  return service({
    url: 'artifact/move',
    method: 'post',
    data: fmtForm(data, form),
  })
}

/**
 * @params: { projId: 1, status: 0 }
 */
export const getAllItems = (params) => {
  return service({
    url: 'artifact/item/all',
    method: 'get',
    params: params,
  })
}

/**
 * @params: { projId: 1, itemId: 1 }
 */
export const getOneItem = (params) => {
  return service({
    url: 'artifact/item/get',
    method: 'get',
    params: params,
  })
}

/**
 * @params: { projId: 1, itemId: 1 }
 */
export const getItemVersions = (params) => {
  return service({
    url: 'artifact/item/versions',
    method: 'get',
    params: params,
  })
}
