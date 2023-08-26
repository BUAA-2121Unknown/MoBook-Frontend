import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo } from '@/api/user'
// import { useRouterStore } from '@/store/modules/router'
import { ElLoading, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import router from '@/router/index'

export const useUserStore = defineStore({
  id: 'user', 
  persist: true,
  state: () => ({
    userInfo: {
      id: '',
      username: '',
      name: '',
      avatarUrl: '',
      authority: {},
      sideMode: 'dark',
      activeColor: 'var(--el-color-primary)',
      baseColor: '#fff'
    },
    token: window.localStorage.getItem('token') || '',
  }),

  getters: {
    mode() { return this.userInfo.sideMode },

    sideMode() {
      if (this.userInfo.sideMode === 'dark') {
        return '#191a23'
      } else if (this.userInfo.sideMode === 'light') {
        return '#fff'
      } else {
        return this.userInfo.sideMode
      }
    },

    baseColor() {
      if (this.userInfo.sideMode === 'dark') {
        return '#fff'
      } else if (this.userInfo.sideMode === 'light') {
        return '#191a23'
      } else {
        return this.userInfo.baseColor
      }
    },

    activeColor() { return 'var(--el-color-primary)' },

    async GetUserInfo() {
      const res = await getUserInfo()
      if (res.code === 0) {
        this.setUserInfo(res.data.userInfo)
      }
      return res
    },
  },

  actions: {
    setUserInfo(val) {
      this.userInfo = val
    },

    setToken(val) {
      this.token = val
    },
  
    resetUserInfo(value = {}) {
      this.userInfo = {
        ...this.userInfo,
        ...value
      }
    },

    async loginIn(loginInfo) {
      try {
        const res = await login(loginInfo)
        if (res.meta.status == 0) {
          this.resetUserInfo(res.data.user)
          this.setToken(res.data.token)
  
          const isWin = ref(/windows/i.test(navigator.userAgent))
          if (isWin.value) {
            window.localStorage.setItem('osType', 'WIN')
          } else {
            window.localStorage.setItem('osType', 'MAC')
          }
          return res
        }
      } catch (e) {
      }
    },

    async logout() {
      this.clearStorage()
      router.push({ name: 'login', replace: true })
    },

    async clearStorage() {
      this.token = ''
      sessionStorage.clear()
      localStorage.clear()
    },

    async changeSideMode(data) {
      const res = await setSelfInfo({ sideMode: data })
      if (res.code === 0) {
        this.userInfo.sideMode = data
        ElMessage({
          type: 'success',
          message: '设置成功'
        })
      }
    },

    watchTokenChange() {
      this.$pinia.watch(
        (state) => state.token,
        (newToken) => {
          window.localStorage.setItem('token', newToken)
        }
      );
    },
  },
})