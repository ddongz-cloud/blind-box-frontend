import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    // 返回完整的响应数据，保持后端API的标准格式
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // 处理HTTP错误响应
    if (error.response?.data) {
      const errorData = error.response.data

      // 如果后端返回了标准格式的错误
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        return Promise.reject({
          success: false,
          message: errorData.message,
          status: error.response.status
        })
      }

      // 如果是其他格式的错误数据
      return Promise.reject({
        success: false,
        message: errorData.toString() || '请求失败',
        status: error.response.status
      })
    }

    // 如果没有响应数据，使用默认错误信息
    return Promise.reject({
      success: false,
      message: error.message || '网络请求失败'
    })
  }
)

export default apiClient
