<!-- 模板块 -->
<template>
  <button @click="handleClick" class="template-button">模板库</button>

  <!-- 弹出窗 -->
  <el-dialog v-model="dialogTableVisible" title="模板库" width="70%">
    <!-- 项目模板 -->
    <div class="header-container">
      <div style="display: flex; align-items: center">
        <h3 class="header-title">项目模板</h3>
        <button @click="handleSave" class="template-button">
          保存当前设计为模板
        </button>
      </div>
      <div class="design-list">
        <el-row :gutter="10">
          <el-col v-for="item in projectDesignList" :key="item.id" :span="8">
            <TemplateCard
              :design="item"
              :projId="projId"
              :loadHandler="handleClose"
              :isDefault="false"
            ></TemplateCard>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 默认模板 -->
    <div class="header-container">
      <h3 class="header-title">默认模板</h3>
      <div class="design-list">
        <el-row :gutter="10">
          <el-col v-for="item in defaultDesignList" :key="item.id" :span="8">
            <TemplateCard
              :design="item"
              :projId="projId"
              :loadHandler="handleClose"
              :isDefault="true"
            ></TemplateCard>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import designImg from "@/assets/project/projectDesignImg.png";
import TemplateCard from "../project/TemplateCard.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { mapState } from "vuex";
import { useUserStore } from "../../stores/modules/user";

export default {
  name: "TemplateList",
  components: {
    TemplateCard,
  },
  computed: mapState([
    "componentData",
    "curComponent",
    "isClickComponent",
    "canvasStyleData",
    "editor",
  ]),
  methods: {
    // 打开模板库
    handleClick() {
      this.dialogTableVisible = true;
    },
    // 关闭模板库
    handleClose() {
      this.dialogTableVisible = false;
    },
    // 保存当前设计为模板
    handleSave() {
      ElMessageBox.confirm("确定将当前原型设计保存至项目模板？", "保存为模板", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(() => {
          // 执行保存函数
          this.saveTemplate();
          // 再获取一次列表
          this.getList();
          
          ElMessage({
            type: "success",
            message: "原型设计已保存至团队模板",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消保存",
          });
        });
    },
    // 保存模板的实际实现函数
    async saveTemplate() {
      // 包裹参数
      const id = this.$route.query.artId;
      const data = {
        artId: Number(id),
        filename: "prototype_template_" + this.$route.query.artId + ".json",
        // filename: 'DesignForTestProject2.json',
        content: JSON.stringify({
          canvasData: { array: this.componentData },
          canvasStyle: this.canvasStyleData,
        }),
      };
      // 请求保存
      try {
        // const res = await savePrototype(data);
        // console.log("原型设计成功保存为模板", res);
        console.log("成功保存原型设计");
      } catch (e) {
        console.log(e);
        // this.$message.error("原型设计保存失败，请检查您的网络配置。");
      }
    },
    // 获取模板列表
    async getList() {
      const params = {
        projId: this.projId,
      };
      try {
        console.log("开始导入原型设计模板列表", params);
        // const res = await getPrototypeList(params);
        // console.log('开始导入原型设计模板列表', res);
        // this.designList = res.data.artifacts.filter(function (item) {
        //   return item.isLive === false;
        // });
        // console.log('成功导入原型设计列表', this.designList);
      } catch (e) {
        console.log(e);
      }
    },

  },
  data() {
    return {
      projId: 1,
      dialogTableVisible: false,
      defaultDesignList: [
        {
          id: 1,
          status: 0,
          name: "学术成果分享平台(移动端)",
          intro:
            "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
          img: designImg,
          created: "2023/8/30 15:49",
          updated: "2023/8/30 15:49",
        },
        {
          id: 2,
          status: 0,
          name: "学术成果分享平台(PC端)",
          intro:
            "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
          img: designImg,
          created: "2023/8/30 15:49",
          updated: "2023/8/30 15:49",
        },
        {
          id: 3,
          status: 0,
          name: "在线商城(PC端)",
          intro:
            "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
          img: designImg,
          created: "2023/8/30 15:49",
          updated: "2023/8/30 15:49",
        },
      ],
      projectDesignList: [
        {
          id: 4,
          status: 0,
          name: "自定义原型设计1",
          intro:
            "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
          img: designImg,
          created: "2023/8/30 15:49",
          updated: "2023/8/30 15:49",
        },
        {
          id: 5,
          status: 0,
          name: "自定义原型设计2",
          intro:
            "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
          img: designImg,
          created: "2023/8/30 15:49",
          updated: "2023/8/30 15:49",
        },
        {
          id: 6,
          status: 0,
          name: "自定义原型设计3",
          intro:
            "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
          img: designImg,
          created: "2023/8/30 15:49",
          updated: "2023/8/30 15:49",
        },
      ],
    };
  },
  activated() {
    const userStore = useUserStore();
    this.projId = userStore.projectId;
    this.getList();
  },
};
</script>

<style scoped>
.template-button {
  cursor: pointer;

  margin: 5px 10px;
  --color: #0077ff;
  font-family: inherit;
  display: inline-block;
  width: 160px;
  height: 35px;
  line-height: 17.5px;
  overflow: hidden;
  font-size: 14px;
  z-index: 1;
  color: var(--color);
  border: 2px solid white;
  border-radius: 6px;
  position: relative;
}

.template-button::before {
  position: absolute;
  content: "";
  background: var(--color);
  width: 200px;
  height: 220px;
  z-index: -1;
  border-radius: 50%;
}

.template-button:hover {
  color: white;
}

.template-button:before {
  top: 100%;
  left: 100%;
  transition: 0.3s all;
}

.template-button:hover::before {
  top: -30px;
  left: -30px;
}
</style>