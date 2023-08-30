import service from '@/utils/request'
import { fmtForm } from '@/utils/common'

export const createOrg = (data) => {
  const form = [
    'name',
    'description',
  ]
  return service({
    url: 'org/create',
    method: 'post',
    data: fmtForm(data, form)
  })
}

/**
 * @data: { "organizations": [1, 2, 3] }
 */
export const deleteOrg = (data) => {
  return service({
    url: 'org/cancel',
    method: 'post',
    data: data
  })
}

/**
 * @data: { file: File, id: 1 }
 */
export const uploadOrgAvatar = (data) => {
  console.log(data)
  return service({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: 'org/avatar/upload',
    method: 'post',
    data: data
  })
}

export const updateOrgInfo = (data) => {
  const form = [
    'id',
    'name',
    'description',
  ]
  return service({
    url: 'org/profile/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

/**
 * @params: { id: 1 }
 */
export const getOrgInfo = (params) => {
  return service({
    url: 'org/profile',
    method: 'get',
    params: params
  })
}

export const updateOrgMemberInfo = (data) => {
  const form = [
    'orgId',
    'userId',
    'profile',
    'auth',
  ]
  return service({
    url: 'org/member/profile/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

/**
 * @params: { orgId: 1 }
 */
export const getOrgAllMemberInfo = (params) => {
  return service({
    url: 'org/members',
    method: 'get',
    params: params
  })
}

export const getInviteLink = (data) => {
  const form = [
    'orgId',
    'expires',
    'review',
  ]
  return service({
    url: 'org/member/auth/invite',
    method: 'post',
    data: fmtForm(data, form)
  })
}

export const getOrgInfoByToken = (params) => {
  return service({
    url: 'org/member/auth/invitations',
    method: 'get',
    params: params
  })
}

export const activateInvite = (data) => {
  const form = [
    'token',
  ]
  return service({
    url: 'org/member/auth/activate',
    method: 'post',
    data: fmtForm(data, form)
  })
}

export const getAllOrgs = () => {
  return service({
    url: 'org/all',
    method: 'get',
  })
}
