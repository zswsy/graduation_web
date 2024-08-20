<script setup lang="ts">
import { onMounted } from 'vue'
import { AppProvider } from '@/components/AppProvider/index'
const app = document.querySelector('#app') as HTMLInputElement
onMounted(() => {
  let height = window.innerHeight
  let width = window.innerWidth
  app.style.height = height + 'px'
  app.style.width = width + 'px'
})
// defineComponent({
//   AppProvider
// })
</script>

<template>
    <AppProvider>
      <router-view></router-view>
    </AppProvider>
    
</template>

<style>
*{
  margin: 0;
  padding: 0;
}
#app{
  width: 100%;
  height: 100%;
}
</style>
