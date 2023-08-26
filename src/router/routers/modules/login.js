const login = {
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/Login.vue'),
  meta: {
    title: '登录',
  },
}

export default login
