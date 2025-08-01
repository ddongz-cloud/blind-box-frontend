import { useState, useEffect } from 'react'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'

const DrawResultModal = ({ isOpen, onClose, items = [] }) => {
  const [showItems, setShowItems] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // 延迟显示物品，创造抽取动画效果
      const timer = setTimeout(() => {
        setShowItems(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setShowItems(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'common':
        return '普通'
      case 'rare':
        return '稀有'
      case 'epic':
        return '史诗'
      case 'legendary':
        return '传说'
      default:
        return '普通'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <PixelCard className="max-w-md w-full">
        <div className="p-6 text-center">
          <h2 className="font-pixel text-xl font-bold text-gray-800 mb-6">
            🎁 抽取结果
          </h2>

          {!showItems ? (
            <div className="py-8">
              <div className="text-6xl animate-bounce mb-4">📦</div>
              <div className="font-pixel text-gray-600">正在开启盲盒...</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-2xl mb-4">🎉</div>
              <div className="font-pixel text-lg font-bold text-green-600 mb-4">
                恭喜获得！
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div 
                    key={item.id || index}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded border-2 border-gray-300"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.2}s both`
                    }}
                  >
                    <img 
                      src={item.image || 'https://via.placeholder.com/48x48?text=物品'} 
                      alt={item.name}
                      className="w-12 h-12 object-cover pixel-image border-2 border-gray-300"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-pixel font-bold text-gray-800 text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {item.description}
                      </p>
                      <span className={`text-xs font-pixel px-2 py-1 rounded border ${getRarityColor(item.rarity)}`}>
                        {getRarityText(item.rarity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <PixelButton onClick={onClose} className="w-full">
                  确定
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </PixelCard>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default DrawResultModal
