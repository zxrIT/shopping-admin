import request from '@/utils/request'
import type {IUser} from '@/typings/user'

export const getUserService = <T>() => {
    return request.get<T>('/user/get/allUser')
}

export const updateUserService = <T>(data: IUser) => {
    return request.put<T>('/user/updateUser', data)
}

export const deleteUserService = <T>(id: string) => {
    return request.delete<T>(`/user/deleteUser/${id}`)
}