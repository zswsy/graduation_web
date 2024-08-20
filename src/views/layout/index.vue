<template>
  <div class="layoutcontent">
    <n-layout>
      <n-layout-header> 
        <header-content/>
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="220"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu
            v-model:value="activeKey"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :collapsed="collapsed"
            :root-indent="35"
            :indent="15"
          ></n-menu>
        </n-layout-sider>
        <n-layout-content>
          <nav-list></nav-list>
          <div class="contentContainer">
            <template v-if="!isHome">
              <router-view></router-view>
            </template>
            <template v-else>
              <n-empty description="首页暂时没有数据" size="huge"></n-empty>
            </template>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { h, defineComponent, ref, Component, watchEffect } from 'vue'
import { useRoute} from 'vue-router'
const route = useRoute()
import { NIcon, MenuOption } from 'naive-ui'
import { MENU_KEY } from '@/config'
import { RouterLink } from 'vue-router'

//导入图标
import { icon } from '@/plugins/index.ts'
const { BookIcon, OrderIcon, SettingIcon } = icon.ionicons5
const { DatabaseIcon, ReportIcon } = icon.tabler

// 组件导入
import { HeaderContent } from '@/components/headerContent'
import { NavList } from '@/components/topNav'

// 菜单栏图标object
type iconType = keyof typeof iconComponents
const iconComponents = {
  BookIcon,
  OrderIcon,
  SettingIcon,
  DatabaseIcon,
  ReportIcon,
}




function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const collapsed = ref(false)
const activeKey = ref('')

const menuOptions = ref<MenuOption[]>([])
// 生成菜单
const generateMenu = () => {
  const basicMenu = JSON.parse(localStorage.getItem(MENU_KEY) || '[]')

  menuOptions.value = basicMenu.map((item: any) => {
    if (item.children && item.children.length > 0) {
      item.children = item.children.map((child: any) => {
        return {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  path: child.path,
                },
              },
              { default: () => child.name }
            ),
          key: child.name,
          icon: renderIcon(child.icon || ''),
        }
      })
      return {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: item.path,
              },
            },
            { default: () => item.name }
          ),
        children: item.children,
        key: item.name,
        icon: renderIcon(iconComponents[item.icon as iconType] || ''),
      }
    } else {
      return {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: item.path,
              },
            },
            { default: () => item.name }
          ),
        key: item.name,
        icon: renderIcon(iconComponents[item.icon as iconType] || ''),
      }
    }
  })
  // console.log(menuOptions.value);
}
generateMenu()

// 查看是否是首页
const isHome = ref(true)
watchEffect(() => {
  const bool = route.path === '/'
  isHome.value = bool
})
</script>
