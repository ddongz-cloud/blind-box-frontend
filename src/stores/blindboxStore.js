import { create } from 'zustand'
import { blindboxService } from '@/services/blindbox'

export const useBlindboxStore = create((set, get) => ({
  series: [],
  currentSeries: null,
  loading: false,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },

  // 获取系列列表
  fetchSeries: async (params) => {
    set({ loading: true })
    try {
      const response = await blindboxService.getSeries(params)
      set({ 
        series: response.data.series,
        pagination: response.data.pagination,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  // 搜索系列
  searchSeries: async (params) => {
    set({ loading: true })
    try {
      const response = await blindboxService.searchSeries(params)
      set({ 
        series: response.data.series,
        pagination: response.data.pagination,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  // 获取系列详情
  fetchSeriesDetail: async (id) => {
    set({ loading: true })
    try {
      const response = await blindboxService.getSeriesDetail(id)
      set({ 
        currentSeries: response.data,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
}))
