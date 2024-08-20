import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { HttpErrorPage, LoginRoute} from './baseRoute'
import { layout } from './constant'
import { createRouterGuards } from './router_guards'
import { pagesRouter } from './modules/index'

const RootRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Root',
        component:layout,
        meta: {
            title: '首页'
        },
        children: [
            ...pagesRouter,
            ...HttpErrorPage
        ]
    }
]

const constantRoutes: RouteRecordRaw[] = [
    LoginRoute,
    ...RootRoutes
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
    strict: true,
  // 每次切换路由页面滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

export function setupRouter(app: App) {
    app.use(router);
    // 创建路由守卫
    createRouterGuards(router)
  }

export default router

