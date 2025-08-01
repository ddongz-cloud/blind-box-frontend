import apiClient from './api'

export const orderService = {
  // 获取订单列表
  getOrders: async (params) => {
    return await apiClient.get('/api/orders', { params })
  },

  // 创建订单
  createOrder: async (orderData) => {
    return await apiClient.post('/api/orders', orderData)
  },

  // 获取订单详情
  getOrderDetail: async (orderId) => {
    return await apiClient.get(`/api/orders/${orderId}`)
  },

  // 执行抽取
  drawBlindBox: async (orderId) => {
    return await apiClient.post(`/api/orders/${orderId}/draw`)
  },

  // 取消订单
  cancelOrder: async (orderId) => {
    return await apiClient.put(`/api/orders/${orderId}/cancel`)
  },
}
