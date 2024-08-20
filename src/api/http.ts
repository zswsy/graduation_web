import request from './axios'
import { RequestHttpEnum } from '@/enums/httpEnum'

export interface ApiResponse<T = any> {
    status?: number
    message?: string
    data?: T
    total?: number
}

export async function get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await request.get<ApiResponse<T>>(url, { params })
    if(response.data.status == 0){
        window['$message'].error(response.data.message)
    }
    return response.data
}

// export const get = (url: string, params?: object) => {
//     return request({
//         url,
//         method: RequestHttpEnum.GET,
//         params,
//     })
// }

export async function post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await request.post<ApiResponse<T>>(url, data)
    if(response.data.status == 0){
        window['$message'].error(response.data.message)
    }
    return response.data
    
}

export async function put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await request.put<ApiResponse<T>>(url, data)
    return response.data
}

export async function del<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    url+=`?id=${data.id}`
    const response = await request.delete<ApiResponse<T>>(url)
    return response.data
}
