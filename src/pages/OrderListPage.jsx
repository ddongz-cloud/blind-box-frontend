import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/order'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, PAYMENT_METHOD_TEXT } from '@/constants/order'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'

const OrderListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // 获取订单列表
  const fetchOrders = async (params = {}) => {
    if (!user) return

    setLoading(true)
    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...params
      }

      if (selectedStatus !== 'all') {
        queryParams.status = selectedStatus
      }

      const response = await orderService.getOrders(queryParams)
      setOrders(response.data.orders)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('获取订单列表失败:', error)
      toast.error('获取订单列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user, selectedStatus])

  // 状态筛选
  const handleStatusFilter = (status) => {
    setSelectedStatus(status)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // 查看订单详情
  const handleViewDetail = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  // 取消订单
  const handleCancelOrder = async (orderId) => {
    if (!confirm('确定要取消这个订单吗？')) return

    try {
      await orderService.cancelOrder(orderId)
      toast.success('订单取消成功')
      fetchOrders()
    } catch (error) {
      console.error('取消订单失败:', error)
      toast.error(error.response?.data?.message || '取消订单失败')
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PixelCard>
          <div className="text-center py-8">
            <div className="font-pixel text-gray-600 mb-4">请先登录</div>
            <PixelButton onClick={() => navigate('/login')}>
              去登录
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="font-pixel text-2xl font-bold text-gray-800 mb-2">
          📋 我的订单
        </h1>
        <p className="text-gray-600 text-sm">
          查看和管理您的所有订单
        </p>
      </div>

      {/* 状态筛选 */}
      <PixelCard className="mb-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            <PixelButton
              size="sm"
              variant={selectedStatus === 'all' ? 'primary' : 'secondary'}
              onClick={() => handleStatusFilter('all')}
            >
              全部
            </PixelButton>
            {Object.entries(ORDER_STATUS_TEXT).map(([status, text]) => (
              <PixelButton
                key={status}
                size="sm"
                variant={selectedStatus === status ? 'primary' : 'secondary'}
                onClick={() => handleStatusFilter(status)}
              >
                {text}
              </PixelButton>
            ))}
          </div>
        </div>
      </PixelCard>

      {/* 订单列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="font-pixel text-gray-600">加载中...</div>
        </div>
      ) : orders.length === 0 ? (
        <PixelCard>
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <div className="font-pixel text-gray-600 mb-4">暂无订单</div>
            <PixelButton onClick={() => navigate('/store')}>
              去购买盲盒
            </PixelButton>
          </div>
        </PixelCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <PixelCard key={order.id}>
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* 订单信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-pixel font-bold text-gray-800">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2 py-1 text-xs font-pixel border rounded ${ORDER_STATUS_COLOR[order.status]}`}>
                        {ORDER_STATUS_TEXT[order.status]}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>系列：{order.series?.name || '未知系列'}</div>
                      <div>数量：{order.quantity} 个</div>
                      <div>金额：{order.totalAmount.toFixed(2)} 金币</div>
                      <div>创建时间：{formatDate(order.createdAt)}</div>
                      {order.paidAt && (
                        <div>支付时间：{formatDate(order.paidAt)}</div>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <PixelButton
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewDetail(order.id)}
                    >
                      查看详情
                    </PixelButton>
                    
                    {order.status === ORDER_STATUS.PENDING && (
                      <PixelButton
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        取消订单
                      </PixelButton>
                    )}
                  </div>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      )}

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <PixelButton
              size="sm"
              variant="secondary"
              disabled={pagination.page <= 1}
              onClick={() => {
                setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                fetchOrders({ page: pagination.page - 1 })
              }}
            >
              上一页
            </PixelButton>
            
            <span className="px-3 py-2 font-pixel text-sm text-gray-600">
              {pagination.page} / {pagination.totalPages}
            </span>
            
            <PixelButton
              size="sm"
              variant="secondary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                fetchOrders({ page: pagination.page + 1 })
              }}
            >
              下一页
            </PixelButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderListPage
