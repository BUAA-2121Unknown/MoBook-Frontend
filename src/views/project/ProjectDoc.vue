<!-- 项目文档页面 -->
<template>
  <div class="container">
    <el-row :gutter="20" class="header-container">
      <el-col :span="12">
        <h1 class="header-title">项目文档</h1>
      </el-col>
      <el-col :span="8">
        <SearchBar :handler="handleSearch"></SearchBar>
      </el-col>
      <el-col :span="4">
        <DocCreateButton class="header-button"></DocCreateButton>
      </el-col>
    </el-row>
    <!-- 卡片列表 -->
    <div class="doc-list">
      <el-row :gutter="20">
        <el-col v-for="item in docList" :key="item.id" :span="6">
          <DocCard :doc="item"></DocCard>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
  
<script>
import DocCard from '../../components/project/DocCard.vue';
import docImg from '@/assets/project/projectDocImg.jpg'
import DocCreateButton from '../../components/project/DocCreateButton.vue';
import SearchBar from '../../components/project/SearchBar.vue';

export default {
  name: "ProjectDoc",
  components: {
    DocCard,
    DocCreateButton,
    SearchBar,
  },
  data() {
    return {
      docList: [
        {
          id: 1,
          name: '无标题文档a',
          intro: 'asdgmerioioioioioioioiof',
          img: docImg,
        },
        {
          id: 2,
          name: '无标题文档b',
          intro: 'asdgmerioioioioioioioiof',
          img: docImg,
        },
        {
          id: 3,
          name: '无标题文档c',
          intro: 'asdgmerioioioioioioioiof',
          img: docImg,
        },
        {
          id: 4,
          name: '无标题文档d',
          intro: 'asdgmerioioioioioioioiof',
          img: docImg,
        },
        {
          id: 5,
          name: '无标题文档e',
          intro: '123',
          img: docImg,
        },
      ],
    }
  },
  methods: {
    handleSearch(input) {
      console.log('项目文档页面搜索：' + input)
    }
  },
};
</script>
  
<style scoped>
.doc-list {
  margin: 5px 30px;
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
  