<template>
    <div class="scroll-container" @wheel="handleScroll">
        <header class="masthead">
            <div class="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                <div class="d-flex justify-content-center">
                    <div class="text-center">
                        <h1 class="mx-auto my-0 text-uppercase" :style="{ 'font-size': '100px' }">墨书</h1>
                        <div class="header-title2">在线一体化产品设计协作平台</div>
                        <a class="btn btn-primary header-button" @click="handleClick">立即试用</a>
                    </div>
                </div>
            </div>
        </header>
        <div class="body1">
            <div class="sub-title1">
                三大产品模块, 释放组织生产力
            </div>
            <div class="description" style="margin: 40px 0 20px 0;">
                墨书提供团队交流，项目文档，原型设计，三大产品模块，为您提供企业级的团队管理与项目管理.
            </div>
            <div class="description" style="margin: 20px 0 40px 0;">
                致力于打造面向未来的多人实时协作的企业级管理平台.
            </div>
        </div>
        <div class="body2">
            <div class="text-side">
                <p class="text-title">
                    在线文档
                </p>
                <el-divider />
                <p class="text-text">
                    🔥多人多端同步协作编辑文档，为生产助力
                </p>
                <p class="text-text">
                    👍多层树形结构，轻松分类管理
                </p>
                <p class="text-text">
                    ⚡多样模板，快速上手，即刻编辑
                </p>
                <button @click="handleClick" class="button1">即刻体验</button>
            </div>
            <div class="img-side">
                <img src="./assets/img/org-1.png" class="text-img">
            </div>
        </div>
        <div class="body3">
            <div class="img-side">
                <img src="./assets/img/proto-1.png" class="text-img">
            </div>
            <div class="text-side">
                <p class="text-title">
                    原型设计
                </p>
                <el-divider />
                <p class="text-text">
                    🤔多人光标协同，实时云端编辑
                </p>
                <p class="text-text">
                    😊在线预览，交流沟通零障碍
                </p>
                <p class="text-text">
                    😍 HTML+CSS代码导出，所见即所得
                </p>
                <button @click="handleClick" class="button1">即刻体验</button>
            </div>
        </div>
        <div class="body2">
            <div class="text-side">
                <p class="text-title">
                    团队交流
                </p>
                <el-divider />
                <p class="text-text">
                    🎁实时同步聊天，私聊群聊两不误
                </p>
                <p class="text-text">
                    😆重要消息即时传达，随手跳转
                </p>
                <p class="text-text">
                    😁信息转发，原汁原味，忒地道
                </p>
                <button @click="handleClick" class="button1">即刻体验</button>
            </div>
            <div class="img-side">
                <img src="./assets/img/org-1.png" class="text-img">
            </div>
        </div>
        <div class="body4" style="">
            <div class="sub-title">
                更多惊喜能力，等你来探索
            </div>
            <div class="bottom-button">
                <button @click="handleClick" class="button1">即刻体验</button>
            </div>
            <BottomInfo></BottomInfo>
        </div>
        
    </div>
</template>
  
<script>
import BottomInfo from '@/layouts/bottomInfo/bottomInfo.vue'

export default {
    components:{
        BottomInfo,
    },
    data() {
        return {

        };
    },
    methods: {
        handleClick(){
            this.$router.push('/')
        }
    },
};

</script>
<style scoped>
/* 在这里引入外部CSS文件 */
@import './css//styles.css';
/* 这里可以添加其他样式规则 */
</style>
<style scoped>
.body4 {
    width: 100%;
    padding: 40px 0;
    margin: 0 auto;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(224, 224, 224, 0.7) 75%, #919191 100%), url("./assets/img/bg-signup.jpg");
}

.body3 {
    padding: 100px;
    height: 60%;
    width: 100%;
    /* margin: 0 auto; */
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    /* flex-direction: row; */
    background-color: rgba(240, 244, 244, 0.8);
}

.button1 {
    cursor: pointer;

    margin: 30px 10px;
    --color: #4b4b4b;
    font-family: inherit;
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 17.5px;
    overflow: hidden;
    font-size: 14px;
    z-index: 1;
    color: var(--color);
    border: 2px solid var(--color);
    border-radius: 6px;
    position: relative;
}

.button1::before {
    position: absolute;
    content: "";
    background: var(--color);
    width: 280px;
    height: 220px;
    z-index: -1;
    border-radius: 50%;
}

.button1:hover {
    color: white;
}

.button1:before {
    top: 100%;
    left: 100%;
    transition: 0.3s all;
}

.button1:hover::before {
    top: -30px;
    left: -30px;
}

.text-title {
    margin: 20px;
    font-size: 29px;
    color: #393939;
    text-shadow: 0 2px rgb(198, 198, 198);
}

.text-text {
    margin: 15px 5px;
    font-size: 20px;
    color: #393939;
    text-shadow: 0 1px rgb(198, 198, 198);
    line-height: 22px;
}

.text-img {
    margin: 5px;
    width: 100%;
    font-size: 24px;
    color: #5c5c5c;
    border: 1px solid rgba(231, 231, 231, 0.8);
    box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.2);
}

.img-side {
    /* margin: 0 auto; */
    flex: 1;
    /* 让图片占据剩余空间 */
    text-align: center;
    /* 图片水平居中对齐 */
    padding: 20px 80px 20px 80px;
    /* 可以根据需要调整内边距 */
}

.text-side {
    margin: 0 auto;
    flex: 1;
    /* 让文本占据剩余空间 */
    padding: 40px 80px 40px 80px;
    /* 可以根据需要调整内边距 */
    text-align: center;
}

.body2 {
    padding: 100px;
    height: 60%;
    width: 100%;
    /* margin: 0 auto; */
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    /* flex-direction: row; */
    background-color: rgba(252, 252, 252, 0.8);
    /* padding: 100px; */
}

.body1 {
    height: 500px;
    background: linear-gradient(to bottom, #000 0%, rgba(41, 41, 41, 0.9) 75%, rgba(88, 88, 88, 0.8) 100%);
}

.bottom-button {
    margin: 0 auto;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sub-title1 {
    color: rgba(222, 222, 222, 0.8);
    font-size: 30px;
    margin: 0 auto;
    padding: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 6px
}

.sub-title {
    color: rgb(8, 8, 8);
    font-size: 30px;
    margin: 0 auto;
    padding: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 6px
}

.description {
    color: rgb(161, 161, 161);
    font-size: 20px;
    font-weight: 400;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    /* letter-spacing: 5px */
}

.header-title2 {
    color: rgb(209, 209, 209);
    font-size: 28px;
    margin: 40px;
    letter-spacing: 6px
}

.scroll-container {
    height: 100vh;
    /* 设置容器高度，以充满整个视口 */
    overflow-y: scroll;
    /* 添加垂直滚动条 */
    /* position: relative; */
    /* 使得内容可以相对于容器滚动 */
    background-color: white;
}

.header-button {
    color: rgb(231, 231, 231);
    font-size: 18px;
}

.scroll-down-container {
    text-align: center;
    position: relative;
    /* 背景色为白色 */
    padding: 30px 0;
}

/* 设置箭头的样式 */
.scroll-down-arrow {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
}

/* 设置箭头图标的样式 */
.scroll-down-arrow i {
    display: block;
    width: 100%;
    height: auto;
}

/* 设置文字样式 */
.scroll-down-text {
    font-size: 18px;
    color: #333;
    /* 文字颜色 */
    margin-top: 10px;
}
</style>
