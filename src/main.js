import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { setupErrorHandle } from './utils/handler/error'

import 'element-plus/dist/index.css'
import '@/styles/element/index.scss'

import router from './router'
import store from './store'

import App from './App.vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(store)

setupErrorHandle(app)

app.mount('#app')
