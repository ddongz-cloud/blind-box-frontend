import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/user'
import PixelCard from '@/components/ui/PixelCard'
import PixelInput from '@/components/ui/PixelInput'
import PixelButton from '@/components/ui/PixelButton'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [pointsHistory, setPointsHistory] = useState([])
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (user) {
      setValue('username', user.username)
      setValue('email', user.email)
      setValue('nickname', user.nickname || '')
    }
    
    // 获取积分记录
    fetchPointsHistory()
  }, [user, setValue])

  const fetchPointsHistory = async () => {
    try {
      const response = await userService.getPointsHistory({ page: 1, limit: 10 })
      setPointsHistory(response.data.records || [])
    } catch (error) {
      console.error('Failed to fetch points history:', error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await userService.updateProfile({
        nickname: data.nickname,
      })
      
      updateUser(response.data)
      toast.success('个人信息更新成功')
    } catch (error) {
      toast.error(error.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 页面标题 */}
      <header className="text-center">
        <h1 className="text-3xl font-pixel font-bold text-gray-800">
          👤 个人资料
        </h1>
        <p className="text-gray-600 mt-2">管理您的账户信息</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 基本信息 */}
        <section>
          <PixelCard>
            <div className="space-y-6">
              <h2 className="text-lg font-pixel font-bold text-gray-800">
                📝 基本信息
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <PixelInput
                  label="用户名"
                  value={user?.username || ''}
                  disabled
                  icon="👤"
                />

                <PixelInput
                  label="邮箱"
                  value={user?.email || ''}
                  disabled
                  icon="📧"
                />

                <PixelInput
                  label="昵称"
                  placeholder="请输入昵称"
                  error={errors.nickname?.message}
                  icon="✨"
                  {...register('nickname', {
                    maxLength: {
                      value: 20,
                      message: '昵称最多20个字符'
                    }
                  })}
                />

                <PixelButton
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? '更新中...' : '更新信息'}
                </PixelButton>
              </form>
            </div>
          </PixelCard>
        </section>

        {/* 账户统计 */}
        <section>
          <PixelCard>
            <div className="space-y-6">
              <h2 className="text-lg font-pixel font-bold text-gray-800">
                📊 账户统计
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 border-2 border-yellow-200">
                  <div className="text-2xl font-pixel font-bold text-yellow-600">
                    {(user?.points || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">当前金币</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 border-2 border-blue-200">
                  <div className="text-2xl font-pixel font-bold text-blue-600">
                    {user?.level || 1}
                  </div>
                  <div className="text-xs text-gray-600">用户等级</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-pixel font-bold text-gray-700">最近金币记录</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pointsHistory.length > 0 ? (
                    pointsHistory.map((record, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 text-xs">
                        <span>{record.description || '金币变动'}</span>
                        <span className={`font-pixel ${record.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {record.amount > 0 ? '+' : ''}{(record.amount || 0).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-xs py-4">
                      无记录
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PixelCard>
        </section>

        {/* 订单管理 */}
        <section>
          <PixelCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-pixel font-bold text-gray-800">
                  📋 订单管理
                </h2>
                <PixelButton
                  size="sm"
                  onClick={() => navigate('/orders')}
                >
                  查看全部
                </PixelButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded cursor-pointer hover:bg-yellow-100 transition-colors"
                  onClick={() => navigate('/orders?status=pending')}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">⏳</div>
                    <div className="font-pixel font-bold text-yellow-600">待支付</div>
                    <div className="text-xs text-gray-600">查看待支付订单</div>
                  </div>
                </div>

                <div
                  className="p-4 bg-blue-50 border-2 border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => navigate('/orders?status=paid')}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-pixel font-bold text-blue-600">已支付</div>
                    <div className="text-xs text-gray-600">查看已支付订单</div>
                  </div>
                </div>

                <div
                  className="p-4 bg-green-50 border-2 border-green-200 rounded cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => navigate('/orders?status=completed')}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-pixel font-bold text-green-600">已完成</div>
                    <div className="text-xs text-gray-600">查看已完成订单</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <PixelButton
                  variant="secondary"
                  onClick={() => navigate('/store')}
                >
                  🛒 去购买盲盒
                </PixelButton>
              </div>
            </div>
          </PixelCard>
        </section>
      </div>

      {/* 账户安全 */}
      <section>
        <PixelCard>
          <div className="space-y-6">
            <h2 className="text-lg font-pixel font-bold text-gray-800">
              🔒 账户安全
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-pixel font-bold text-gray-700">注册时间</h3>
                <p className="text-sm text-gray-600">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-pixel font-bold text-gray-700">最后更新</h3>
                <p className="text-sm text-gray-600">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('zh-CN') : '未知'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <PixelButton variant="outline" size="sm">
                修改密码
              </PixelButton>
            </div>
          </div>
        </PixelCard>
      </section>
    </div>
  )
}

export default ProfilePage
