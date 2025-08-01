import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { playerShowService } from '@/services/playerShow'
import PixelCard from '@/components/ui/PixelCard'
import PixelButton from '@/components/ui/PixelButton'
import CreatePlayerShowModal from '@/components/business/CreatePlayerShowModal'

const PlayerShowListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [playerShows, setPlayerShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // 获取玩家秀列表
  const fetchPlayerShows = async (params = {}) => {
    setLoading(true)
    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sort: 'createdAt:desc',
        ...params
      }

      const response = await playerShowService.getPlayerShows(queryParams)
      setPlayerShows(response.data.shows || [])
      setPagination(response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      })
    } catch (error) {
      console.error('获取玩家秀列表失败:', error)
      toast.error('获取玩家秀列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayerShows()
  }, [])

  // 点赞/取消点赞
  const handleToggleLike = async (showId) => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    try {
      await playerShowService.toggleLike(showId)
      // 刷新列表
      fetchPlayerShows()
    } catch (error) {
      console.error('点赞操作失败:', error)
      toast.error(error.response?.data?.message || '操作失败')
    }
  }

  // 删除玩家秀
  const handleDelete = async (showId) => {
    if (!confirm('确定要删除这个玩家秀吗？')) return

    try {
      await playerShowService.deletePlayerShow(showId)
      toast.success('删除成功')
      fetchPlayerShows()
    } catch (error) {
      console.error('删除失败:', error)
      toast.error(error.response?.data?.message || '删除失败')
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-pixel text-2xl font-bold text-gray-800 mb-2">
            🎭 玩家广场
          </h1>
          <p className="text-gray-600 text-sm">
            分享你的收藏，展示你的运气！
          </p>
        </div>
        
        {user && (
          <PixelButton onClick={() => setShowCreateModal(true)}>
            📝 发布秀场
          </PixelButton>
        )}
      </div>

      {/* 玩家秀列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="font-pixel text-gray-600">加载中...</div>
        </div>
      ) : (!playerShows || playerShows.length === 0) ? (
        <PixelCard>
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎭</div>
            <div className="font-pixel text-gray-600 mb-4">还没有玩家秀</div>
            {user ? (
              <PixelButton onClick={() => setShowCreateModal(true)}>
                成为第一个发布者
              </PixelButton>
            ) : (
              <PixelButton onClick={() => navigate('/login')}>
                登录后发布
              </PixelButton>
            )}
          </div>
        </PixelCard>
      ) : (
        <div className="space-y-6">
          {(playerShows || []).map((show) => (
            <PixelCard key={show.id}>
              <div className="p-6">
                {/* 用户信息 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-pixel text-blue-600">
                        {show.user?.username?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-pixel font-bold text-gray-800">
                        {show.user?.username || '匿名用户'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(show.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* 删除按钮（仅作者可见） */}
                  {user && user.id === show.user?.id && (
                    <PixelButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(show.id)}
                    >
                      删除
                    </PixelButton>
                  )}
                </div>

                {/* 内容 */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {show.content}
                  </p>
                  
                  {/* 展示的物品 */}
                  {show.item && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0">
                          {show.item.image ? (
                            <img
                              src={show.item.image}
                              alt={show.item.name}
                              className="w-full h-full object-cover rounded border border-gray-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-2xl"
                            style={{ display: show.item.image ? 'none' : 'flex' }}
                          >
                            🎁
                          </div>
                        </div>
                        <div>
                          <div className="font-pixel font-bold text-gray-800">
                            {show.item.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            来自 {show.item.series?.name || '未知系列'}
                          </div>
                          <div className="text-xs">
                            <span className={`px-2 py-1 rounded text-xs ${
                              show.item.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                              show.item.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                              show.item.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {show.item.rarity === 'common' && '普通'}
                              {show.item.rarity === 'rare' && '稀有'}
                              {show.item.rarity === 'epic' && '史诗'}
                              {show.item.rarity === 'legendary' && '传说'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 互动区域 */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <PixelButton
                    size="sm"
                    variant={show.isLiked ? 'primary' : 'secondary'}
                    onClick={() => handleToggleLike(show.id)}
                    disabled={!user}
                  >
                    {show.isLiked ? '❤️' : '🤍'} {show.likesCount || 0}
                  </PixelButton>
                  
                  {!user && (
                    <span className="text-xs text-gray-500">
                      登录后可点赞
                    </span>
                  )}
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
                fetchPlayerShows({ page: pagination.page - 1 })
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
                fetchPlayerShows({ page: pagination.page + 1 })
              }}
            >
              下一页
            </PixelButton>
          </div>
        </div>
      )}

      {/* 发布玩家秀模态框 */}
      <CreatePlayerShowModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
          fetchPlayerShows()
        }}
      />
    </div>
  )
}

export default PlayerShowListPage
