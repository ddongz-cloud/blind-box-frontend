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
          throw error
        }
      },

      // 注册
      register: async (userData) => {
        set({ loading: true })
        try {
          const response = await authService.register(userData)
          set({ loading: false })
          return response
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      // 登出
      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          localStorage.removeItem('token')
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          })
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
