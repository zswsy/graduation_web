import { get, post } from '../http'

// 获取所有角色
export const getAllRole = async () => await get<any>('/system/role/all')

// 所有角色-分页
export const allRolePage = async (data:any) => await post<any>('/system/role/list',data)

// 角色新增
export const addRole = async (data:any) => await post<any>('/system/role/add',data)

// 角色修改
export const updateRole = async (data:any) => await post<any>('/system/role/update',data)

// 角色修改-状态
export const updateRoleStatus = async (data:any) => await post<any>('/system/role/update/status',data)


