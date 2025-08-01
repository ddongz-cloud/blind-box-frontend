import apiClient from './api'

export const userService = {
  // 获取个人信息
  getProfile: async () => {
    return await apiClient.get('/api/users/profile')
  },

  // 更新个人信息
  updateProfile: async (profileData) => {
    return await apiClient.put('/api/users/profile', profileData)
  },

  // 获取积分记录
  getPointsHistory: async (params) => {
    return await apiClient.get('/api/users/points', { params })
  },
}
