import { Link } from 'react-router-dom'
import PixelButton from '@/components/ui/PixelButton'
import PixelCard from '@/components/ui/PixelCard'

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-8">
        <PixelCard>
          <div className="p-8 space-y-6">
            <div className="text-6xl">🎮</div>
            <h1 className="text-4xl font-pixel font-bold text-gray-800">
              404
            </h1>
            <h2 className="text-lg font-pixel font-bold text-gray-600">
              页面未找到
            </h2>
            <p className="text-sm text-gray-500">
              抱歉，您访问的页面不存在或已被移除
            </p>
            
            <div className="space-y-4">
              <Link to="/">
                <PixelButton className="w-full">
                  返回首页
                </PixelButton>
              </Link>
              <Link to="/store">
                <PixelButton variant="outline" className="w-full">
                  去商店看看
                </PixelButton>
              </Link>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  )
}

export default NotFoundPage
