import {
  LAYOUT,
} from '@/router/constant'

const chat = {
  path: '/chat',
  name: 'chatLayout',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: 'chat',
      component: () => import('@/views/chat/Chat.vue'),
      meta: {
        title: '群聊',
      },
    }
  ],
}

export default chat
