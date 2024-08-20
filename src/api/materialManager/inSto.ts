import {get, post, del } from '../http'

// 获取所有订单
export const getAllInSto = async (data:any) => await post<any>('/material/inSto/list',data)

// 删除初始化订单
export const delInStoByIds = async (data:any) => await post<any>('/material/inSto/del',data)

// 新增库存初始化
export const addInSto = async (data:any) => await post<any>('/material/inSto/insert',data)

// 获取库位剩余数量
export const locationRestNum = async (data:any) => await post<any>('/material/location/rest',data)




