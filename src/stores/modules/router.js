import { defineStore } from 'pinia'
import { menuList } from '@/enums/menuEnum'
import { routerHandle } from '@/utils/handler/router'

export const useRouterStore = defineStore({
  id: 'router', 
  state: () => ({
    menuRouter: menuList,
    keepAliveRouter: [],
    routeMap: ({}),
  }),

  getters: {
  },

  actions: {
    formatRouter (routes, routeMap, parent) {
      routes && routes.forEach(item => {
        item.parent = parent
        item.meta.hidden = item.hidden
        if (item.meta.defaultMenu === true) {
          if (!parent) {
            item = { ...item, path: `/${item.path}` }
            // notLayoutRouterArr.push(item)
          }
        }
        routeMap[item.name] = item
        if (item.children && item.children.length > 0) {
          this.formatRouter(item.children, routeMap, item)
        }
      })
      routerHandle(routes)
    },
  },
})
