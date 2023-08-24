import {
  LAYOUT,
} from '@/router/constant'

const home = {
  path: '/',
  name: 'Root',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: 'Home',
      component: () => import('@/views/home/Home.vue'),
      meta: {
        title: 'Home',
      },
    }
  ],
}

export default home
