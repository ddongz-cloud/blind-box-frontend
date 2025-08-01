import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// 页面组件 (懒加载)
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const StorePage = lazy(() => import('@/pages/StorePage'))
const SeriesDetailPage = lazy(() => import('@/pages/SeriesDetailPage'))
const InventoryPage = lazy(() => import('@/pages/InventoryPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const OrderListPage = lazy(() => import('@/pages/OrderListPage'))
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// 加载组件
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <div className="text-4xl animate-bounce">🎮</div>
      <div className="font-pixel text-gray-600">加载中...</div>
    </div>
  </div>
)

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 公开路由 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route 
              path="login" 
              element={
                isAuthenticated ? <Navigate to="/store" replace /> : <LoginPage />
              } 
            />
            <Route 
              path="register" 
              element={
                isAuthenticated ? <Navigate to="/store" replace /> : <RegisterPage />
              } 
            />
            
            {/* 受保护的路由 */}
            <Route path="store" element={
              <ProtectedRoute>
                <StorePage />
              </ProtectedRoute>
            } />
            <Route path="series/:id" element={
              <ProtectedRoute>
                <SeriesDetailPage />
              </ProtectedRoute>
            } />
            <Route path="inventory" element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute>
                <OrderListPage />
              </ProtectedRoute>
            } />
            <Route path="orders/:orderId" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
