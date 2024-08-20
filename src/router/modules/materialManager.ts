import { RouteRecordRaw } from "vue-router";

export const materialManagerRouter: RouteRecordRaw[] = [
    // 订单管理-初始化
    {
        path: '/material/init',
        name: 'initMaterial',
        component: () => import("@/views/materialManage/init/index.vue"),
        meta:{
            title:'订单管理-初始化',
        }
    },
    {
        path: '/material/init/add',
        name: 'initMaterial-add',
        component: () => import("@/views/materialManage/init/add/index.vue"),
        meta:{
            title:'初始化-新增',
        }
    },
    // 订单管理-入库
    {
        path: '/material/inSto',
        name: 'inStoMaterial',
        component: () => import("@/views/materialManage/inSto/index.vue"),
        meta:{
            title:'订单管理-入库',
        }
    },
    {
        path: '/material/inSto/add',
        name: 'inStoMaterial-add',
        component: () => import("@/views/materialManage/inSto/add/index.vue"),
        meta:{
            title:'入库-新增',
        }
    },
    // 订单管理-出库
    {
        path: '/material/outSto',
        name: 'outStoMaterial',
        component: () => import("@/views/materialManage/outSto/index.vue"),
        meta:{
            title:'订单管理-出库',
        }
    },
    {
        path: '/material/outSto/add',
        name: 'outStoMaterial-add',
        component: () => import("@/views/materialManage/outSto/add/index.vue"),
        meta:{
            title:'出库-新增',
        }
    },
    // 订单管理-库存详情
    {
        path: '/material/inStock',
        name: 'inStockDetail',
        component: () => import("@/views/materialManage/inStock/index.vue"),
        meta:{
            title:'订单管理-库存详情',
        }
    },
    

]