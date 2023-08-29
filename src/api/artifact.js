import service from '@/utils/request';
import { fmtForm } from '@/utils/common'

// 更新项目基础字段
export const updateProjectInfo = (data) => {
  const form = [
    'projId',
    'name',
    'description'
  ]
  return service({
    url: 'proj/profile/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 更新原型设计基础字段
export const updatePrototypeInfo = (data) => {
  const form = [
    'projId',
    'name',
    'description'
  ]
  return service({
    url: 'proj/profile/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 创建原型设计
export const createPrototype = (data) => {
  const form = [
    'projId',
    'name',
    'type',
    'live',
  ]
  return service({
    url: 'proj/artifact/create',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 更新原型设计状态
export const updatePrototypeStatus = (data) => {
  const form = [
    'status',
    'artifacts',
  ]
  return service({
    url: 'proj/artifact/status/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 获取原型设计
export const getPrototype = (params) => {
  return service({
    url: 'proj/artifact/file/download',
    method: 'get',
    params: params,
  })
}
// 获取原型设计列表
export const getPrototypeList = (params) => {
  return service({
    url: 'proj/artifacts',
    method: 'get',
    params: params,
  })
}
// 保存原型设计
export const savePrototype = (data) => {
  const form = [
    'artId',
    'file',
  ]
  return service({
    url: 'proj/artifact/file/upload',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 创建文档
export const createDoc = (data) => {
  const form = [
    'projId',
    'name',
    'type',
    'live',
  ]
  return service({
    url: 'proj/artifact/create',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 更新文档状态
export const updateDocStatus = (data) => {
  const form = [
    'status',
    'artifacts',
  ]
  return service({
    url: 'proj/artifact/status/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}
// 获取文档
export const getDoc = (params) => {
  return service({
    url: 'proj/artifact/profile',
    method: 'get',
    params: params
  })
}

// 获取文档列表
export const getDocList = (params) => {
  return service({
    url: 'proj/artifacts',
    method: 'get',
    params: params
  })
}

// 保存文档
export const saveDoc = (data) => {
  const form = [
    'artId',
    'file',
  ]
  return service({
    url: 'proj/artifact/file/upload',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// @ 人
export const mention = (data) => {
  const form = [
    'projId',
    'artId',
    'users'
  ]
  return service({
    url: 'notif/send/artat',
    method: 'post',
    data: fmtForm(data, form)
  })
}
