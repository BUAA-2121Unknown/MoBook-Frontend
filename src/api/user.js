import service from '@/utils/request'
import { fmtForm } from '@/utils/common'

export const register = (data) => {
  const form = [
    'username',
    'email',
    'password'
  ]
  return service({
    url: 'oauth/register',
    method: 'post',
    data: fmtForm(data, form)
  })
}

export const login = (data) => {
  const form = [
    'username',
    'password'
  ]
  return service({
    url: 'oauth/login',
    method: 'post',
    data: fmtForm(data, form)
  })
}

/**
 * @params: { id: 1 }
 */
export const getUserInfo = (params) => {
  return service({
    url: 'user/profile',
    method: 'get',
    params: params
  })
}

/**
 * @data: { file: File }
 */
export const uploadUserAvatar = (data) => {
  return service({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: 'user/avatar/upload',
    method: 'post',
    data: data
  })
}

export const updateUserInfo = (data) => {
  const form = [
    'username',
    'name'
  ]
  return service({
    url: 'user/profile/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

/**
 * TODO
 */
export const changePassword = (data) => {
  return service({
    url: 'user/profile',
    method: 'post',
    data: data
  })
}

export const changeLastOrg = (data) => {
  const form = [
    'orgId',
  ]
  return service({
    url: 'user/lastorg/update',
    method: 'post',
    data: fmtForm(data, form)
  })
}

/**
 * @params: { type: 1 }
 */
export const updateGuide = (params) => {
  return service({
    url: 'user/guide',
    method: 'get',
    params: params
  })
}
