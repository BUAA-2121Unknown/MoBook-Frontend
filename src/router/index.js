import { createRouter, createWebHistory } from 'vue-router'
import routers from './routers/index'
import { setTitle } from '@/utils/common.js'
import { useUserStore } from '@/stores/modules/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { resetMenuList } from '@/utils/common'
import { menuList, projectMenuList } from '@/enums/menuEnum'


const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

const projectMenuRouter = [
  '/project/info',
  '/project/doc',
  '/project/design',
]

const isProjectRouter = (router) => {
  for (let i = 0; i < projectMenuRouter.length; i++) {
    if (router.startsWith(projectMenuRouter[i])) {
      return true
    }
  }
  return false
}

router.beforeEach((to, from, next) => {
  NProgress.start()

  to.meta.matched = [...to.matched]

  if (to.meta.title) {
    setTitle(to.meta.title)
  }
  const userStore = useUserStore()
  const token = userStore.token

  console.log(to.path)
  if (isProjectRouter(to.path)) {
    resetMenuList(projectMenuList)
  } else {
    resetMenuList(menuList)
  }

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
