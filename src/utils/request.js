import axios from 'axios'
import emitter from '@/utils/emitter'
import settings from '@/settings/basic'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

const service = axios.create({
  baseURL: settings.apiURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let acitveAxios = 0
let timer

const showLoading = () => {
  acitveAxios++
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (acitveAxios > 0) {
      emitter.emit('showLoading')
    }
  }, 500)
}

const closeLoading = () => {
  acitveAxios--
  if (acitveAxios <= 0) {
    clearTimeout(timer)
    emitter.emit('closeLoading')
  }
}

service.interceptors.request.use(
  config => {
    if (!config.doNotShowLoading) {
      showLoading()
    }
    const userStore = useUserStore()
    config.headers.Authorization = userStore.token
    return config
  },
  error => {
    if (!error.config.doNotShowLoading) {
      closeLoading()
    }
    ElMessage({
      showClose: true,
      message: error,
      type: 'error'
    })
    return error
  },
)

service.interceptors.response.use(
  response => {
    if (!response.config.doNotShowLoading) {
      closeLoading()
    }
    const userStore = useUserStore()
    if (response.headers['new-token']) {
      userStore.setToken(response.headers['new-token'])
    }
    if (response.data.meta.status == 0 || response.headers.success === 'true') {
      if (response.headers.msg) {
        response.data.msg = decodeURI(response.headers.msg)
      }
      return response.data
    } else {
      ElMessage({
        showClose: true,
        message: response.data.meta.msg || decodeURI(response.headers.msg),
        type: 'error'
      })
      if (response.data.data && response.data.data.reload) {
        userStore.token = ''
        localStorage.clear()
        router.push({ name: 'login', replace: true })
      }
      return response.data ? response.data : response
    }
  },
  error => {
    if (!error.config.doNotShowLoading) {
      closeLoading()
    }
    return error
  },
)

export const isError = (response) => {
  return response.status < 200 || response.status >= 300;
}

export default service
