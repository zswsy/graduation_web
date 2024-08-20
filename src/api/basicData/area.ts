import {get, post, del } from '../http'

//获取所有物料
export const getAll = async () => await get<any>('/data/area/all')

//获取所有物料---分页
export const getByParams = async (data:any) => await post<any>('/data/area/select',data)

// 修改物料状态
export const updateStatus = async (data:any) => await post<any>('/data/area/status',data)

//删除物料
export const deleteMaterial = async (data:any) => await del<any>('/data/area/delete',data)

// id更新物料
export const updateMaterial = async (data:any) => await post<any>('/data/area/update',data)

// 新增物料
export const addMaterial = async (data:any) => await post<any>('/data/area/add',data)

// storeID查询库区
export const getByStoreId = async (data:any) => await post<any>('/data/area/storeId',data)

