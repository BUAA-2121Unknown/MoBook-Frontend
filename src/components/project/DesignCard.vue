<!-- 项目原型设计的卡片组件 -->
<template>
    <div class="design-card" @mouseenter="expandCard" @mouseleave="shrinkCard" @click="goForDetail">
        <div class="design-image-container" :style="{ backgroundImage: `url(${design.img})`, height: imageHeight }"></div>
        <div class="design-text-container" :style="{ height: textHeight }">
            <div class="design-title">{{ design.name }}</div>
            <div v-if="expanded" class="design-intro">{{ design.intro }}</div>
        </div>
        <transition name="slide-up">
            <el-row class="mb-4 doc-buttom-group" v-if="expanded">
                <DelButton :handler="delHandler"></DelButton>
                <ShareButton :handler="shareHandler"></ShareButton>
                <ModifyButton :handler="modifyHandler"></ModifyButton>
            </el-row>
        </transition>

        <!-- 项目信息修改 -->
        <el-dialog v-model="dialogFormVisible" title="项目字段修改">
        <el-form :model="form">
            <el-form-item label="标题" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="简介" :label-width="formLabelWidth">
                <el-input v-model="form.intro" :rows="2" type="textarea" placeholder="请输入简介" />
            </el-form-item>
            <el-form-item label="封面" :label-width="formLabelWidth">
                <PictureUploader :form="form"></PictureUploader>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="uploadModify">
                    确认修改
                </el-button>
            </span>
        </template>
    </el-dialog>
    </div>
</template>

<script>
import DelButton from './button/DelButton.vue';
import ShareButton from './button/ShareButton.vue';
import ModifyButton from './button/ModifyButton.vue';

export default {
    name: "DesignCard",
    props: ['design'],
    components: {
        DelButton,
        ShareButton,
        ModifyButton,
    },
    data() {
        return {
            expanded: false,
            form: {
                name: '',
                intro: '',
                url: '',
            },
            dialogFormVisible: false,
            formLabelWidth: '140px',
        };
    },
    computed: {
        imageHeight() {
            return this.expanded ? '40%' : '80%';
        },
        textHeight() {
            return this.expanded ? '60%' : '20%';
        },
    },
    methods: {
        expandCard() {
            this.expanded = true;
        },
        shrinkCard() {
            this.expanded = false;
        },
        delHandler() {
            this.$message({
                message: '成功删除原型设计',
                type: 'success'
            });
        },
        shareHandler() {
            this.$message({
                message: '成功分享原型设计',
                type: 'success'
            });
        },
        modifyHandler() {
            this.dialogFormVisible = true
            this.$message({
                message: '成功修改原型设计',
                type: 'success'
            });
        },
        uploadModify() {
            this.dialogFormVisible = false
            this.$message({
                message: '成功修改原型设计信息',
                type: 'success'
            });
            // console.log(this.form.url)
            this.form = {
                name: '',
                intro: '',
                url: '',
            }
        },
    },
};
</script>
  
<style scoped>
.design-card {
    margin: 20px 0;
    width: 350px;
    height: 280px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 6px;
    box-shadow: 0px 2px 4px 0px rgba(52, 51, 51, 0.2);
    position: relative;
}

.design-image-container {
    width: 100%;
    background-size: cover;
    background-position: center;
    transition: height 0.3s ease;
}

.design-text-container {
    background-color: rgba(237, 244, 249, 0.7);
    backdrop-filter: blur(6px);

    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    overflow: hidden;
    transition: height 0.5s ease, background-color 0.3s ease;
}

.design-title {
    margin: 10px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(5, 5, 5, 0.9);
    overflow: hidden;
    text-overflow: ellipsis;
}

.design-intro {
    margin: 10px;
    font-size: 16px;
    color: rgba(39, 39, 39, 0.9);
    overflow: hidden;
    text-overflow: ellipsis;
}

.doc-buttom-group {
    position: absolute;
    bottom: 10px;
    left: 10px;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.5s ease;
}

.v-leave-from,
.v-enter-to {
    transform: translateY(0);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(150%);
}
</style>
  