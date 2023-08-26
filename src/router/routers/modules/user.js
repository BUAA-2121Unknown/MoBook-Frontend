import {
  LAYOUT,
} from '@/router/constant'

const me = {
  path: '/me',
  name: 'me',
  component: LAYOUT,
  children: [
    {
      path: 'profile',
      name: 'profile',
      component: () => import('@/views/user/Profile.vue'),
      meta: {
        title: '个人资料',
      },
    }
  ],
}

export default me
