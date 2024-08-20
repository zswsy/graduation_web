import { get, post } from '../http'

// 获取所有用户
export const getAllUser = async () => await get<any>('/system/user/all')

// 所有用户-分页
export const allUserPage = async (data:any) => await post<any>('/system/user/list',data)

// 用户新增
export const addUser = async (data:any) => await post<any>('/system/user/add',data)

// 用户修改
export const updateUser = async (data:any) => await post<any>('/system/user/update',data)

// 用户修改-状态
export const updateUserStatus = async (data:any) => await post<any>('/system/user/update/status',data)

// 删除用户
export const delUser = async (data:any) => await post<any>('/system/user/del',data)

