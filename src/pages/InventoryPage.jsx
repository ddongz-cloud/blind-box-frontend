import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useInventoryStore } from '@/stores/inventoryStore'
import UserInventoryItem from '@/components/business/UserInventoryItem'
import PixelButton from '@/components/ui/PixelButton'
import PixelCard from '@/components/ui/PixelCard'

const InventoryPage = () => {
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  
  const { 
    inventory, 
    loading, 
    stats,
    fetchInventory, 
    toggleFavorite 
  } = useInventoryStore()

  useEffect(() => {
    fetchInventory({ 
      rarity: selectedRarity === 'all' ? undefined : selectedRarity,
      favoritesOnly: showFavoritesOnly 
    })
  }, [selectedRarity, showFavoritesOnly, fetchInventory])

  const handleToggleFavorite = async (inventoryId) => {
    try {
      await toggleFavorite(inventoryId)
      toast.success('收藏状态已更新')
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const rarityFilters = [
    { key: 'all', label: '全部', color: 'gray' },
    { key: 'common', label: '普通', color: 'gray' },
    { key: 'rare', label: '稀有', color: 'blue' },
    { key: 'epic', label: '史诗', color: 'purple' },
    { key: 'legendary', label: '传说', color: 'yellow' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 页面标题和统计 */}
      <header className="text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-pixel font-bold text-gray-800">
          📚 我的收藏
        </h1>
        
        {/* 统计信息 */}
        <PixelCard>
          <div className="p-6">
            <h2 className="text-lg font-pixel font-bold text-gray-800 mb-4">
              📊 收藏统计
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-pixel font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-gray-600">总收藏</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel font-bold text-gray-600">{stats.common}</div>
                <div className="text-xs text-gray-600">普通</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel font-bold text-blue-600">{stats.rare}</div>
                <div className="text-xs text-gray-600">稀有</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel font-bold text-purple-600">{stats.epic}</div>
                <div className="text-xs text-gray-600">史诗</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel font-bold text-yellow-600">{stats.legendary}</div>
                <div className="text-xs text-gray-600">传说</div>
              </div>
            </div>
          </div>
        </PixelCard>
      </header>

      {/* 筛选器 */}
      <section>
        <PixelCard>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex flex-wrap gap-2">
              {rarityFilters.map((filter) => (
                <PixelButton
                  key={filter.key}
                  variant={selectedRarity === filter.key ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRarity(filter.key)}
                >
                  {filter.label}
                </PixelButton>
              ))}
            </div>
            
            <PixelButton
              variant={showFavoritesOnly ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              ❤️ 只看收藏
            </PixelButton>
          </div>
        </PixelCard>
      </section>

      {/* 库存网格 */}
      <section>
        {loading ? (
          <div className="text-center py-12">
            <div className="font-pixel text-gray-600">加载中...</div>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="text-4xl">📦</div>
            <div className="font-pixel text-gray-600">暂无收藏物品</div>
            <p className="text-sm text-gray-500">去商店购买一些盲盒吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {inventory.map((item) => (
              <UserInventoryItem
                key={item.id}
                inventoryItem={item}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default InventoryPage
