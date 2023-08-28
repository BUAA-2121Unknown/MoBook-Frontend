<!-- 项目原型设计页面 -->
<template>
  <div class="container">
    <el-row :gutter="20" class="header-container">
      <el-col :span="12">
        <h1 class="header-title">原型设计</h1>
      </el-col>
      <el-col :span="8">
        <SearchBar :handler="handleSearch"></SearchBar>
      </el-col>
      <el-col :span="4">
        <DesignCreateButton class="header-button" :handler="getList"></DesignCreateButton>
      </el-col>
    </el-row>

    <!--  -->
    <!-- 卡片列表 -->
    <div class="design-list">
      <el-row :gutter="15">
        <el-col v-for="item in designList" :key="item.id" :span="8">
          <DesignCard :design="item" :projId="projId" :fatherDelHandler="delHandler"></DesignCard>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
  import { useUserStore } from "@/stores/modules/user";
</script>
<script>
import DesignCard from '../../components/project/DesignCard.vue';
import designImg from '@/assets/project/projectDesignImg.png'
import DesignCreateButton from '../../components/project/button/DesignCreateButton.vue';
import SearchBar from '../../components/project/SearchBar.vue';

import { getPrototypeList } from '../../api/artifact';

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
        {
          id: 1,
          status: 0,
          name: '无标题原型a',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 2,
          status: 0,
          name: '无标题原型b',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 3,
          status: 0,
          name: '无标题原型c',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 4,
          status: 0,
          name: '无标题原型d',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 5,
          status: 0,
          name: '无标题原型e',
          intro: '123',
          img: designImg,
        },
      ],
      orgId: undefined,
    }
  },
  methods: {
    handleSearch(input) {
      console.log('原型设计页面搜索：' + input)
    },
    delHandler(id) {
      this.designList = this.designList.filter(function(item) {
        return item.id != id
      })
    },

    // 获取当前的原型列表
    async getList(){
      console.log(this.projId)
      const params = { 
        projId: this.projId,
      }
      try {
        const res = await getPrototypeList(params);
        console.log(res)
        this.designList = res.data.artifacts.filter(function(item){
          return item.isLive === false
        })
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted() {
    const userStore = useUserStore();
    // this.projId = this.$router.query.projId
    // console.log(this.projId)
    this.projId = userStore.projectId
    this.getList()
  }
};
</script>
  
<style scoped>
.design-list {
  margin: 5px 60px;
}

.header-container {
  background-color: rgba(243, 243, 243, 0.8);
  align-items: center;
}

.header-title {
  padding: 0 30px;
}

.header-button {
  margin: 0 auto;
}
</style>
  