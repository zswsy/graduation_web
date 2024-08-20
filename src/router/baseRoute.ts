//基础路由
import { RouteRecordRaw } from 'vue-router'

import { PageEnum } from '@/enums/pageEnum'

import { errorPage404, errorPage403, errorPage500, layout } from './constant'

export const HttpErrorPage: RouteRecordRaw[] = [
    {
        path: '/error/404',
        component: errorPage404,
        meta:{
            title:PageEnum.ERROR_PAGE_NAME_404
        }
    },
    {
        path: '/error/403',
        component: errorPage403,
        meta:{
            title:PageEnum.ERROR_PAGE_NAME_403
        }
    },
    {
        path: '/error/500',
        component: errorPage500,
        meta:{
            title:PageEnum.ERROR_PAGE_NAME_500
        }
    },
]

export const LoginRoute: RouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  };