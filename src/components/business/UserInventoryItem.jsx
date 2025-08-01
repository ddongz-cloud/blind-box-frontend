import PixelCard from '@/components/ui/PixelCard'

const rarityColors = {
  common: 'border-gray-400 bg-gray-50',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50',
}

const rarityLabels = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
}

const UserInventoryItem = ({ inventoryItem, onToggleFavorite }) => {
  const { item, quantity, isFavorite } = inventoryItem

  return (
    <PixelCard 
      hover 
      padding="sm"
      className={`text-center ${rarityColors[item.rarity]}`}
    >
      <div className="relative">
        <img 
          src={item.image || 'https://via.placeholder.com/64x64?text=🎁'} 
          alt={item.name}
          className="w-16 h-16 mx-auto object-cover pixel-image"
        />
        {quantity > 1 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-pixel px-1 rounded-full min-w-5 h-5 flex items-center justify-center">
            {quantity}
          </span>
        )}
        <button
          onClick={() => onToggleFavorite(inventoryItem.id)}
          className="absolute top-0 left-0 text-lg hover:scale-110 transition-transform"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <h4 className="font-pixel text-xs font-bold mt-2 text-gray-800">
        {item.name}
      </h4>
      <span className={`text-xs font-pixel capitalize ${
        item.rarity === 'legendary' ? 'text-yellow-600' :
        item.rarity === 'epic' ? 'text-purple-600' :
        item.rarity === 'rare' ? 'text-blue-600' : 'text-gray-600'
      }`}>
        {rarityLabels[item.rarity]}
      </span>
    </PixelCard>
  )
}

export default UserInventoryItem
