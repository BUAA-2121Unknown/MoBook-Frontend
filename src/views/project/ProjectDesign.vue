<!-- 项目原型设计页面 -->
<template>
  <div class="container">
    <div class="header-container">
      <h1 class="header-title">原型设计</h1>
      <div class="button-container">
        <SearchBar :handler="handleSearch"></SearchBar>
        <DesignCreateButton
          :handler="getList"
        ></DesignCreateButton>
      </div>
    </div>

    <!--  -->
    <!-- 卡片列表 -->
    <div class="design-list">
      <el-row :gutter="15">
        <el-col v-for="item in designList" :key="item.id" :span="8">
          <DesignCard
            :design="item"
            :projId="projId"
            :fatherDelHandler="delHandler"
          ></DesignCard>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from "@/stores/modules/user";
</script>
<script>
import DesignCard from "../../components/project/DesignCard.vue";
import designImg from "@/assets/project/projectDesignImg.png";
import DesignCreateButton from "../../components/project/button/DesignCreateButton.vue";
import SearchBar from "../../components/project/SearchBar.vue";

import { getPrototypeList } from "../../api/artifact";

export default {
  name: "ProjectDesign",
  components: {
    DesignCard,
    DesignCreateButton,
    SearchBar,
  },
  data() {
    return {
      designList: [
        // {
        //   id: 1,
        //   status: 0,
        //   name: "无标题原型设计",
        //   intro: "浏览器支持双值语法，当仅发现外部值时，例如当指定 display: block 或 display: inline.",
        //   img: designImg,
        // },
      ],
      orgId: undefined,
    };
  },
  methods: {
    handleSearch(input) {
      console.log("原型设计页面搜索：" + input);
    },
    delHandler(id) {
      this.designList = this.designList.filter(function (item) {
        return item.id != id;
      });
    },

    // 获取当前的原型列表
    async getList() {
      const params = {
        projId: this.projId,
      };
      try {
        const res = await getPrototypeList(params);
        console.log('开始导入原型设计列表', res);
        this.designList = res.data.artifacts.filter(function (item) {
          return item.isLive === false;
        });
        console.log('成功导入原型设计列表', this.designList);
      } catch (e) {
        console.log(e);
      }
    },
  },
  // mounted() {
  //   const userStore = useUserStore();
  //   // this.projId = this.$router.query.projId
  //   // console.log(this.projId)
  //   this.projId = userStore.projectId;
  //   this.getList();
  // },
  activated() {
    const userStore = useUserStore();
    // this.projId = this.$router.query.projId
    // console.log(this.projId)
    this.projId = userStore.projectId;
    this.getList();
  },
};
</script>
  
<style scoped>
.design-list {
  margin: 5px 60px;
}

.header-container {
  background-color: rgba(243, 243, 243, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-container{
  display: flex;
  align-items: center;
}

.header-title {
  padding: 0 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
  