<template>
  <div class="headerContent">
    <div class="leftContent">智能仓储管理系统</div>
    <i></i>
    <div class="rightContent">
      <n-space >
        <span class="username">{{ userStore.userInfo?.username }}</span>
        <n-popconfirm
          @positive-click="logout"
          @negative-click=""
          positive-text="确定"
          negative-text="取消"
        >
          <template #trigger>
            <n-button circle text>
                <n-icon size="18" :component="PowerSharpIcon" />
                <i style="margin-left: 5px;">退出</i>
            </n-button>
          </template>
          是否选择退出？
        </n-popconfirm>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useStoreSetup } from '@/store/modules/user'
import { TOKEN_KEY, MENU_KEY,NAV_KEY } from '@/config'

// 导入图标
import { icon } from '@/plugins/index.ts'
const { PowerSharpIcon } = icon.ionicons5

const userStore = useStoreSetup()
// console.log(userStore.userInfo)

const a = ref(1)

// 退出
const logout = () => {
    // 退出逻辑
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(MENU_KEY)
    localStorage.removeItem(NAV_KEY)
    router.push('/login')
    window['$message'].success('退出成功')
}
</script>
