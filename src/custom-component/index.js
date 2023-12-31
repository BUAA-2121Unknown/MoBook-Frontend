import * as Vue from 'vue'
const modules = import.meta.glob([
  './CircleShape/*.vue',
  './Picture/*.vue',
  './VText/*.vue',
  './VButton/*.vue',
  './Group/*.vue',
  './RectShape/*.vue',
  './LineShape/*.vue',
  './VTable/*.vue',
  './VCheckbox/*.vue',
  './svgs/SVGStar/*.vue',
  './svgs/SVGHexagon/*.vue',
  './svgs/SVGTriangle/*.vue',
  './Rate/*.vue',
  './Slider/*.vue',
  './Switch/*.vue',
  './Select/*.vue',
])
export const initComponents = ()=>{
  const components = [
    'CircleShape',
    'Picture',
    'VText',
    'VButton',
    'Group',
    'RectShape',
    'LineShape',
    'VTable',
    'VCheckbox',
    'Rate',
    'Slider',
    'Switch',
    'Select',
  ]
  // console.log("modules",modules)
  const svgs = ['SVGStar', 'SVGTriangle','SVGHexagon']
  components.forEach((key) => {
    window.$vueApp.component(
      key,
      Vue.defineAsyncComponent(
        modules[`./${key}/Component.vue`]
      )
    )
    window.$vueApp.component(
      key + 'Attr',
      Vue.defineAsyncComponent(
        modules[`./${key}/Attr.vue`]
      )
    )
  })
  svgs.forEach((key) => {
    window.$vueApp.component(
      key,
      Vue.defineAsyncComponent(
        modules[`./svgs/${key}/Component.vue`]
      )
    )
  })
}