<template>
  <div ref="container">
    <!-- 预览链接 -->
    <el-dialog v-model="dialogVisible" title="生成预览链接" width="30%">
      <div>
        预览链接：<br />
        <span>{{ previewLink }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="(dialogVisible = false), save(), clipBoard()">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 生成代码 -->
    <el-dialog v-model="codeDialogVisible" title="导出代码">
      <el-form :model="form">
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Zones" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <div class="toolbar">
      <el-button v-if="!isPreview" @click="toLast">返回上一级</el-button>
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">
        插入图片
        <input id="input" type="file" hidden @change="handleFileChange" />
      </label>
      <el-button style="margin-left: 10px" @click="preview(false)">预览</el-button>
      <el-button v-if="!isPreview" @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button>
      <el-button :disabled="!curComponent ||
        curComponent.isLock ||
        (curComponent.userId && curComponent.userId != userId) ||
        curComponent.component != 'Group'
        " @click="decompose">
        拆分
      </el-button>
<!-- 对于解锁和不解锁按钮来说，当有人操作时一定不允许使用 -->
      <el-button :disabled="!curComponent || curComponent.isLock || (curComponent.userId && curComponent.userId != userId)" @click="lock">锁定</el-button>
      <el-button :disabled="!curComponent || !curComponent.isLock || (curComponent.userId && curComponent.userId != userId)" @click="unlock">解锁</el-button>
      <el-button @click="preview(true)">原型导出</el-button>
      <PreviewCreateButton :placedAtBar="true"></PreviewCreateButton>
      <!-- <el-button
        v-if="!isPreview"
        @click="generatePreview(), (dialogVisible = true)"
        >生成预览链接</el-button
      >
      <el-button v-show="previewing" @click="cancelPreview"
        >关闭预览链接</el-button
      > -->

      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width" />
        <span>*</span>
        <input v-model="canvasStyleData.height" />
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="scale" @input="handleScaleChange" /> %
      </div>
    </div>

    <!-- 预览 -->
    <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from "../../utils/design/gogocodeTransfer";
import generateID from "@/utils/design/generateID";
import toast from "@/utils/design/toast";
import { mapState } from "vuex";
import Preview from "./Preview.vue";
import { commonStyle, commonAttr } from "@/custom-component/component-list";
import eventBus from "@/utils/design/eventBus";
import { deepCopy, $ } from "@/utils/design/utils";
import { divide, multiply } from "mathjs";
import { Project } from "../../api/project";
import { useRouter } from "vue-router";
import { File } from "../../api/file.js";
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import Clipboard from "vue-clipboard3";
import { ElNotification } from "element-plus";
import { ElMessage } from "element-plus";
import { copyToClipboard } from "@/utils/design/copy"

import { savePrototype } from "../../api/artifact";
import PreviewCreateButton from '../project/button/PreviewCreateButton.vue';
import { useUserStore } from "../../stores/modules/user";
// const dialogVisible = ref(false);

export default {
  components: { Preview, PreviewCreateButton,},
  props: {
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPreviewing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShowPreview: false,
      needToChange: ["top", "left", "width", "height", "fontSize"],
      scale: "100%",
      timer: null,
      isScreenshot: false,
      previewLink: "",
      dialogVisible: false,
      previewing: this.isPreviewing,
      codeDialogVisible: false,
      forbidSaveTips: true,
      userId: 0,
    };
  },
  computed: mapState([
    "componentData",
    "canvasStyleData",
    "areaData",
    "curComponent",
    "curComponentIndex",
    "canvasDOM",
  ]),
  created() {
    $on(eventBus, "preview", this.preview);
    $on(eventBus, "save", this.save);
    $on(eventBus, "clearCanvas", this.clearCanvas);
    this.scale = this.canvasStyleData.scale;
  },
  activated() {
    // setTimeout(() => {
    //   this.save();
    // }, 1000);
  },
  mounted() {
    const userStore = useUserStore()
    this.userId = userStore.userInfo.id
  },
  methods: {
    cancelPreview() {
      let data = new FormData();
      data.append("id", this.$route.params.id);
      File.cancelPreview(data)
        .then((res) => {
          if (res.status == 200) {
            this.previewing = false;
            this.previewLink = "";
            ElMessage.success("取消预览成功！");
          } else {
            ElMessage.error("取消预览失败！");
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("取消预览失败！");
        });
    },

    format(value) {
      return multiply(value, divide(parseFloat(this.scale), 100));
    },
    clipBoard() {
      console.log("this.previewLink", this.previewLink);
      navigator.clipboard.writeText(this.previewLink).then(() => {
        ElMessage.success("复制成功");
      });
    },
    getOriginStyle(value) {
      return divide(value, divide(parseFloat(this.canvasStyleData.scale), 100));
    },
    generatePreview() {
      const data = new FormData();
      data.append("fileId", this.$route.params.id);
      File.generatePreview(data).then((res) => {
        console.log(res);
        if (res.status == 200) {
          let baseUrl =
            "http://" + window.location.host + "/doc/prototypePreview/";
          this.previewLink = baseUrl + res.data.code;
          this.previewing = true;
        }
      });
    },
    toLast() {
      this.$router.go(-1);
    },
    handleScaleChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 画布比例设一个最小值，不能为 0
        // eslint-disable-next-line no-bitwise
        this.scale = ~~this.scale || 1;
        const componentData = deepCopy(this.componentData);
        componentData.forEach((component) => {
          Object.keys(component.style).forEach((key) => {
            if (this.needToChange.includes(key)) {
              if (key === "fontSize" && component.style[key] === "") return;

              // 根据原来的比例获取样式原来的尺寸
              // 再用原来的尺寸 * 现在的比例得出新的尺寸
              component.style[key] = this.format(
                this.getOriginStyle(component.style[key])
              );
            }
          });
        });
        this.$store.commit("setComponentData", componentData);
        // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
        this.$store.commit("setCurComponent", {
          component: componentData[this.curComponentIndex],
          index: this.curComponentIndex,
        });
        this.$store.commit("setCanvasStyle", {
          ...this.canvasStyleData,
          scale: this.scale,
        });
      }, 1000);
    },

    lock() {
      this.$store.commit("lock");
    },

    unlock() {
      this.$store.commit("unlock");
    },

    compose() {
      this.$store.commit("compose");
      this.$store.commit("recordSnapshot");
    },

    decompose() {
      this.$store.commit("decompose");
      this.$store.commit("recordSnapshot");
    },

    undo() {
      this.$store.commit("undo");
    },

    redo() {
      this.$store.commit("redo");
    },

    // cola 图片上传函数
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) {
        toast("只能插入图片");
        return;
      }

      const reader = new FileReader();
      reader.onload = (res) => {
        const fileResult = res.target.result;
        const img = new Image();
        img.onload = () => {
          this.$store.commit("addComponent", {
            component: {
              ...commonAttr,
              id: generateID(),
              component: "Picture",
              label: "图片",
              icon: "",
              propValue: {
                url: fileResult,
                flip: {
                  horizontal: false,
                  vertical: false,
                },
              },
              style: {
                ...commonStyle,
                top: 0,
                left: 0,
                width: img.width,
                height: img.height,
              },
            },
          });

          this.$store.commit("recordSnapshot");

          // 修复重复上传同一文件，@change 不触发的问题
          $("#input").setAttribute("type", "text");
          $("#input").setAttribute("type", "file");
        };

        img.src = fileResult;
      };

      reader.readAsDataURL(file);
    },

    preview(isScreenshot) {
      this.isScreenshot = isScreenshot;
      this.isShowPreview = true;
      this.$store.commit("setEditMode", "preview");
    },

    // 保存原型设计项目
    async save() {
      // 无query参数进入，禁止保存
      if (!this.$route.query || !this.$route.query.artId) {
        // 首次进入时会自动进行一次上传，这次保存无需提醒
        if (!this.forbidSaveTips) {
          ElNotification({
            title: "保存失败",
            message:
              "您正在使用临时设计工具。若要保存，请先在项目页面创建一个原型设计。",
            type: "danger",
          });
        }
        this.forbidSaveTips = false;
        console.log("未给出artId，无法保存");
        return;
      }

      // 带query参数才允许保存
      const id = this.$route.query.artId;
      const data = {
        artId: Number(id),
        filename: "prototype_" + this.$route.query.artId + ".json",
        content: JSON.stringify({
          canvasData: { array: this.componentData },
          canvasStyle: this.canvasStyleData,
        }),
      };
      try {
        // console.log("原型设计信息字符串", data.content);
        const res = await savePrototype(data);
        console.log("原型设计保存成功", res);
        if (!this.forbidSaveTips) {
          this.$message.success("原型设计保存成功！");
        }
        this.forbidSaveTips = false;
      } catch (e) {
        console.log(e);
        this.$message.error("原型设计保存失败，请检查您的网络配置。");
      }
    },

    // save() {
    //   // TODO 保存
    //   // localStorage.setItem("canvasData", JSON.stringify(this.componentData));
    //   // localStorage.setItem("canvasStyle", JSON.stringify(this.canvasStyleData));
    //   const data = new FormData();
    //   data.append("protoId", this.$route.params.id);
    //   console.log("protoId: ", this.$route.params.id);
    //   data.append("canvasData", JSON.stringify({ array: this.componentData }));
    //   data.append("canvasStyle", JSON.stringify(this.canvasStyleData));
    //   Project.saveProto(data)
    //     .then((res) => {
    //       if (res.status === 200) {
    //         this.$message.success("保存成功");
    //       } else {
    //         this.$message.error("保存失败");
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.$message.error("保存失败");
    //     });
    // },

    clearCanvas() {
      this.$store.commit("setCurComponent", { component: null, index: null });
      this.$store.commit("setComponentData", []);
      this.$store.commit("recordSnapshot");
    },

    handlePreviewChange() {
      this.isShowPreview = false;
      this.$store.commit("setEditMode", "edit");
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #ddd;

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;

    input {
      width: 50px;
      margin-left: 4px;
      outline: none;
      padding: 0 5px;
      border: 1px solid #ddd;
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }
}
</style>
