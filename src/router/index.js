import { createRouter, createWebHistory } from 'vue-router'
import routers from './routers/index'
import { setTitle } from '@/utils/common.js'
import { useUserStore } from '@/stores/modules/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  to.meta.matched = [...to.matched]

  if (to.meta.title) {
    setTitle(to.meta.title)
  }
  const userStore = useUserStore()
  const token = userStore.token

  if (to.path !== '/login' && !token) {
    return next('/login')
  }

  if (to.path === '/login' && token) {
    return next('/')
  }

  // TODO: other cases

  next()
})

router.afterEach((to, from, next) => {
  document.getElementsByClassName('main-cont main-right')[0]?.scrollTo(0, 0)
  NProgress.done()
})

router.onError(() => {
  NProgress.remove()
})

export default router
