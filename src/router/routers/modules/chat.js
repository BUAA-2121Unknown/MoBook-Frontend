const chat = {
  path: '/chat',
  name: 'chat',
  component: () => import('@/views/chat/Chat.vue'),
  meta: {
    title: '群聊',
  },
}

export default chat

