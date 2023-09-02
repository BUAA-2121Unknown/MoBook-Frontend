<template>
  <div id="app">
    <div v-if="!versionVisible">
      <div class="top-bar">
        <div class="top-bar__left">
          <router-link to="/project/docs">
            <el-icon>
              <ArrowLeftBold />
            </el-icon>
          </router-link>
          <!-- {{ title }} -->
        </div>
        <div class="top-bar__right">
          <div class="avatars">
          </div>

          <div class="operations actions">
            <el-button class="action" type="info" @click="templateVisible = !templateVisible">模板库</el-button>
            <el-button class="action" type="danger" @click="dialogFormVisible = true">分享</el-button>
            <el-button class="action" type="warning" @click="showVersions">历史版本</el-button>
            <el-button class="action" type="success" @click="callEditorMethodSave">保存</el-button>
            <el-dropdown class="action">
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
        <el-dialog v-model="dialogFormVisible" title="生成共享链接" width="30%">
          <el-form :model="form">
            <el-form-item label="链接有效时间" :label-width="formLabelWidth">
              <el-input-number v-model="num" :min="1" :max="14" @change="handleChange" size="small" /> <span
                style="margin-left: 10px">天</span>
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
              <el-button type="primary" @click="shareLink">
                生成链接
              </el-button>
            </span>
          </template>
        </el-dialog>

      </div>

      <div class="body-container">
        <FileTree></FileTree>
        <div class="editor-container">
          <editor :paramsToEditor="paramsToEditor" editable="editable" v-if="visible" ref="childRef" :showLive="true"
            :activeButtons="[
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

      <div class="template-container">
        <el-dialog v-model="templateVisible" :show-close="false" close-on-click-modal="false" width="50%">
          <template #header="{ titleId, titleClass }">
            <div class="my-header">
              <h4 :id="titleId" :class="titleClass">选择你想要使用的模版</h4>
            </div>
            <div class="templates">
              <div class="common-layout">
                <el-container>
                  <el-aside width="200px">
                    <div class="title" @click="myTemplate = false">默认模板</div>
                    <div class="title" @click="myTemplate = true">我的模版</div>
                  </el-aside>
                  <el-main>
                    <div v-if="myTemplate">
                      我的
                    </div>
                    <div v-else class="row" style="display: flex; flex-wrap: wrap;">
                      <div class="box" v-for="item in docTemplate" :key="item.id" style="width: 20%;"
                        @click="createFromTemplate(item.content)">
                        <div class="text">{{ item.name }}</div>
                        <img src="../../assets/template.png">
                      </div>
                    </div>
                  </el-main>
                </el-container>
              </div>
              <!-- <div v-for="(item, key) in docTemplate" :key="key">
                <div>
                  <el-button type="primary" @click="createFromTemplate(item.content)">{{ item.name }}</el-button>
                </div>
              </div> -->
            </div>
          </template>
        </el-dialog>
      </div>
    </div>

    <div v-else>
      <div class="top-bar">
        <div class="top-bar__left">
          <div class="back-to-edit" @click="versionVisible = false">
            <el-icon>
              <ArrowLeftBold />
            </el-icon>
            返回文档
          </div>
        </div>
        <div class="top-bar__right">
          <div class="operations">
            <el-button type="primary" @click="restore">恢复此记录</el-button>
          </div>

        </div>
      </div>

      <div class="body-version-container">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="editor-version-container">
              <historyEditor :paramsToEditor="paramsToEditor" :editable="versionEditable" ref="childRef" :showLive="false"
                :key="componentKey" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="version-title">
              历史版本记录
            </div>
            <div class="version-container">
              <el-scrollbar height="800px">
                <div class="card" v-for="(version, key) in versions" :key="key" @click="chooseVersion(version.version)">
                  <div class="card-img"></div>
                  <div class="card-info">
                    <div class="card-text">
                      <p class="text-title"> Version | {{ version.version }}</p>
                      <p class="text-subtitle">{{ version.user.username }} | {{ version.updated }}</p>
                    </div>
                    <div class="card-icon">
                      <svg viewBox="0 0 28 25" class="icon">
                        <path d="M13.145 2.13l1.94-1.867 12.178 12-12.178 12-1.94-1.867 8.931-8.8H.737V10.93h21.339z">
                        </path>
                      </svg>
                    </div>
                  </div>
                </div>
                <!-- <div v-for="(version, key) in versions" class="scrollbar-demo-item card" :key="key"
                  @click="chooseVersion(version.version)">
                  <div>版本号 | {{ version.version }}</div>
                  <div>
                    <div>创建时间：{{ version.updated }}</div>
                    <div>创建者: {{ version.user.username }}</div>
                  </div>
                </div> -->
                <!-- <div class="book" v-for="(version, key) in versions" :key="key" @click="chooseVersion(version.version)">
                  <p>Hello</p>
                  <div class="cover">
                    <p>Hover Me</p>
                  </div>
                </div> -->
                <!-- <div class="cards" >
                  <div class="card blue">
                    <p class="tip">Hover Me</p>
                    <p class="second-text">Lorem Ipsum</p>
                  </div>
                </div> -->
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>


<script setup>
import Editor from '@/components/docEditor/Editor.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDoc, createDocToken, getDocAuth, getAllVersions, getDocVersion, uploadDoc } from '@/api/artifact.js';
import settings from '@/settings/basic'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, inject } from 'vue'
import emitter from '@/utils/emitter'
import { ArrowDown } from '@element-plus/icons-vue'
import FileTree from '@/components/fileManager/FileTree.vue'
import { useUserStore } from '@/stores/modules/user'
import historyEditor from '@/components/docEditor/historyEditor.vue'
import * as Y from 'yjs'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import docTemplate from '@/utils/docTemplate.js'
import { createFile } from '@/api/fileTree.js'
const router = useRouter()
const num = ref(1)
const handleChange = (value) => {
  console.log(value)
}
const userStore = useUserStore()

const versionVisible = ref(false)

const title = ref('')
const form = ref({
  artId: -1
})
const dialogFormVisible = ref()
const formLabelWidth = ref('120px')
const shareForm = ref({
  itemId: -1,
  projId: -1,
  expires: 7,
  auth: 1,
})

const radio1 = ref('1')
const editable = ref(true)
const versionEditable = ref(false)

const visible = ref(false)

const route = useRoute()

const versions = ref([])

const componentKey = ref(0)

// 传给historyEditor的值
const content = ref('')

// 通过路由的值传递
const doc_id = route.query.doc_id
const token = route.query.token

const versionNum = ref('')

// template库的弹窗
const templateVisible = ref(false)

// 选择展示哪个版块
const myTemplate = ref(false)

const getFirstH1Value = async () => {
  const firstH1 = this.$el.querySelector('h1');
  if (firstH1) {
    this.firstH1Value = firstH1.innerText;
  } else {
    console.log("未找到 <h1> 标签");
  }
}

// 展示该文档的所有版本
const showVersions = async () => {
  versionVisible.value = true
  const itemId = doc_id
  const projId = userStore.projectId
  const res = await getAllVersions({ itemId: itemId, projId: projId })
  // console.log(res.data)
  versions.value = res.data.versions
}



// 展示该文档指定版本的内容
const chooseVersion = async (version) => {
  console.log("####")
  const projId = userStore.projectId
  const itemId = doc_id
  const res = await getDocVersion({ projId: projId, itemId, itemId, version: version })
  console.log("展示该文档指定版本内容", res.data.content)
  //点击一下让editor组件强制渲染
  content.value = res.data.content
  componentKey.value += 1;
  versionId.value = version //记录当前点击的versionId
  json.value = JSON.parse(res.data.content)   //记录当前点击的内容
}

// 获取现在的总的版本号
const getNowDocVersion = async () => {
  try {
    console.log(parseInt(doc_id))
    console.log(parseInt(userStore.projectId))
    const res = await getAllVersions({ itemId: parseInt(doc_id), projId: parseInt(userStore.projectId) })
    versionNum.value = res.data.totalVersion
  } catch (e) {
    console.log(e)
  }
}

// 获取现在的权限
const getAuth = async () => {
  console.log("version" + versionNum.value)
  // 通过分享链接进入
  if (doc_id && token) {
    const res = await getDocAuth({ 'token': token })
    if (res.meta.status == 0) {
      const auth = res.data.auth
      console.log("auth", auth)
      if (auth == '1')
        editable.value = false
      else if (auth == '2')
        editable.value = true
      else if (auth == '0') {
        router.push("/")
        ElMessage.error("您没有权限访问该文档");
      }
    }
  }
}


const paramsToEditor = {
  'itemId': doc_id,
  'projId': userStore.projectId,
  'version': versionNum.value,
  'content': content,  //Editor中不需要这个content，只是historyEditor需要
}
console.log(paramsToEditor)
onMounted(async () => {
  await getNowDocVersion();
  await getAuth();
  paramsToEditor.version = versionNum.value
  visible.value = true;
});

const createToken = async () => {
  shareForm.value.itemId = parseInt(doc_id)
  shareForm.value.auth = parseInt(radio1.value)
  shareForm.value.expires = num.value
  shareForm.value.projId = parseInt(userStore.projectId)
  console.log(shareForm.value)
  try {
    const res = await createDocToken(shareForm.value);
    console.log(res)
    const shareUrl = settings.appURL + 'doc?doc_id=' + doc_id + '&' + 'token=' + res.data.token
    console.log(shareUrl)
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

const callEditorMethodSave = async () => {
  emitter.emit('save')
}

const callEditorMethodExportToWord = async () => {
  emitter.emit('exportToWord', "filename")
}

const callEditorMethodExportToPdf = async () => {
  emitter.emit('exportToPdf', "filename")
}

const callEditorMethodExportToMarkdown = async () => {
  emitter.emit('exportToMarkdown', "filename")
}


const versionId = ref(0)  //记录version的id
const json = ref("") //记录文本内容

const restore = async () => {
  const restoreFormData = {
    'projId': parseInt(userStore.projectId),
    'itemId': parseInt(doc_id),
    'content': JSON.stringify(json.value),
    'version': 1145141919
  }
  const res = await uploadDoc(restoreFormData)
  console.log(res)
}


// 创建模版
// 从文档模版创建文件
const createFromTemplate = async (content) => {
  const res = await createFile({
    'projId': userStore.projectId,
    'itemId': parseInt(doc_id),
    'filename': "新建文档",
    'prop': 1,
    'live': true,
    'sibling': true,
    'content': JSON.stringify(content)
  })
  console.log(res)
  // if (res.meta.status == 0) {
  //   console.log(res.data)
  //   ElMessage({
  //     type: 'success',
  //     message: '创建成功',
  //   })
  //   console.log(res.data)
  // } else {
  //   ElMessage({
  //     type: 'error',
  //     message: '创建失败',
  //   })
  //   console.log(res.data)
  // }
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
    Editor, historyEditor
  },
};
</script>
  
  
<style lang="css" scoped>
/* 编辑器的容器 */
.editor-container {
  margin: 20px auto;
  display: flex;
  box-sizing: border-box;
  flex-flow: column;
  align-items: center;
  overflow: auto;
  overflow-y: scroll;
  background-color: white;
  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica,
    'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC',
    'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC',
    'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei',
    'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp',
    sans-serif;
}

.edit {
  width: 90%;
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
.input-width {
  width: 100px;
}

/* 历史版本的左上角 */
.back-to-edit:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.body-container {
  padding-top: 5%;
  display: flex;
}

.body-version-container {
  padding-top: 5%;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

/* 历史版本的编辑器 */
.editor-version-container {
  display: flex;
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

/* 版本的容器 */
.body-container {
  background-color: white;
}

/* 版本的条目 */
.scrollbar-demo-item {
  height: 80px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  cursor: pointer;
}

/* 模版框的样式 */
.template-container {}

.templates {
  margin-top: 20px;
}

.title {
  font-size: 25px;
  font-weight: bold;
  cursor: pointer
}

.title:hover {
  background-color: #f2f2f2
}

.row {
  display: flex;
}

.box {
  width: 150px;
  height: 175px;
  text-align: center;
  margin: 5px 5px;
  cursor: pointer;
}

.text {
  font-weight: bold;
  margin-top: 5px;
  font-size: 13px;
}

img {
  max-width: 100%;
  max-height: 100%;
}

.operations.actions {
  display: flex;
  grid-row: 5px;
}

.operations.actions .action {
  flex: 1;
  padding: auto 20px;
  margin: 0 5px;
}

.el-button+.el-button {
  margin: auto;
}

.el-dropdown.action {
  overflow: visible;
}

/* Editor */
</style>
  