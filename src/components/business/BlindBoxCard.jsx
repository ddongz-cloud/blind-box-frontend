import { useNavigate } from 'react-router-dom'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'

const BlindBoxCard = ({ series, onPurchase }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/series/${series.id}`)
  }

  const handlePurchaseClick = (e) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发卡片点击
    onPurchase(series)
  }
  return (
    <PixelCard
      hover
      className="h-full flex flex-col cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={series.coverImage || 'https://via.placeholder.com/300x200?text=盲盒'} 
          alt={series.name}
          className="w-full h-full object-cover pixel-image"
        />
        {series.isHot && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs font-pixel px-2 py-1 border-2 border-gray-800">
              🔥 热门
            </span>
          </div>
        )}
        {series.isNew && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-500 text-white text-xs font-pixel px-2 py-1 border-2 border-gray-800">
              ✨ 新品
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-pixel font-bold text-gray-800 mb-2 text-sm">
          {series.name}
        </h3>
        <p className="text-xs text-gray-600 mb-2 flex-1 line-clamp-3">
          {series.description || '神秘的盲盒等待您的开启...'}
        </p>
        <p className="text-xs text-blue-600 mb-4 font-pixel">
          点击查看详情 →
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-yellow-600 font-bold">
            <span>💰</span>
            <span className="font-pixel text-sm">{series.price || 99}</span>
          </div>
          <PixelButton
            size="sm"
            onClick={handlePurchaseClick}
          >
            购买
          </PixelButton>
        </div>
      </div>
    </PixelCard>
  )
}

export default BlindBoxCard
