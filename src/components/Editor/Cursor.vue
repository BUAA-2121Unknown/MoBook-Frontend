<template>
    <transition name="cursor-transition">
        <div class="cursor-container" :style="posStyle" v-if="id != user.id">
        <!-- <div class="cursor-container" :style="posStyle"> -->
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
            return 'background-color: ' + this.generateColorFromId(Number(this.user.id))
        },
    },
    mounted() {
        console.log('多人协同光标加载：', this.user, this.generateColorFromId(Number(this.user.id)))
    },
    methods: {
        generateColorFromId(id) {
            const r = (id * 17) % 256;
            const g = (id * 31) % 256;
            const b = (id * 13) % 256;
            const alpha = 0.7; // 不透明度，可以根据需要调整
            // 返回RGBA颜色字符串
            // return `rgba(200, 200, 0, 1)`;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }
}
</script>

<style scoped>
.cursor-container {
    display: flex;
    z-index: 10;
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