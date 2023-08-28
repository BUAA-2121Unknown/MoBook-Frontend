import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'

import MentionList from './MentionList.vue'

import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()

export default {
  // items: async ({ query }) => {
  //   const orgId = userStore.orgId; // 替换为实际的组织ID
  //   const url = `http://81.70.161.76:5000/api/org/members?orgId=${orgId}}`;
  //   const response = await fetch(url);
  //   console.log(response)
  //   // 这里假设 API 返回的数据是一个数组
  //   // return data.filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
  // },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(MentionList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          // using vue 3:
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}