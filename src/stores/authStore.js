import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // 登录
      login: async (credentials) => {
        set({ loading: true })
        try {
          const response = await authService.login(credentials)

          // 检查响应格式是否正确
          if (!response.success) {
            throw new Error(response.message || '登录失败')
          }

          const { token, user } = response.data

          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false
          })
          return response
        } catch (error) {
          set({ loading: false })
          // 处理标准错误格式
          const errorMessage = error.message || (error.success === false ? error.message : '登录失败')
          throw new Error(errorMessage)
        }
      },

      // 注册
      register: async (userData) => {
        set({ loading: true })
        try {
          const response = await authService.register(userData)

          // 检查响应格式是否正确
          if (!response.success) {
            throw new Error(response.message || '注册失败')
          }

          set({ loading: false })
          return response
        } catch (error) {
          set({ loading: false })
          // 处理标准错误格式
          const errorMessage = error.message || (error.success === false ? error.message : '注册失败')
          throw new Error(errorMessage)
        }
      },

      // 登出
      logout: async () => {
        try {
          const response = await authService.logout()
          // 检查响应格式（登出通常不需要严格检查，因为本地状态清理更重要）
          if (response && !response.success) {
            console.warn('Logout response:', response.message)
          }
        } catch (error) {
          console.error('Logout error:', error)
          // 即使服务器登出失败，也要清理本地状态
        } finally {
          localStorage.removeItem('token')
          set({
            user: null,
            token: null,
            isAuthenticated: false
          })
        }
      },

      // 刷新Token
      refreshToken: async () => {
        try {
          const response = await authService.refreshToken()

          if (!response.success) {
            throw new Error(response.message || 'Token刷新失败')
          }

          const { token } = response.data
          localStorage.setItem('token', token)
          set((state) => ({
            ...state,
            token
          }))

          return response
        } catch (error) {
          // Token刷新失败，清理认证状态
          localStorage.removeItem('token')
          set({
            user: null,
            token: null,
            isAuthenticated: false
          })
          throw error
        }
      },

      // 更新用户信息
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
