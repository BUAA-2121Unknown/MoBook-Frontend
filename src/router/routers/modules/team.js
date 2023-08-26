import {
  LAYOUT,
} from '@/router/constant'

const team = {
  path: '/',
  name: 'Root',
  redirect: '/team',
  component: LAYOUT,
  children: [
    {
      path: 'team',
      name: 'team',
      component: () => import('@/views/team/Team.vue'),
      meta: {
        title: '团队',
      },
    }
  ],
}

export default team
