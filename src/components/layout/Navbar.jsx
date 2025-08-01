import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import PixelButton from '@/components/ui/PixelButton'

const Navbar = () => {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b-4 border-gray-800 shadow-pixel-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 品牌标识 */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-xl font-pixel font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span className="text-2xl">🎮</span>
            <span>PixelBox</span>
          </Link>

          {/* 导航菜单 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-pixel border-2 transition-all duration-75 ${
                isActive('/') 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-500'
              }`}
            >
              <span>🏠</span>
              <span>首页</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link 
                  to="/store" 
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-pixel border-2 transition-all duration-75 ${
                    isActive('/store') 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-500'
                  }`}
                >
                  <span>🏪</span>
                  <span>商店</span>
                </Link>

                <Link 
                  to="/inventory" 
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-pixel border-2 transition-all duration-75 ${
                    isActive('/inventory') 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-500'
                  }`}
                >
                  <span>📚</span>
                  <span>收藏</span>
                </Link>

                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-pixel border-2 transition-all duration-75 ${
                    isActive('/profile') 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-500'
                  }`}
                >
                  <span>👤</span>
                  <span>个人</span>
                </Link>
              </>
            )}
          </div>

          {/* 用户操作 */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-yellow-100 border-2 border-gray-800 text-sm font-pixel">
                    <span>💰</span>
                    <span>{user.points || 0}</span>
                  </div>
                )}
                <PixelButton
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  登出
                </PixelButton>
              </>
            ) : (
              <>
                <Link to="/login">
                  <PixelButton variant="outline" size="sm">
                    登录
                  </PixelButton>
                </Link>
                <Link to="/register">
                  <PixelButton variant="primary" size="sm">
                    注册
                  </PixelButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
