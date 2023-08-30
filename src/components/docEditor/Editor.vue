<template>
    <div class="editor">
      <!-- 几人在编辑 -->
      <div class="editor__footer">
        <div :class="`editor__status editor__status--${status}`">
          <template v-if="status === 'connected'">
            {{ editor.storage.collaborationCursor.users.length }} user{{ editor.storage.collaborationCursor.users.length === 1 ? '' : 's' }} online
          </template>
          <template v-else>
            offline
          </template>
        </div>
        <div class="editor__name">
            {{ currentUser.name }}
        </div>
      </div>
  
      <div class="menubar">
        <span v-for="actionName in activeButtons" :key="actionName">
          <button
            v-if="actionName === 'bold'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <icon name="bold" />
          </button>
          <button
            v-if="actionName === 'italic'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <icon name="italic" />
          </button>
  
          <button
            v-if="actionName === 'strike'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <icon name="strike" />
          </button>
  
          <button
            v-if="actionName === 'underline'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('underline') }"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            <icon name="underline" />
          </button>
  
          <button
            v-if="actionName === 'code'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('code') }"
            @click="editor.chain().focus().toggleCode().run()"
          >
            <icon name="code" />
          </button>
  
          <button
            v-if="actionName === 'h1'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            H1
          </button>
  
          <button
            v-if="actionName === 'h2'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            H2
          </button>
  
          <button
            v-if="actionName === 'h3'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            H3
          </button>
  
          <button
            v-if="actionName === 'bulletList'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <icon name="ul" />
          </button>
  
          <button
            v-if="actionName === 'orderedList'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <icon name="ol" />
          </button>
  
          <button
            v-if="actionName === 'blockquote'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('blockquote') }"
            @click="editor.chain().focus().toggleBlockquote().run()"
          >
            <icon name="quote" />
          </button>
  
          <button
            v-if="actionName === 'codeBlock'"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
            @click="editor.chain().focus().toggleCodeBlock().run()"
          >
            <icon name="code" />
          </button>
  
          <button
            v-if="actionName === 'horizontalRule'"
            class="menubar__button"
            @click="editor.chain().focus().setHorizontalRule().run()"
          >
            <icon name="hr" />
          </button>
  
          <button
            v-if="actionName === 'undo'"
            class="menubar__button"
            @click="editor.chain().focus().undo().run()"
          >
            <icon name="undo" />
          </button>
  
          <button
            v-if="actionName === 'redo'"
            class="menubar__button"
            @click="editor.chain().focus().redo().run()"
          >
            <icon name="redo" />
          </button>
        </span>
      </div>
  
      <editor-content class="editor__content" :editor="editor" />
    </div>
  </template>
  
  <script>
  import CharacterCount from '@tiptap/extension-character-count'
  import Collaboration from '@tiptap/extension-collaboration'
  import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
  import Highlight from '@tiptap/extension-highlight'
  import TaskItem from '@tiptap/extension-task-item'
  import TaskList from '@tiptap/extension-task-list'
  import * as Y from 'yjs'
  import { HocuspocusProvider } from '@hocuspocus/provider'
  
  import Icon from '@/components/docEditor/Icon.vue';
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Underline from '@tiptap/extension-underline';
  import Mention from '@tiptap/extension-mention'
  import suggestion from './suggestion.js'
  import Placeholder from '@tiptap/extension-placeholder'
  import Document from '@tiptap/extension-document'
  import { useUserStore } from '@/stores/modules/user'
import { boolean } from 'mathjs'

  
  const userStore = useUserStore()
  const userName = userStore.userInfo.username

  const getRandomElement = list => {
    return list[Math.floor(Math.random() * list.length)]
  }

  const DocumentWithTitle = Document.extend({
    content: 'title{1} block+',
  });

  export default {
    name: 'Editor',
    components: {
      EditorContent,
      Icon,
    },
    props: {
      doc_id: {
        type: String,
        required: true,
      },
      editable: {
        type: Boolean,
        required: true,
      },
      activeButtons: {
        type: Array,
        validator: function (list) {
          for (let el of list) {
            // The value must match one of these strings
            if (
              [
                'bold',
                'italic',
                'strike',
                'underline',
                'code',
                'h1',
                'h2',
                'h3',
                'bulletList',
                'orderedList',
                'blockquote',
                'codeBlock',
                'horizontalRule',
                'undo',
                'redo',
              ].indexOf(el) === -1
            ) {
              return -1;
            }
          }
          return 1;
        },
        default: () => ['bold', 'italic'],
      },
    },
    emits: ['update', 'save'],
    data() {
      return {
        html: '',
        json: '',
        editor: null,
        titleEditor: null,
        currentUser: {
          name: userName,
          color: this.getRandomColor(),
        },
        provider: null,
        status: 'connecting',
      };
    },
    created(){
      console.log(this.editable)
      // 创建时，后端会创建一个新的文档，拿到文档的id，传给js后端
      const ydoc = new Y.Doc()
      

      const tmp_token = "2"

      this.provider = new HocuspocusProvider({
        url: 'ws://localhost:80',
        name: "test",
        document: ydoc,
        token: tmp_token + '-' + this.doc_id + '-' + userName,
      })
      
      this.provider.on('status', event => {
        this.status = event.status
      })
      this.editor = new Editor({
        extensions: [
          StarterKit.configure({
            history: false,
          }), 
          DocumentWithTitle,
          Underline,
          Highlight,
          TaskList,
          TaskItem,
          Placeholder.configure({
            placeholder: ({ node }) => {
              if (node.type.name === 'heading') {
                return 'What’s the title?'
              }
              return 'Can you add some further context?'
            },
          }),
          Collaboration.configure({
            document: ydoc,
            // document: provider.document
          }),
          CollaborationCursor.configure({
            provider: this.provider,
            user: this.currentUser,
          }),
          CharacterCount.configure({
            limit: 10000,
          }),
          Mention.configure({
            HTMLAttributes: {
              class: 'mention',
            },
            suggestion,
          }),
        ],
        editable: this.editable
      })
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))

      this.html = this.editor.getHTML();
      this.json = this.editor.getJSON();
      this.editor.on('update', () => {
        this.html = this.editor.getHTML();
        this.json = this.editor.getJSON();
        this.$emit('update', this.html);
      })
    },
    methods: {
      save(){
        this.$emit('save', this.html);
      },
      setName() {
        const name = (window.prompt('Name') || '')
          .trim()
          .substring(0, 32)
  
        if (name) {
          return this.updateCurrentUser({
            name,
          })
        }
      },
  
      updateCurrentUser(attributes) {
        this.currentUser = { ...this.currentUser, ...attributes }
        this.editor.chain().focus().updateUser(this.currentUser).run()
  
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      },
  
      getRandomColor() {
        return getRandomElement([
          '#958DF1',
          '#F98181',
          '#FBBC88',
          '#FAF594',
          '#70CFF8',
          '#94FADB',
          '#B9F18D',
        ])
      },
  
      getRandomName() {
        return getRandomElement([
          'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
        ])
      },
    },
    beforeUnmount() {
      // this.editor.commands.clearContent(true)
      this.editor.destroy()
      this.provider.destroy()
    },
  };
  </script>
  
  <!-- <style lang="css" scoped></style> -->
  <style lang="sass">
  @import '../src/styles/editor/main.scss'
  </style>
  <style lang="scss" scoped>
      .editor__footer {
        align-items: center;
        border-top: 3px solid #0D0D0D;
        color: #0D0D0D;
        display: flex;
        flex: 0 0 auto;
        flex-wrap: wrap;
        font-size: 12px;
        font-weight: 600;
        justify-content: space-between;
        padding: 0.25rem 0.75rem;
        white-space: nowrap;
      }
      .editor__status {
      align-items: center;
      border-radius: 5px;
      display: flex;
  
        &::before {
          background: rgba(#0D0D0D, 0.5);
          border-radius: 50%;
          content: ' ';
          display: inline-block;
          flex: 0 0 auto;
          height: 0.5rem;
          margin-right: 0.5rem;
          width: 0.5rem;
        }
  
        &--connecting::before {
          background: #616161;
        }
  
        &--connected::before {
          background: #B9F18D;
        }
      }
  
      .editor__name {
        button {
          background: none;
          border: none;
          border-radius: 0.4rem;
          color: #0D0D0D;
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
  
          &:hover {
            background-color: #0D0D0D;
            color: #FFF;
          }
        }
      }
    .collaboration-cursor__caret {
      border-left: 1px solid #0D0D0D;
      border-right: 1px solid #0D0D0D;
      margin-left: -1px;
      margin-right: -1px;
      pointer-events: none;
      position: relative;
      word-break: normal;
    }
  
    /* Render the username above the caret */
    .collaboration-cursor__label {
      border-radius: 3px 3px 3px 0;
      color: #0D0D0D;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      left: -1px;
      line-height: normal;
      padding: 0.1rem 0.3rem;
      position: absolute;
      top: -1.4em;
      user-select: none;
      white-space: nowrap;
    }
    .mention {
      border: 1px solid #000;
      border-radius: 0.4rem;
      padding: 0.1rem 0.3rem;
      box-decoration-break: clone;
    }
  </style>
  