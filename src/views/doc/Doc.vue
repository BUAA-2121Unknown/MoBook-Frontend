<template>
    <div id="app">
      <div class="top-bar">
        <div class="top-bar__left">
          <router-link to="/project/doc">
            <el-icon><ArrowLeftBold /></el-icon>
          </router-link>
          {{ this.title }}
        </div>
        <div class="top-bar__right">
          <el-button type="primary">分享</el-button>
        </div>
      </div>
      <div class="editor-container">
        <h1>{{ this.title }}</h1>
        <editor
          :doc_id="this.doc_id"
          :active-buttons="[
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
          ]"
          @update="test"
          @save="save"
        />
      </div>
    </div>
    <!-- 如果编辑器中的内容有更新，就执行test函数，后续可在这里写自动保存 -->
  </template>
  
  <script>
  import Editor from '@/components/docEditor/Editor.vue';
  
  export default {
    name: 'Doc',
    props: {
      doc_id: {
        type: String,
        required: true,
      },
    },
    components: {
      Editor,
    },
    data(){
      return {
        title: '',
      }
    },
    created() {
      //先调用后端接口，获取标题
      this.title = '文档1'
      document.title = '文档1';
      
    },
    methods: {
      test(something) {
        // eslint-disable-next-line no-console
        // console.log(something);
      },
      save(something) {
  
        console.log(something)
      }
    },
  };
  </script>
  
  
  <style lang="css" scoped>
  /* 编辑器的容器 */
  .editor-container {
    display: flex;
    padding-top: 10%;
    box-sizing: border-box;
    flex-flow: column;
    align-items: center;
    font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica,
      'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC',
      'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC',
      'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei',
      'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp',
      sans-serif;
  }
  /* 顶部栏 */
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    z-index: 100;
  }
  </style>
  