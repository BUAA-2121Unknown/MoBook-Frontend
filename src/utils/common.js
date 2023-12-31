import settings from '@/settings/basic'
import { useRouterStore } from '@/stores/modules/router'

export function setTitle(title) {
  document.title = title + ' | ' + settings.appName
}

export function encodeObject(o) {
  return btoa(encodeURI(JSON.stringify(o)))
}

export function decodeObject(o) {
  return JSON.parse(decodeURI(atob(o)))
}

export function fmtForm(object, keys) {
  const subset = {};

  for (const key of keys) {
    if (object.hasOwnProperty(key)) {
      subset[key] = object[key];
    } else {
      subset[key] = null
    }
  }
  return subset;
}

export function resetMenuList(list) {
  const routerStore = useRouterStore()
  routerStore.menuRouter = list
  routerStore.formatRouter(routerStore.menuRouter, routerStore.routeMap)
}
