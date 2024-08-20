import { RouteRecordRaw } from "vue-router";

export const dataReportRouter: RouteRecordRaw[] = [
    // 报表管理-初始化
    {
        path: '/report/init',
        name: 'initReport',
        component: () => import("@/views/dataReport/init/index.vue"),
        meta:{
            title:'报表-初始化',
        }
    },
    // 报表管理-入库
    {
        path: '/report/inSto',
        name: 'inStoReport',
        component: () => import("@/views/dataReport/inSto/index.vue"),
        meta:{
            title:'报表-入库',
        }
    },
    // 报表管理-初始化
    {
        path: '/report/outSto',
        name: 'outStoReport',
        component: () => import("@/views/dataReport/outSto/index.vue"),
        meta:{
            title:'报表-出库',
        }
    },

]


