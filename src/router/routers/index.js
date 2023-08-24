import {
  PAGE_NOT_FOUND_ROUTE,
  ERROR_LOG_ROUTE,
} from './basic'

const modules = import.meta.glob('./modules/**/*.js', { eager: true })
const routeModuleList = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

const routers = [
  ...routeModuleList,
  ERROR_LOG_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
]

export default routers
