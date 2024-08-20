import { Router } from 'vue-router';
import { TOKEN_KEY } from '@/config'

export function createRouterGuards(router: Router) {
    router.beforeEach((to, from, next) => {
        const Loading = window['$loading'];
        let token = localStorage.getItem(TOKEN_KEY);
        if(!token && to.path == '/login'){
            next()
        }else{
            if(!token){
                Loading && Loading.start();
                document.title = `${to.meta.title}`;
                next('/login')
            }else{
                Loading && Loading.start();
                document.title = `${to.meta.title}`;
                next()
            }
        }
    })

    router.afterEach((to, _, failure) => {
        const Loading = window['$loading'];
        Loading&& Loading.finish()
    })
    
    // 错误
    router.onError((error) => {
        console.log(error, '路由错误');
    });
}