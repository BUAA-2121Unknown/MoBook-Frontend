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

export const getUserInfo = (params) => {
  return service({
    url: 'user/profile',
    method: 'get',
    params: params
  })
}
