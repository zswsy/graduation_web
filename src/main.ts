import { createApp } from 'vue'
import { setupStore } from './store'
import '../types/global.d.ts'
// import './style.css'
import 'reset-css'
import App from './App.vue'
import { setupRouter } from '@/router'
import { setupNaive } from '@/plugins'
import { AppProvider } from '@/components/AppProvider'

//加载全局自定义组件
import { ZTable } from '@/views/components/contentTable'
import { ZForm } from '@/views/components/searchForm'
import { ZDialog } from '@/views/components/contentDialog'

async function appInit() {
    const appProvider = createApp(AppProvider)

    const app = createApp(App)

    //注册ui组件
    setupNaive(app)

    //store挂在
    setupStore(app)

    // 注册全局组件
    app.component('ZTable', ZTable)
    app.component('ZForm', ZForm)
    app.component('ZDialog', ZDialog)

    //解决路由守卫axios中使用message的问题
    appProvider.mount('#zsw-appProvider',true)

    //路由初始化
    setupRouter(app)

    app.mount('#app')

    // 挂载到 window
    window['$vue'] = app

}

await appInit()
