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
        <DesignCreateButton class="header-button"></DesignCreateButton>
      </el-col>
    </el-row>

    <!--  -->
    <!-- 卡片列表 -->
    <div class="design-list">
      <el-row :gutter="15">
        <el-col v-for="item in designList" :key="item.id" :span="8">
          <DesignCard :design="item" :delHandler="delHandler"></DesignCard>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
  
<script>
import DesignCard from '../../components/project/DesignCard.vue';
import designImg from '@/assets/project/projectDesignImg.png'
import DesignCreateButton from '../../components/project/button/DesignCreateButton.vue';
import SearchBar from '../../components/project/SearchBar.vue';

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
          name: '无标题原型a',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 2,
          name: '无标题原型b',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 3,
          name: '无标题原型c',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 4,
          name: '无标题原型d',
          intro: 'asdgmerioioioioioioioiof',
          img: designImg,
        },
        {
          id: 5,
          name: '无标题原型e',
          intro: '123',
          img: designImg,
        },
      ],
    }
  },
  methods: {
    handleSearch(input) {
      console.log('原型设计页面搜索：' + input)
    },
    delHandler(id) {
      this.designList = this.designList.filter(function(itemId) {
        return itemId != id
      })
    },
  },
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
  