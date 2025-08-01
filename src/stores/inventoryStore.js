import { create } from 'zustand'
import { inventoryService } from '@/services/inventory'

export const useInventoryStore = create((set, get) => ({
  inventory: [],
  loading: false,
  stats: {
    total: 0,
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // 获取库存列表
  fetchInventory: async (params) => {
    set({ loading: true })
    try {
      const response = await inventoryService.getInventory(params)
      const { items, pagination } = response.data
      
      // 计算统计信息
      const stats = items.reduce((acc, item) => {
        acc.total++
        acc[item.item.rarity] = (acc[item.item.rarity] || 0) + 1
        return acc
      }, { total: 0, common: 0, rare: 0, epic: 0, legendary: 0 })

      set({ 
        inventory: items,
        pagination,
        stats,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  // 切换收藏状态
  toggleFavorite: async (inventoryId) => {
    try {
      const item = get().inventory.find(item => item.id === inventoryId)
      if (!item) return

      const newFavoriteStatus = !item.isFavorite
      await inventoryService.toggleFavorite(inventoryId, newFavoriteStatus)
      
      set((state) => ({
        inventory: state.inventory.map(item => 
          item.id === inventoryId 
            ? { ...item, isFavorite: newFavoriteStatus }
            : item
        )
      }))
    } catch (error) {
      throw error
    }
  },

  // 切换展示状态
  toggleDisplay: async (inventoryId) => {
    try {
      const item = get().inventory.find(item => item.id === inventoryId)
      if (!item) return

      const newDisplayStatus = !item.isDisplayed
      await inventoryService.toggleDisplay(inventoryId, newDisplayStatus)
      
      set((state) => ({
        inventory: state.inventory.map(item => 
          item.id === inventoryId 
            ? { ...item, isDisplayed: newDisplayStatus }
            : item
        )
      }))
    } catch (error) {
      throw error
    }
  },
}))
