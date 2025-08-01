import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import PixelButton from '@/components/ui/PixelButton'
import PixelCard from '@/components/ui/PixelCard'

const HomePage = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* 英雄区域 */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-gray-800 leading-tight">
            🎮 像素盲盒机
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            收集独特的像素艺术玩偶，体验复古游戏的乐趣
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <Link to="/store">
                <PixelButton size="lg">
                  开始收集
                </PixelButton>
              </Link>
              <Link to="/inventory">
                <PixelButton variant="outline" size="lg">
                  查看收藏
                </PixelButton>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <PixelButton size="lg">
                  立即注册
                </PixelButton>
              </Link>
              <Link to="/login">
                <PixelButton variant="outline" size="lg">
                  登录账户
                </PixelButton>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* 特色展示区域 */}
      <section className="grid md:grid-cols-3 gap-8">
        <PixelCard hover>
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">🎁</div>
            <h3 className="text-lg font-pixel font-bold text-gray-800">盲盒抽取</h3>
            <p className="text-sm text-gray-600">
              体验刺激的盲盒开启，收集稀有玩偶
            </p>
          </div>
        </PixelCard>
        
        <PixelCard hover>
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">📚</div>
            <h3 className="text-lg font-pixel font-bold text-gray-800">收藏图鉴</h3>
            <p className="text-sm text-gray-600">
              建立专属收藏，展示珍贵玩偶
            </p>
          </div>
        </PixelCard>
        
        <PixelCard hover>
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">👥</div>
            <h3 className="text-lg font-pixel font-bold text-gray-800">社区分享</h3>
            <p className="text-sm text-gray-600">
              与其他收藏家交流分享心得
            </p>
          </div>
        </PixelCard>
      </section>

      {/* 游戏特色 */}
      <section className="bg-white border-2 border-gray-800 shadow-pixel-md p-8">
        <h2 className="text-2xl font-pixel font-bold text-gray-800 text-center mb-8">
          🌟 游戏特色
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-pixel font-bold text-blue-600">🎨 像素艺术风格</h3>
            <p className="text-sm text-gray-600">
              精美的8-bit像素艺术设计，重温经典游戏的美好回忆
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-pixel font-bold text-green-600">🎲 随机抽取机制</h3>
            <p className="text-sm text-gray-600">
              公平的概率系统，每次开盒都充满惊喜和期待
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-pixel font-bold text-purple-600">⭐ 稀有度系统</h3>
            <p className="text-sm text-gray-600">
              从普通到传说，不同稀有度的玩偶等你收集
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-pixel font-bold text-yellow-600">🏆 成就系统</h3>
            <p className="text-sm text-gray-600">
              完成收藏目标，解锁特殊成就和奖励
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
