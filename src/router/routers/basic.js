import {
  LAYOUT,
  ERROR_COMPONENT,
  ERRORLOG_COMPONENT,
  PAGE_NOT_FOUND_NAME,
} from '@/router/constant'

export const PAGE_NOT_FOUND_ROUTE = {
  path: '/:pathMatch(.*)*',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: PAGE_NOT_FOUND_NAME,
      component: ERROR_COMPONENT,
      meta: {
        title: 'ErrorPage',
      },
    },
  ],
}

export const ERROR_LOG_ROUTE = {
  path: '/log',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: 'Log',
      component: ERRORLOG_COMPONENT,
      meta: {
        title: 'ErrorLog',
      },
    },
  ],
}
