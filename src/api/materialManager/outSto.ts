import {get, post, del } from '../http'

// 获取所有订单
export const getAllOutSto = async (data:any) => await post<any>('/material/outSto/list',data)

// 删除初始化订单
export const delOutStoByIds = async (data:any) => await post<any>('/material/outSto/del',data)

// 新增库存初始化
export const addOutSto = async (data:any) => await post<any>('/material/outSto/out',data)

// 获取仓库库存物料列表
export const getOutMaterialList = async () => await post<any>('/material/outSto/material')

// 物料获取所有库位信息
export const materialGetAllLocation = async (data:any) => await post<any>('/material/outSto/matGetLoc',data)

// 物料库位获取库位库存数量
export const matLocGetStockNum = async (data:any) => await post<any>('/material/outSto/matLocGetStocNum',data)


