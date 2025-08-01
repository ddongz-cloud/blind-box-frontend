import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useBlindboxStore } from '@/stores/blindboxStore'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/order'
import BlindBoxCard from '@/components/business/BlindBoxCard'
import PixelInput from '@/components/ui/PixelInput'
import PixelButton from '@/components/ui/PixelButton'
import PixelCard from '@/components/ui/PixelCard'

const StorePage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [purchasing, setPurchasing] = useState(false)
  
  const { user } = useAuthStore()
  const {
    series,
    loading,
    fetchSeries,
    searchSeries,
    fetchPopularSeries
  } = useBlindboxStore()

  useEffect(() => {
    if (selectedCategory === 'popular') {
      fetchPopularSeries({ limit: 12 })
    } else {
      fetchSeries({ page: 1, limit: 12 })
    }
  }, [fetchSeries, fetchPopularSeries, selectedCategory])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchSeries({ keyword: searchTerm, category: selectedCategory !== 'all' ? selectedCategory : undefined })
    } else if (selectedCategory === 'popular') {
      fetchPopularSeries({ limit: 12 })
    } else {
      fetchSeries({ page: 1, limit: 12, category: selectedCategory !== 'all' ? selectedCategory : undefined })
    }
  }

  const handlePurchase = async (series) => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (user.points < series.price) {
      toast.error('金币不足')
      return
    }

    setPurchasing(true)
    try {
      const orderData = {
        seriesId: series.id,
        quantity: 1
      }

      const response = await orderService.createOrder(orderData)
      toast.success('订单创建成功！')

      // 跳转到订单详情页面进行支付
      navigate(`/orders/${response.data.orderId}`)

    } catch (error) {
      console.error('创建订单失败:', error)
      toast.error(error.response?.data?.message || error.message || '创建订单失败')
    } finally {
      setPurchasing(false)
    }
  }

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'popular', label: '热门' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 页面标题 */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-pixel font-bold text-gray-800">
            🏪 盲盒商店
          </h1>
          <p className="text-sm text-gray-600 mt-2">选择你喜欢的系列，开始抽取之旅</p>
        </div>


      </header>

      {/* 搜索和筛选区域 */}
      <section>
        <PixelCard>
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <PixelInput
                  placeholder="搜索盲盒系列..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon="🔍"
                />
              </div>
              <PixelButton onClick={handleSearch}>
                搜索
              </PixelButton>
            </div>

            {/* 筛选标签 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <PixelButton
                  key={category.key}
                  variant={selectedCategory === category.key ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </PixelButton>
              ))}
            </div>
          </div>
        </PixelCard>
      </section>

      {/* 盲盒网格 */}
      <section>
        {loading ? (
          <div className="text-center py-12">
            <div className="font-pixel text-gray-600">加载中...</div>
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-12">
            <div className="font-pixel text-gray-600">暂无盲盒系列</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((item) => (
              <BlindBoxCard
                key={item.id}
                series={item}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </section>

      {purchasing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PixelCard>
            <div className="p-8 text-center">
              <div className="font-pixel text-gray-600 mb-4">正在购买...</div>
              <div className="animate-pulse text-2xl">🎁</div>
            </div>
          </PixelCard>
        </div>
      )}


    </div>
  )
}

export default StorePage
