<!-- 每个主页的导航栏 -->
<template>
  <div class="bar-container">
    <input class="input-area" type="search" v-model="input" placeholder="输入关键字检索已有文档" @keyup.enter="handleSearch" />
    <button class="search-input-button" type="button" @click="handleSearch">
      检索
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: ['handler'],
  data() {
    return {
      input: '',
    }
  },
  methods: {
    // 以输入关键字作为参数跳转到搜索页面 在搜索页面再根据输入的关键字进行搜索
    handleSearch() {
      if (!this.input) {
        this.$message.error('请输入搜索内容')
        return
      }
      else {
        this.handler(this.input)
      }
      // this.$router.push({
      //     name: 'search',
      //     params: {
      //         index: this.index,
      //         input: this.input
      //     }
      // })
    },
  },
}
</script>

<style scoped>
.bar-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.input-area {
  padding: 5px;
  width: 280px;
  border: 2px solid #d5d5d5;
  resize: vertical;
  background-color: rgba(255, 252, 252, 0.7);
  border-radius: 5px;
  margin: 0 1px 0 20px;
  transition: all .3s ease;
  /* 字体 */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 15px;
  color: #2c3e50;
}

.input-area:focus {
  border-color: rgb(73, 73, 73);
  outline: rgb(154, 153, 153);
  z-index: 100;
}

.search-input-button {
  margin: 0 4px;
  width: 50px;
  height: 33px;
  outline: none;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 4px 6px;
  font-size: 12px;
  /* line-height: 1px; */
  transition: all .3s ease;
  background-color: rgba(147, 146, 146, 0.4);

  border: 2px solid rgba(248, 247, 237, 0.8);
  box-shadow: 0px 1px 2px 0px rgba(232, 247, 61, 0.2);

  cursor: pointer;
}

.search-input-button:hover {
  background-color: rgb(52, 51, 51);
  color: #fcfeec;
}
</style>