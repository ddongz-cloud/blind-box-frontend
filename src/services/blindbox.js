import apiClient from './api'

export const blindboxService = {
  // 获取系列列表
  getSeries: async (params) => {
    return await apiClient.get('/api/series', { params })
  },

  // 获取系列详情
  getSeriesDetail: async (id) => {
    return await apiClient.get(`/api/series/${id}`)
  },

  // 搜索系列
  searchSeries: async (params) => {
    return await apiClient.get('/api/series/search', { params })
  },

  // 获取热门系列
  getPopularSeries: async (params) => {
    return await apiClient.get('/api/series/popular', { params })
  },
}
