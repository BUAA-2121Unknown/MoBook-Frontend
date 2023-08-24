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
      name: 'Team',
      component: () => import('@/views/home/Home.vue'),
      meta: {
        title: 'Team',
      },
    }
  ],
}

export default team
