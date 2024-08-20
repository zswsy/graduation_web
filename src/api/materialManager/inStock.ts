import {get, post, del } from '../http'

// 获取所有库存记录
export const getAllStockDetail = async (data:any) => await post<any>('/material/inStoStock/material',data)

