import apiClient from './api'

export const playerShowService = {
  // 获取玩家秀列表
  getPlayerShows: async (params = {}) => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.sort) queryParams.append('sort', params.sort)

    const url = `/api/player-shows${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await apiClient.get(url)
  },

  // 获取玩家秀详情
  getPlayerShowDetail: async (showId) => {
    return await apiClient.get(`/api/player-shows/${showId}`)
  },

  // 发布玩家秀
  createPlayerShow: async (data) => {
    return await apiClient.post('/api/player-shows', data)
  },

  // 点赞/取消点赞
  toggleLike: async (showId) => {
    return await apiClient.post(`/api/player-shows/${showId}/like`)
  },

  // 删除玩家秀
  deletePlayerShow: async (showId) => {
    return await apiClient.delete(`/api/player-shows/${showId}`)
  }
}

export default playerShowService
