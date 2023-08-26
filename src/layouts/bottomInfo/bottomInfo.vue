<template>
  <div class="flex gap-4 items-center text-sm text-gray-500 justify-center mb-4">
    <span>Powered by</span>
    <span>
      <a class="text-gray-800 font-bold" :href="$MoBook.appRepoURL">{{ $MoBook.appName }}</a>
    </span>
    <slot />
    <span>Copyright</span>
    <span>
      <a class="text-gray-800 font-bold" :href="$MoBook.appOrgURL">Unknown 团队</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BottomInfo'
}
</script>
