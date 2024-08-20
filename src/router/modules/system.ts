import { RouteRecordRaw } from "vue-router";

export const systemRouter: RouteRecordRaw[] = [
    //系统管理-角色管理
    {
        path: '/system/role',
        name: 'role',
        component: () => import("@/views/system/role/index.vue"),
        meta:{
            title:'系统管理-角色',
        }
    },
    //系统管理-用户管理
    {
        path: '/system/user',
        name: 'usera',
        component: () => import("@/views/system/user/index.vue"),
        meta:{
            title:'系统管理-用户',
        }
    },

]


