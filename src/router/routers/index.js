import {
  PAGE_NOT_FOUND_ROUTE,
  ERROR_LOG_ROUTE,
} from './basic'

import {
  LAYOUT,
} from '@/router/constant'

const modules = import.meta.glob('./modules/**/*.js', { eager: true })
const routeModuleList = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

const routers = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Layout',
    redirect: '/team',
    component: LAYOUT,
    meta: {
      title: '布局',
    },
    children: [
      {
        path: 'team',
        name: 'team',
        component: () => import('@/views/team/Team.vue'),
        meta: {
          title: '团队',
        },
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/views/chat/Chat.vue'),
        meta: {
          title: '群聊',
        },
      },
      /* {
        path: 'project',
        name: 'project',
        component: () => import('@/views/homeProject/HomeProject.vue'),
        meta: {
          title: '项目',
        },
      }, */
    ]
  },
  {
    path: '/',
    children: [
      {
        path: 'me',
        name: 'me',
        component: LAYOUT,
        meta: {
          title: '我的',
        },
        children: [
          {
            path: 'profile',
            name: 'profile',
            component: () => import('@/views/user/Profile.vue'),
            meta: {
              title: '个人资料',
            },
          },
          {
            path: 'myteam',
            name: 'myteam',
            component: () => import('@/views/user/MyTeam.vue'),
            meta: {
              title: '我的团队',
            },
          },
        ],
      },
    ]
  },
  {
    path: '/project',
    component: LAYOUT,
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/homeProject/HomeProject.vue'),
        meta: {
          title: '项目列表',
        },
      },
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/project/ProjectInfo.vue'),
        meta: {
          title: '项目信息',
        },
      },
      {
        path: 'design',
        name: 'design',
        component: () => import('@/views/project/ProjectDesign.vue'),
        meta: {
          title: '项目设计',
        },
      },
      {
        path: 'doc',
        name: 'doc',
        component: () => import('@/views/user/MyTeam.vue'),
        meta: {
          title: '项目文档',
        },
      },
      {
        path: 'trash',
        name: 'trash',
        component: () => import('@/views/user/Profile.vue'),
        meta: {
          title: '回收站',
        },
      },
    ],
  },
  {
    path: '/org/member/auth/activate',
    component: () => import('@/views/team/InvitePage.vue'),
    meta: {
      title: '成员邀请'
    }
  },
  {
    path: '/prototype',
    name: 'prototype',
    component: () => import('@/views/design/Home.vue'),
    meta: {
      title: '原型设计',
    },
  },
  ERROR_LOG_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
]

export default routers
