<template>
  <div class="topNav">
    <div class="leftItem" >
      <template v-for="(i, index) in menuOptions">
        <div
          class="navItem"
          :class="{ active: i.path === route.path}"
          @click="menuClick(i)"
        >
          <b></b>
          <span>{{ i.meta.title }}</span>
          <i @click.stop="del(index)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                fill="currentColor"
              ></path>
            </svg>
          </i>
        </div>
      </template>
    </div>
    <n-button type="primary" @click="delOther">
        关闭其他标签
    </n-button>
  </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { ref, nextTick, onMounted, watch} from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { NAV_KEY } from '@/config'
const router = useRouter()
const route = useRoute()
import { NavItem } from './index'
const menuOptions = ref<any> (JSON.parse(localStorage.getItem(NAV_KEY) as string) || [
  {
    path:'/',
    meta:{
      title:'首页'
    }
  },
]) 

//轮询高度
const queryHeight = ():void  => {
    const height = document.querySelector('.leftItem')?.scrollHeight || 0
    if (height > 35) {
        del(1)
    }
}
//跳转路由
const menuClick = (path: NavItem):void => {
  console.log('click');
  
  router.push({ path: path.path })
}

//删除路由
const del = (index: number) => {
  if(route.path === menuOptions.value[index].path){
    menuOptions.value.splice(index, 1)
    router.push({ path: menuOptions.value[index - 1].path })
  }else{
    menuOptions.value.splice(index, 1)
  }
  // menuOptions.value.splice(menuOptions.value.length-1, 1)
  nextTick(() => {
    queryHeight()
  })
}

//  去除其他标签
const delOther = () => {
    menuOptions.value = menuOptions.value.filter((item:NavItem) => item.path === route.path || item.path === '/')
    localStorage.setItem(NAV_KEY, JSON.stringify(menuOptions.value))
}

// 路由初始化
const initNav = () => {
  // console.log(JSON.parse(localStorage.getItem(NAV_KEY)),'init');
  if(JSON.parse(localStorage.getItem(NAV_KEY) as string)){
    menuOptions.value = JSON.parse(localStorage.getItem(NAV_KEY) as string)
  }else{
    localStorage.setItem(NAV_KEY, JSON.stringify([{path:'/',meta:{title:'首页'}}]))
  }
}

// 路由是否存在在列表中
const isExist = (route:any): boolean => {
  let tempArr = menuOptions.value.filter((item:any) => item.path === route.path)
  if (tempArr.length > 0) return true
  else return false
}

// 监听路由变化
watch(route, (now) => {
  if(isExist(now)) return
  else {
    menuOptions.value.push({path:now.path,meta:{title:now.meta.title}})
    localStorage.setItem(NAV_KEY, JSON.stringify(menuOptions.value))
    nextTick(() => {
      queryHeight()
    })
  }
},{
  immediate:true,
  deep:true
})

onMounted(() => {
  queryHeight()
  initNav()
})

</script>
