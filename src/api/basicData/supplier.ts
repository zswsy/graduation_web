import {get, post, del } from '../http'

//获取所有物料
export const getAll = async () => await get<any>('/data/supplier/all')

//获取所有物料---分页
export const getByParams = async (data:any) => await post<any>('/data/supplier/select',data)

// 修改物料状态
export const updateStatus = async (data:any) => await post<any>('/data/supplier/status',data)

//删除物料
export const deleteMaterial = async (data:any) => await del<any>('/data/supplier/delete',data)

// id更新物料
export const updateMaterial = async (data:any) => await post<any>('/data/supplier/update',data)

// 新增物料
export const addMaterial = async (data:any) => await post<any>('/data/supplier/add',data)


