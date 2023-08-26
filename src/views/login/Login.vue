<template>
  <div id="userLayout" class="w-full h-full relative">
    <div
      class="rounded-lg flex items-center justify-evenly w-full h-full bg-white md:w-screen md:h-screen md:bg-[#194bfb]"
    >
      <div class="md:w-3/5 w-10/12 h-full flex items-center justify-evenly">
        <div class="oblique h-[130%] w-3/5 bg-white transform -rotate-12 absolute -ml-52" />
        <!-- 分割斜块 -->
        <div class="z-[999] pt-12 pb-10 md:w-96 w-full  rounded-lg flex flex-col justify-between box-border">
          <div>
            <div class="flex items-center justify-center">
              <img class="w-24" :src="$MoBook.appLogo" alt>
            </div>
            <div class="mb-9">
              <p class="text-center text-4xl font-bold">{{ $MoBook.appName }}</p>
              <p class="text-center text-sm font-normal text-gray-500 mt-2.5">A management platform using Vue and Django
              </p>
            </div>
            <LoginForm v-if="currentOption === 'login'" />
            <RegisterForm v-if="currentOption === 'register'" />
          </div>
        </div>
      </div>
      <div class="hidden md:block w-1/2 h-full float-right bg-[#194bfb]"><img
        class="h-full"
        src="@/assets/login_right_banner.jpg"
        alt="banner"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
}
</script>

<script setup>
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import emitter from '@/utils/emitter'

const currentOption = ref('login')

emitter.on('setCurrentOption', (option) => {
  currentOption.value = option
})
</script>
