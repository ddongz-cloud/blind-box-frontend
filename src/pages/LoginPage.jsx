import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import PixelCard from '@/components/ui/PixelCard'
import PixelInput from '@/components/ui/PixelInput'
import PixelButton from '@/components/ui/PixelButton'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const from = location.state?.from?.pathname || '/store'

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('登录成功！')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || '登录失败')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-pixel font-bold text-gray-800">
            🎮 用户登录
          </h1>
          <p className="text-gray-600">欢迎回到像素盲盒世界</p>
        </div>

        {/* 登录表单 */}
        <PixelCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PixelInput
              label="用户名"
              icon="👤"
              placeholder="请输入用户名"
              error={errors.username?.message}
              {...register('username', {
                required: '用户名不能为空',
                minLength: {
                  value: 3,
                  message: '用户名至少3个字符'
                }
              })}
            />

            <PixelInput
              label="密码"
              type="password"
              icon="🔒"
              placeholder="请输入密码"
              error={errors.password?.message}
              {...register('password', {
                required: '密码不能为空',
                minLength: {
                  value: 6,
                  message: '密码至少6个字符'
                }
              })}
            />

            <PixelButton
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </PixelButton>
          </form>
        </PixelCard>

        {/* 注册链接 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            还没有账户？
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-800 ml-1 font-pixel"
            >
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
