import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo } from '@/api/user'
import { getOrgInfo, getAllOrgs } from '@/api/org'
// import { useRouterStore } from '@/stores/modules/router'
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
      email: '',
      name: '',
      avatarUrl: '',
      sideMode: window.localStorage.getItem('sideMode') || 'dark',
      activeColor: 'var(--el-color-primary)',
      baseColor: '#fff'
    },
    token: window.localStorage.getItem('token') || '',
    projectId: -1,
    orgId: -1,
    orgInfo: {},
    nameInOrg: '',
    auth: '',
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
      if (res.data.meta.status == 0) {
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

    setOrgId(val) {
      this.orgId = val
    },

    setOrgInfo(val) {
      this.orgInfo = val
    },

    setProjectId(val) {
      this.projectId = val
    },

    setNameInOrg(val) {
      this.nameInOrg = val
    },

    setAuth(val) {
      this.auth = val
    },

    resetUserInfo(value = {}) {
      this.userInfo = {
        ...this.userInfo,
        ...value
      }
    },

    async loginIn(loginInfo) {
      console.log('login')
      console.log(this.userInfo)
      console.log(this.orgId)
      try {
        const res = await login(loginInfo)
        console.log(res)
        if (res.meta.status == 0) {
          this.resetUserInfo(res.data.user)
          this.setToken(res.data.token)

          const lastOrg = res.data.lastOrg
          if (lastOrg) {
            this.setOrgId(lastOrg.lastOrg.org.id)
            this.setOrgInfo(lastOrg.lastOrg.org)
            this.setAuth(lastOrg.lastOrg.auth.auth)
            this.setNameInOrg(lastOrg.lastOrg.auth.nickname)
          } else {
            this.setOrgId(-1)
            this.setOrgInfo({})
          }

          const isWin = ref(/windows/i.test(navigator.userAgent))
          if (isWin.value) {
            window.localStorage.setItem('osType', 'WIN')
          } else {
            window.localStorage.setItem('osType', 'MAC')
          }
        } else {
          console.log(res)
        }
        return res
      } catch (e) {
        console.log(e)
      }
    },

    async logout() {
      this.clearStorage()
      router.push({ name: 'login', replace: true })
    },

    async clearStorage() {
      this.token = ''
      sessionStorage.clear()
      console.log('before', localStorage)
      localStorage.clear()
      console.log('after', localStorage)
    },

    async changeSideMode(data) {
      this.userInfo.sideMode = data
      ElMessage({
        type: 'success',
        message: '设置成功'
      })
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
