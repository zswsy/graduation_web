import { get, post } from '../http'

// 初始化报表
export const initReport = async (data:any) => await post<any>('/report/init',data)

// 入库报表
export const inStoReport = async (data:any) => await post<any>('/report/inSto',data)

// 出库报表
export const outStoReport = async (data:any) => await post<any>('/report/outSto',data)





