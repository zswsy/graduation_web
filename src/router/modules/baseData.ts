import { RouteRecordRaw } from "vue-router";

export const basicDataRouter: RouteRecordRaw[] = [
    // 基础数据-物料
    {
        path: '/data/material',
        name: 'material',
        component: () => import("@/views/basicData/material/index.vue"),
        meta:{
            title:'基础数据-物料',
        }
    },
    // 基础数据-供应商
    {
        path: '/data/supplier',
        name: 'supplier',
        component: () => import("@/views/basicData/supplier/index.vue"),
        meta:{
            title:'基础数据-供应商',
        }
    },
    // 基础数据-工程
    {
        path: '/data/project',
        name: 'project',
        component: () => import("@/views/basicData/project/index.vue"),
        meta:{
            title:'基础数据-工程',
        }
    },
    // 基础数据-仓库
    {
        path: '/data/store',
        name: 'store',
        component: () => import("@/views/basicData/store/index.vue"),
        meta:{
            title:'基础数据-仓库',
        }
    },
    // 基础数据-库区
    {
        path: '/data/area',
        name: 'area',
        component: () => import("@/views/basicData/area/index.vue"),
        meta:{
            title:'基础数据-库区',
        }
    },
    // 基础数据-库位
    {
        path: '/data/location',
        name: 'location',
        component: () => import("@/views/basicData/location/index.vue"),
        meta:{
            title:'基础数据-库位',
        }
    },

]


