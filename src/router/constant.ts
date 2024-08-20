//常量路由 404 错误页面 布局页面

export const layout = () => import("@/views/layout/index.vue");

export const errorPage403 = () => import("@/views/errorPage/403.vue");
export const errorPage404 = () => import("@/views/errorPage/404.vue");
export const errorPage500 = () => import("@/views/errorPage/500.vue");

