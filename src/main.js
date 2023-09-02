import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { initComponents } from "@/custom-component";

import { setupErrorHandle } from './utils/handler/error'
import settings from '@/settings/basic'


import 'element-plus/dist/index.css'
import '@/styles/element_visiable.scss'


import router from './router'
import pinia from './stores'
import store from './store'

import App from './App.vue'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Nprogress.configure({ showSpinner: false, ease: 'ease', speed: 500 })
Nprogress.start()

const app = createApp(App)
window.$vueApp = app;


app.config.globalProperties.$MoBook = settings

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.use(store)

setupErrorHandle(app)
initComponents()

app.mount('#app')
