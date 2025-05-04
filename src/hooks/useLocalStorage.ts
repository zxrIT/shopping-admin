import type {IStorage} from "../typings/hooks/localStorage.ts";

export const useLocalStorage = () => {
    const setStorage = (key: string, value: any) => {
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.error('存储数据失败:', error)
        }
    }

    const getStorage = (key: string) => {
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.error('获取数据失败:', error)
            return null
        }
    }

    const removeStorage = (key: string) => {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('删除数据失败:', error)
        }
    }

    return {
        setStorage,
        getStorage,
        removeStorage
    }
}