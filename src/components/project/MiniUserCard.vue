<template>
  <div class="usercard-container">
    <img :src="userInfo.avatarUrl" class="usercard-img">
    <span class="usercard-name">{{ userInfo.name }}</span>
  </div>
</template>

<script>
export default {
    name: 'miniUserCard',
    props: ['userInfo'],
}
</script>

<style scoped>
.usercard-container{
    margin: 2px;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.usercard-img{
    margin: 5px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 8px;
}
.usercard-name{
    font-size: 16px;
    font-weight: 800;
    color: rgba(5, 5, 5, 0.9);
}
</style>