import {
  LAYOUT,
} from '@/router/constant'

const project = {
  path: '/project',
  name: 'projectLayout',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: 'project',
      component: () => import('@/views/project/Project.vue'),
      meta: {
        title: '项目',
      },
    }
  ],
}

export default project
