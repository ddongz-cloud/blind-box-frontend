import apiClient from './api'

export const authService = {
  // 用户注册
  register: async (userData) => {
    return await apiClient.post('/api/auth/register', userData)
  },

  // 用户登录
  login: async (credentials) => {
    return await apiClient.post('/api/auth/login', credentials)
  },

  // 用户登出
  logout: async () => {
    return await apiClient.post('/api/auth/logout')
  },

  // 刷新Token
  refreshToken: async () => {
    return await apiClient.post('/api/auth/refresh')
  },
}
