import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/order'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, PAYMENT_METHOD_TEXT } from '@/constants/order'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'
import DrawResultModal from '@/components/business/DrawResultModal'

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [showDrawResult, setShowDrawResult] = useState(false)
  const [drawItems, setDrawItems] = useState([])

  // 获取订单详情
  const fetchOrderDetail = async () => {
    if (!user || !orderId) return

    setLoading(true)
    try {
      const response = await orderService.getOrderDetail(orderId)
      setOrder(response.data)
    } catch (error) {
      console.error('获取订单详情失败:', error)
      toast.error('获取订单详情失败')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [user, orderId])

  // 支付订单
  const handlePayOrder = async () => {
    if (!order) return

    // 检查用户积分是否足够
    if (user.points < order.totalAmount) {
      toast.error('金币不足，无法支付')
      return
    }

    setPaying(true)
    try {
      await orderService.payOrder(orderId)
      toast.success('支付成功！')
      
      // 更新用户积分
      updateUser({ points: user.points - order.totalAmount })
      
      // 刷新订单详情
      await fetchOrderDetail()
    } catch (error) {
      console.error('支付失败:', error)
      toast.error(error.response?.data?.message || '支付失败')
    } finally {
      setPaying(false)
    }
  }

  // 取消订单
  const handleCancelOrder = async () => {
    if (!confirm('确定要取消这个订单吗？')) return

    try {
      await orderService.cancelOrder(orderId)
      toast.success('订单取消成功')
      await fetchOrderDetail()
    } catch (error) {
      console.error('取消订单失败:', error)
      toast.error(error.response?.data?.message || '取消订单失败')
    }
  }

  // 执行抽取
  const handleDraw = async () => {
    if (!order) return

    setDrawing(true)
    try {
      const response = await orderService.drawBlindBox(orderId)
      const items = response.data || []
      
      // 显示抽取结果
      setDrawItems(items)
      setShowDrawResult(true)
      
      // 刷新订单详情
      await fetchOrderDetail()
    } catch (error) {
      console.error('抽取失败:', error)
      toast.error(error.response?.data?.message || '抽取失败')
    } finally {
      setDrawing(false)
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="font-pixel text-gray-600">加载中...</div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PixelCard>
          <div className="text-center py-8">
            <div className="font-pixel text-gray-600 mb-4">订单不存在</div>
            <PixelButton onClick={() => navigate('/orders')}>
              返回订单列表
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <PixelButton
          variant="secondary"
          onClick={() => navigate('/orders')}
        >
          ← 返回订单列表
        </PixelButton>
      </div>

      {/* 订单基本信息 */}
      <PixelCard className="mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-pixel text-2xl font-bold text-gray-800 mb-2">
                订单详情
              </h1>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-lg text-gray-700">
                  {order.orderNumber}
                </span>
                <span className={`px-3 py-1 text-sm font-pixel border rounded ${ORDER_STATUS_COLOR[order.status]}`}>
                  {ORDER_STATUS_TEXT[order.status]}
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              {order.status === ORDER_STATUS.PENDING && (
                <>
                  <PixelButton
                    onClick={handlePayOrder}
                    disabled={paying || user.points < order.totalAmount}
                  >
                    {paying ? '支付中...' : '立即支付'}
                  </PixelButton>
                  <PixelButton
                    variant="danger"
                    onClick={handleCancelOrder}
                  >
                    取消订单
                  </PixelButton>
                </>
              )}
              
              {order.status === ORDER_STATUS.PAID && (
                <PixelButton
                  onClick={handleDraw}
                  disabled={drawing}
                >
                  {drawing ? '抽取中...' : '立即抽取'}
                </PixelButton>
              )}
            </div>
          </div>

          {/* 订单信息网格 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div>
              <h3 className="font-pixel font-bold text-gray-700 mb-3">基本信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">订单号：</span>
                  <span className="font-pixel">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">系列名称：</span>
                  <span>{order.series?.name || '未知系列'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">购买数量：</span>
                  <span>{order.quantity} 个</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">单价：</span>
                  <span>{order.unitPrice.toFixed(2)} 金币</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">总金额：</span>
                  <span className="text-yellow-600">{order.totalAmount.toFixed(2)} 金币</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">支付方式：</span>
                  <span>{PAYMENT_METHOD_TEXT[order.paymentMethod]}</span>
                </div>
              </div>
            </div>

            {/* 时间信息 */}
            <div>
              <h3 className="font-pixel font-bold text-gray-700 mb-3">时间信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">创建时间：</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付时间：</span>
                    <span>{formatDate(order.paidAt)}</span>
                  </div>
                )}
                {order.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">完成时间：</span>
                    <span>{formatDate(order.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 积分不足提示 */}
          {order.status === ORDER_STATUS.PENDING && user.points < order.totalAmount && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="text-red-600 text-sm">
                ⚠️ 您的金币余额不足，当前余额：{user.points.toFixed(2)} 金币，需要：{order.totalAmount.toFixed(2)} 金币
              </div>
            </div>
          )}
        </div>
      </PixelCard>

      {/* 抽取结果 */}
      {order.resultItems && order.resultItems.length > 0 && (
        <PixelCard>
          <div className="p-6">
            <h3 className="font-pixel font-bold text-gray-700 mb-4">🎁 抽取结果</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.resultItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-3">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎁</div>
                    <div className="font-pixel font-bold text-gray-800 mb-1">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.rarity === 'common' && '普通'}
                      {item.rarity === 'rare' && '稀有'}
                      {item.rarity === 'epic' && '史诗'}
                      {item.rarity === 'legendary' && '传说'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PixelCard>
      )}

      {/* 抽取结果模态框 */}
      <DrawResultModal
        isOpen={showDrawResult}
        onClose={() => setShowDrawResult(false)}
        items={drawItems}
      />
    </div>
  )
}

export default OrderDetailPage
