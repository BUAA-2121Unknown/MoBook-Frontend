<template>
    <button @click="handleClick">
        分享
    </button>
</template>

<script>
export default {
    name: 'ShareButton',
    props:['handler'],
    methods:{
        handleClick(){
            this.handler()
        },
    },
}
</script>

<style scoped>
button {
    cursor: pointer;

    margin: 5px 10px;
    --color: #0077ff;
    font-family: inherit;
    display: inline-block;
    width: 70px;
    height: 35px;
    line-height: 17.5px;
    overflow: hidden;
    font-size: 14px;
    z-index: 1;
    color: var(--color);
    border: 2px solid var(--color);
    border-radius: 6px;
    position: relative;
}

button::before {
    position: absolute;
    content: "";
    background: var(--color);
    width: 280px;
    height: 220px;
    z-index: -1;
    border-radius: 50%;
}

button:hover {
    color: white;
}

button:before {
    top: 100%;
    left: 100%;
    transition: .3s all;
}

button:hover::before {
    top: -30px;
    left: -30px;
}
</style>