import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useBlindboxStore } from '@/stores/blindboxStore'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/order'
import DrawResultModal from '@/components/business/DrawResultModal'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'

const SeriesDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [purchasing, setPurchasing] = useState(false)
  const [showDrawResult, setShowDrawResult] = useState(false)
  const [drawItems, setDrawItems] = useState([])
  
  const { user } = useAuthStore()
  const { 
    currentSeries, 
    loading, 
    fetchSeriesDetail 
  } = useBlindboxStore()

  useEffect(() => {
    if (id) {
      fetchSeriesDetail(id)
    }
  }, [id, fetchSeriesDetail])

  const handlePurchase = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!currentSeries) {
      toast.error('系列信息加载中，请稍后')
      return
    }

    if (user.points < currentSeries.price) {
      toast.error('积分不足')
      return
    }

    setPurchasing(true)
    try {
      const orderData = {
        seriesId: currentSeries.id,
        quantity: 1
      }

      const response = await orderService.createOrder(orderData)
      toast.success('购买成功！')

      // 更新用户积分（扣除购买费用）
      const { updateUser } = useAuthStore.getState()
      updateUser({ points: user.points - currentSeries.price })

      // 执行抽取
      const drawResponse = await orderService.drawBlindBox(response.data.orderId)
      const items = drawResponse.data || []

      // 显示抽取结果模态框
      setDrawItems(items)
      setShowDrawResult(true)

    } catch (error) {
      console.error('购买失败:', error)
      toast.error(error.response?.data?.message || error.message || '购买失败')
    } finally {
      setPurchasing(false)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'common': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'legendary': return '传说'
      case 'epic': return '史诗'
      case 'rare': return '稀有'
      case 'common': return '普通'
      default: return '未知'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="text-4xl animate-bounce">🎮</div>
            <div className="font-pixel text-gray-600">加载中...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSeries) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">😵</div>
          <h2 className="font-pixel text-xl text-gray-800">系列不存在</h2>
          <PixelButton onClick={() => navigate('/store')}>
            返回商店
          </PixelButton>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 返回按钮 */}
      <div>
        <PixelButton 
          variant="outline" 
          onClick={() => navigate('/store')}
        >
          ← 返回商店
        </PixelButton>
      </div>

      {/* 系列信息 */}
      <PixelCard className="overflow-hidden">
        <div className="md:flex">
          {/* 系列封面 */}
          <div className="md:w-1/3">
            <img 
              src={currentSeries.coverImage || 'https://via.placeholder.com/400x300?text=盲盒'} 
              alt={currentSeries.name}
              className="w-full h-64 md:h-full object-cover pixel-image"
            />
          </div>
          
          {/* 系列详情 */}
          <div className="md:w-2/3 p-6 space-y-4">
            <div>
              <h1 className="font-pixel text-2xl font-bold text-gray-800 mb-2">
                {currentSeries.name}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {currentSeries.description}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">💰</span>
                <span className="font-pixel text-xl font-bold text-gray-800">
                  {currentSeries.price} 积分
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔥</span>
                <span className="font-pixel text-sm text-gray-600">
                  人气: {currentSeries.popularity}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <PixelButton 
                size="lg"
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full md:w-auto"
              >
                {purchasing ? '购买中...' : '立即购买'}
              </PixelButton>
            </div>
          </div>
        </div>
      </PixelCard>

      {/* 包含物品 */}
      <div className="space-y-4">
        <h2 className="font-pixel text-xl font-bold text-gray-800">
          🎁 包含物品
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSeries.items?.map((item) => (
            <PixelCard key={item.id} className="p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.image || 'https://via.placeholder.com/64x64?text=物品'} 
                  alt={item.name}
                  className="w-16 h-16 object-cover pixel-image border-2 border-gray-300"
                />
                <div className="flex-1">
                  <h3 className="font-pixel font-bold text-gray-800 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-pixel px-2 py-1 rounded ${getRarityColor(item.rarity)}`}>
                      {getRarityText(item.rarity)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.dropRate}%
                    </span>
                  </div>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>

      {/* 抽取结果模态框 */}
      <DrawResultModal
        isOpen={showDrawResult}
        onClose={() => setShowDrawResult(false)}
        items={drawItems}
      />
    </div>
  )
}

export default SeriesDetailPage
