import service from '@/utils/request';
import { fmtForm } from '@/utils/common'

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
