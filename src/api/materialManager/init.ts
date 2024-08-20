import {get, post, del } from '../http'

// 获取所有订单
export const getAllInit = async (data:any) => await post<any>('/material/init/list',data)

// 删除初始化订单
export const delInitByIds = async (data:any) => await post<any>('/material/init/del',data)

// 新增库存初始化
export const addInit = async (data:any) => await post<any>('/material/init',data)

// 物料订单号编号
export const genOrderNum = async (type:any) => await get<any>(`/material/orderNo?type=${type}`,)





