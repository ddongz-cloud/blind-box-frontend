import apiClient from './api'

export const inventoryService = {
  // 获取库存列表
  getInventory: async (params) => {
    return await apiClient.get('/api/inventory', { params })
  },

  // 设置收藏状态
  toggleFavorite: async (inventoryId, isFavorite) => {
    return await apiClient.put(`/api/inventory/${inventoryId}/favorite`, { isFavorite })
  },

  // 设置展示状态
  toggleDisplay: async (inventoryId, isDisplayed) => {
    return await apiClient.put(`/api/inventory/${inventoryId}/display`, { isDisplayed })
  },
}
