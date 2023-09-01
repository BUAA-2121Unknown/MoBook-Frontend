<template>
    <transition name="cursor-transition">
        <!-- <div class="cursor-container" :style="posStyle" v-if="id != user.id"> -->
        <div class="cursor-container" :style="posStyle">
            <div class="cursor-pointer" :style="cursorStyle"></div>
            <div class="name">
                {{ user.name }}
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Cursor',
    props: ['index', 'user', 'id'],
    computed: {
        // 鼠标位置
        posStyle() {
            return {
                position: 'absolute',
                top: this.user.y + 'px',
                left: this.user.x + 'px',
            }
        },
        // 鼠标颜色
        cursorStyle() {
            const str = 'background-color: '
            if (this.user.id % 3 == 0) {
                return str + 'rgba(255, 51, 51, 0.7)'
            }
            else if (this.user.id % 3 == 1) {
                return str + 'rgba(51, 245, 255, 0.7)'
            }
            else if (this.user.id % 3 == 2) {
                return str + 'rgba(51, 255, 82, 0.7)'
            }
        },
    },
    mounted() {
        console.log('多人协同光标加载：', this.user)
    },
}
</script>

<style scoped>
.cursor-container {
    display: flex;
}

.cursor-pointer {
    height: 8px;
    width: 8px;
    border-radius: 4px;
}

.name {
    /* background-color: rgba(51, 255, 82, 0.7); */
    margin: 3px;
    background-color: rgba(47, 47, 47, 0.7);
    color: rgba(240, 240, 240, 0.7);
    padding: 2px;
    font-size: 12px;
    height: 16px;
    min-width: 16px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cursor-transition-enter-active,
.cursor-transition-leave-active {
    transition: all 0.07s ease;
}

/* .cursor-transition-enter,
.cursor-transition-leave-to {
    top: 0;
    left: 0;
} */
</style>