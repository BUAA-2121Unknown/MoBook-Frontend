<template>
  <div id="app">
    <div class="top-bar">
      <div class="top-bar__left">
        <router-link to="/project/docs">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
        </router-link>
        {{ title }}
      </div>
      <div class="top-bar__right">
        <div class="avatars">
          
        </div>
        
        <div class="operations">
          <el-button type="primary" @click="dialogFormVisible = true">分享</el-button>
          <el-button type="primary" @click="callEditorMethodSave">保存</el-button>
          <el-dropdown>
            <el-button type="primary">
              导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="callEditorMethodExportToWord">导出为word</el-dropdown-item>
                <el-dropdown-item @click="callEditorMethodExportToPdf">导出为pdf</el-dropdown-item>
                <el-dropdown-item @click="callEditorMethodExportToMarkdown">导出为markdown</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        
      </div>
      <el-dialog v-model="dialogFormVisible" title="生成共享链接" width="20%" >
        <el-form :model="form">
          <el-form-item label="链接有效时间" :label-width="formLabelWidth">
            <el-input v-model="shareForm.expires" autocomplete="off" size="small" class="input-width" />天
          </el-form-item>
          <el-form-item label="权限" :label-width="formLabelWidth">
            <el-radio-group v-model="radio1" class="ml-4">
              <el-radio label="2" size="large">可编辑</el-radio>
              <el-radio label="1" size="large">仅可查看</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="shareLink" >
              生成链接
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="editor-container">
      <editor :doc_id="doc_id" :editable="editable" v-if="visible" ref="childRef" :activeButtons="[
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
      ]" />
    </div>
  </div>
</template>
  


<script setup>
import Editor from '@/components/docEditor/Editor.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDoc, createDocToken, getDocAuth } from '@/api/artifact.js';
import settings from '@/settings/basic'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import emitter from '@/utils/emitter'
import { ArrowDown } from '@element-plus/icons-vue'


const title = ref('')
const form = ref({
        artId: -1
      })
const dialogFormVisible =  ref()
const formLabelWidth =  ref('120px')
const shareForm = ref({
        artId: -1,
        expires: 7,
        auth: 1,
        orgOnly: false
      })

const radio1 =  ref('1')
const editable = ref(true)

const visible = ref(false)

const route = useRoute()

const doc_id = route.query.doc_id
const token = route.query.token

const getFirstH1Value = async() => {
  const firstH1 = this.$el.querySelector('h1');
  if (firstH1) {
    this.firstH1Value = firstH1.innerText;
  } else {
    console.log("未找到 <h1> 标签");
  }
}

const getNowDoc = async() => {
  try{
    if (doc_id && !token)
    {
      form.value.artId = doc_id
      console.log(form.value)
      const res =  await getDoc(form.value)
      if (res.meta.status == 0)
      {
        title.value = res.data.name
        document.title = title.value;
      }
    }
    // 通过分享链接进入
    else if (doc_id && token)
    {
      const res = await getDocAuth({'token': token})
      if (res.meta.status == 0)
      {
        const auth = res.data.auth
        console.log(auth)
        if (auth == '1')
          editable.value = false
        else if (auth === '2')
          editable.value = true

        form.value.artId = doc_id
        const res2 =  await getDoc(form.value)
        if (res2.meta.status == 0)
        {
          title.value = res2.data.name
          document.title = title.value;
        }
      }
    }
  }catch(e) {
    console.log(e)
  }
}

onMounted(async () => {
  await getNowDoc();
  console.log(title.value)
  visible.value = true;
});

const createToken = async () => {
  shareForm.value.artId = parseInt(doc_id)
  shareForm.value.auth = parseInt(radio1.value)
  console.log(shareForm.value)
  try {
    const res = await createDocToken(shareForm.value);
    const shareUrl =  settings.appURL + 'share/doc?doc_id=' + doc_id + '&' + 'token=' + res.data.token
    
    const input = document.createElement('input')
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', shareUrl)
    document.body.appendChild(input)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      ElMessage({
        type: 'success',
        message: '复制成功',
      })
    }
    document.body.removeChild(input)
  } catch (e) {
    console.log(e);
  }
}

const shareLink = () => {
  dialogFormVisible.value = false
  createToken()
}

const callEditorMethodSave = async() => {
  emitter.emit('save')
}

const callEditorMethodExportToWord = async() => {
  emitter.emit('exportToWord')
}

const callEditorMethodExportToPdf = async() => {
  emitter.emit('exportToPdf')
}

const callEditorMethodExportToMarkdown = async() => {
  emitter.emit('exportToMarkdown')
}
</script>

<script>
export default {
  name: 'Doc',
  // props: {
  //   doc_id: {
  //     type: String,
  //     required: true,
  //   },
  //   token: {
  //     type: String,
  //     required: true,
  //   }
  // },
  components: {
    Editor,
  },
  methods: {
    save(){
      const html = editor.getHTML()
      console.log(html)
    }
  }
};
</script>
  
  
<style lang="css" scoped>
/* 编辑器的容器 */
.editor-container {
  display: flex;
  padding-top: 5%;
  box-sizing: border-box;
  flex-flow: column;
  align-items: center;
  min-height: 100%;
  overflow: auto;
  background-color: white;
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

/* 点击分享后的弹出框 */
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}

/* 输入框宽度 */
.input-width{
  width: 100px;
}


</style>
  