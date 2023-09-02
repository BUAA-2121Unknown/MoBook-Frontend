import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { initComponents } from "@/custom-component";
import VueDragDrop from "vue3-drag-drop"

import { setupErrorHandle } from './utils/handler/error'
import settings from '@/settings/basic'

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

import 'element-plus/dist/index.css'
import '@/styles/element_visiable.scss'


import router from './router'
import pinia from './stores'
import store from './store'

import App from './App.vue'

import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css


import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Nprogress.configure({ showSpinner: false, ease: 'ease', speed: 500 })
Nprogress.start()

const app = createApp(App)
window.$vueApp = app;

app.use(vue3videoPlay)

app.config.globalProperties.$MoBook = settings

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.use(store)
app.use(VueDragDrop)
app.use(ContextMenu)

setupErrorHandle(app)
initComponents()

app.mount('#app')
