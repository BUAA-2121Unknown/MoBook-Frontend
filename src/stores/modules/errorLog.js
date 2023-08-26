import { defineStore } from 'pinia'
import { formatToDateTime } from '@/utils/date'
import pinia from '@/stores'
import { ErrorTypeEnum } from '@/enums/errorEnum'
import settings from '@/settings/basic'

export const useErrorLogStore = defineStore({
  id: 'app-error-log',
  state: () => ({
    errorLogInfoList: null,
    errorLogListCount: 0,
  }),

  getters: {
    getErrorLogInfoList(state) {
      return state.errorLogInfoList || []
    },
    getErrorLogListCount(state) {
      return state.errorLogListCount
    },
  },

  actions: {
    addErrorLogInfo(info) {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      }
      this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])]
      this.errorLogListCount += 1
    },

    setErrorLogListCount(count) {
      this.errorLogListCount = count
    },

    addAjaxErrorInfo(error) {
      if (!settings.useErrorHandle) {
        return
      }
      const errInfo = {
        message: error.message,
        type: ErrorTypeEnum.AJAX,
      }
      if (error.response) {
        const {
          config: { url = '', data: params = '', method = 'get', headers = {} } = {},
          data = {},
        } = error.response
        errInfo.url = url
        errInfo.name = 'Ajax Error!'
        errInfo.file = '-'
        errInfo.stack = JSON.stringify(data)
        errInfo.detail = JSON.stringify({ params, method, headers })
      }
      this.addErrorLogInfo(errInfo)
    },
  },
})

// Need to be used outside the setup
export function useErrorLogStoreWithOut() {
  return useErrorLogStore(pinia)
}
