<template>
    <div class="cursor-container" :style="posStyle">
        <div class="cursor-pointer"></div>
        <div class="name">
            {{ user.name }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Cursor',
    props: ['index', 'user'],
    computed: {
        posStyle() {
            return {
                top: user.top,
                left: user.left,
            }
        }
    }
}
</script>

<style scoped>
.cursor-container {
    display: flex;
    position: absolute;
}

.cursor-pointer {
    height: 10px;
    width: 10px;
    border-radius: 5px;
}

.name {
    background-color: rgba(47, 47, 47, 0.5);
    color: rgba(240, 240, 240, 0.7);
    padding: 2px;
    font-size: 14px;
}
</style>