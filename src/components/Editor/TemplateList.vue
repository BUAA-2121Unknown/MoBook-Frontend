<!-- 模板块 -->
<template>
  <button @click="handleClick" class="template-button" id="tour-prototype-step-1">模板库</button>

  <!-- 弹出窗 -->
  <el-dialog v-model="dialogTableVisible" title="模板库" width="70%">
    <!-- 项目模板 -->
    <div class="header-container">
      <div style="display: flex; align-items: center">
        <h3 class="header-title">项目模板</h3>
        <button @click="handleCreate" class="template-button">
          保存当前设计为模板
        </button>
      </div>
      <div class="design-list">
        <el-row :gutter="10">
          <el-col v-for="item in projectDesignList" :key="item.id" :span="8">
            <TemplateCard :design="item" :projId="projId" :loadHandler="handleClose" :isDefault="false"
              :fatherHandler="fatherHandler"></TemplateCard>
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
            <TemplateCard :design="item" :projId="projId" :loadHandler="handleClose" :isDefault="true"></TemplateCard>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import designImg from "@/assets/project/projectDesignImg.png";
import TemplateCard from "@/components/project/TemplateCard.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { mapState } from "vuex";
import { useUserStore } from "../../stores/modules/user";
import { getPrototypeList, createPrototype, savePrototype } from "../../api/artifact";
import { templateList } from '@/enums/prototypeTemplateEnum'

export default {
  name: "TemplateList",
  components: {
    TemplateCard,
  },
  props: ['itemId'],
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
    // 保存当前设计为模板的包装函数
    handleCreate() {
      ElMessageBox.prompt("请输入模板标题。", "保存为模板", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          console.log(value)
          value = value ? value : '未命名模板'
          // 执行保存函数
          this.createTemplate(value);

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
    // y保存模板的实际实现函数 实际上为创建一个原型设计
    async createTemplate(name) {
      const data = {
        projId: Number(this.projId),
        itemId: Number(this.itemId),
        filename: name,
        prop: 3,
        live: false,
        sibling: true,
        content: JSON.stringify({
          canvasData: { array: this.componentData },
          canvasStyle: this.canvasStyleData,
        }),
      };
      try {
        // 创建原型设计
        const res = await createPrototype(data);
        console.log("成功创建原型设计模板", res);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    },

    // y获取全部项目模板列表
    async getList() {
      const params = {
        projId: this.projId,
        status: 0,
      };
      try {
        const res = await getPrototypeList(params);
        this.projectDesignList = res.data.filter(function (item) {
          return item.data.prop == 3;
        });
        console.log("成功导入原型设计模板列表", res, this.projectDesignList);
      } catch (e) {
        console.log(e);
      }
    },

    fatherHandler() {
      this.$store.commit("recordSnapshot");
      this.getList()
    },

    // 获取默认项目模板列表
    getDefaultTemplateList() {
      this.defaultDesignList = templateList
      console.log('导入默认模板列表', this.defaultDesignList)
    },
    // 将指定模板在前端假移除
    handleDel(id) {
      this.projectDesignList = this.projectDesignList.filter(function (item) {
        return item.id != id;
      });
    }
  },
  data() {
    return {
      projId: -1,
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
    this.getDefaultTemplateList()
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