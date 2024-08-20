import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { RequestResultEnum } from '@/enums/httpEnum';
import { TOKEN_KEY,NAV_KEY } from '@/config'
// import { useRouter } from 'vue-router'
// const router = useRouter()
// console.log(router,'router');


const request:AxiosInstance = axios.create({
    // baseURL:import.meta.env.VITE_APP_BASE_UR,
    baseURL:'/api',
    timeout: RequestResultEnum.TIMEOUT,
    headers:{
      "Content-Type": "application/json;charset=utf-8"
    }
})

const whiteList = ['/login','/capture'];

request.interceptors.request.use(
    (config: InternalAxiosRequestConfig)=>{
      // console.log(config,'config');
      if(whiteList.indexOf(config.url as string) === -1){
        config.headers!.Authorization = JSON.parse(localStorage.getItem(TOKEN_KEY) as string)  || '' 
      }
      // console.log('请求拦截器正确',config.headers);
      return config
    },
    (error: InternalAxiosRequestConfig)=>{
        return Promise.reject(error)
    }
);

// 添加响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
      // console.log('响应拦截器正确',response);
      if(response.data.status === 2){
        window['$message'].error(response.data.message)
        localStorage.removeItem(TOKEN_KEY)
        location.hash = '/login'
        response.data.status = 0
        response.data.message = '登录过期，请重新登录'
      }
      // 对响应数据做点什么
      return response;
    },
    (error: AxiosResponse) => {
      // 处理响应错误
      return Promise.reject(error);
    },
  );

  export default request;