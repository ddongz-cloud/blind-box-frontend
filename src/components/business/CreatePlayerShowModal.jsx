import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { inventoryService } from '@/services/inventory'
import { playerShowService } from '@/services/playerShow'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'

const CreatePlayerShowModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 获取用户库存
  const fetchInventory = async () => {
    if (!user || !isOpen) return

    setLoading(true)
    try {
      const response = await inventoryService.getInventory()
      setInventoryItems(response.data.items || [])
    } catch (error) {
      console.error('获取库存失败:', error)
      toast.error('获取库存失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchInventory()
    } else {
      // 重置表单
      setContent('')
      setSelectedItemId('')
      setInventoryItems([])
    }
  }, [isOpen, user])

  // 提交发布
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('请输入内容')
      return
    }

    if (!selectedItemId) {
      toast.error('请选择要展示的物品')
      return
    }

    setSubmitting(true)
    try {
      await playerShowService.createPlayerShow({
        content: content.trim(),
        inventoryId: selectedItemId
      })

      toast.success('发布成功！')
      onSuccess?.()
    } catch (error) {
      console.error('发布失败:', error)
      toast.error(error.response?.data?.message || '发布失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <PixelCard>
          <div className="p-6">
            {/* 标题 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-pixel text-xl font-bold text-gray-800">
                📝 发布玩家秀
              </h2>
              <PixelButton
                size="sm"
                variant="secondary"
                onClick={onClose}
              >
                ✕
              </PixelButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 内容输入 */}
              <div>
                <label className="block font-pixel font-bold text-gray-700 mb-2">
                  分享内容 *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="分享你的抽取心得、收藏故事或者任何想说的话..."
                  className="w-full h-32 px-3 py-2 border-2 border-gray-300 rounded resize-none focus:border-blue-500 focus:outline-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {content.length}/500
                </div>
              </div>

              {/* 选择展示物品 */}
              <div>
                <label className="block font-pixel font-bold text-gray-700 mb-2">
                  选择展示物品 *
                </label>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="font-pixel text-gray-600">加载库存中...</div>
                  </div>
                ) : inventoryItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-gray-600 mb-2">您还没有任何物品</div>
                    <div className="text-sm text-gray-500">
                      去商店购买盲盒来获得物品吧！
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
                    {inventoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 border-2 rounded cursor-pointer transition-all ${
                          selectedItemId === item.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0">
                            {item.item?.image ? (
                              <img
                                src={item.item.image}
                                alt={item.item.name}
                                className="w-full h-full object-cover rounded border border-gray-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-lg"
                              style={{ display: item.item?.image ? 'none' : 'flex' }}
                            >
                              🎁
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-pixel font-bold text-gray-800 text-sm">
                              {item.item?.name || '未知物品'}
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.item?.series?.name || '未知系列'}
                            </div>
                            <div className="text-xs">
                              <span className={`px-2 py-1 rounded text-xs ${
                                item.item?.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                                item.item?.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                                item.item?.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {item.item?.rarity === 'common' && '普通'}
                                {item.item?.rarity === 'rare' && '稀有'}
                                {item.item?.rarity === 'epic' && '史诗'}
                                {item.item?.rarity === 'legendary' && '传说'}
                              </span>
                            </div>
                          </div>
                          {selectedItemId === item.id && (
                            <div className="text-blue-500">✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4">
                <PixelButton
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  取消
                </PixelButton>
                <PixelButton
                  type="submit"
                  disabled={submitting || !content.trim() || !selectedItemId || inventoryItems.length === 0}
                  className="flex-1"
                >
                  {submitting ? '发布中...' : '发布'}
                </PixelButton>
              </div>
            </form>
          </div>
        </PixelCard>
      </div>
    </div>
  )
}

export default CreatePlayerShowModal
