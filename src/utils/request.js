import axios from 'axios'
import siteSetting from '@/settings/siteSetting'
import emitter from '@/utils/emitter'

const service = axios.create({
  baseURL: siteSetting.apiURL,
  timeout: 10000,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
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
    return config
  },
  error => {
    if (!error.config.doNotShowLoading) {
      closeLoading()
    }
    return error
  },
)

service.interceptors.response.use(
  response => {
    if (!response.config.doNotShowLoading) {
      closeLoading()
    }
    return response
  },
  error => {
    if (!error.config.doNotShowLoading) {
      closeLoading()
    }
    return error
  },
)

export default service
