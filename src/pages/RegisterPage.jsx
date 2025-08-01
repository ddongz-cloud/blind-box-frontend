import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import PixelCard from '@/components/ui/PixelCard'
import PixelInput from '@/components/ui/PixelInput'
import PixelButton from '@/components/ui/PixelButton'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerUser, loading } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password
      })
      toast.success('注册成功！请登录')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || '注册失败')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-pixel font-bold text-gray-800">
            ✨ 用户注册
          </h1>
          <p className="text-gray-600">加入像素盲盒世界</p>
        </div>

        {/* 注册表单 */}
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
                },
                maxLength: {
                  value: 20,
                  message: '用户名最多20个字符'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: '用户名只能包含字母、数字和下划线'
                }
              })}
            />

            <PixelInput
              label="邮箱"
              type="email"
              icon="📧"
              placeholder="请输入邮箱"
              error={errors.email?.message}
              {...register('email', {
                required: '邮箱不能为空',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入有效的邮箱地址'
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

            <PixelInput
              label="确认密码"
              type="password"
              icon="🔒"
              placeholder="请再次输入密码"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: '请确认密码',
                validate: value => value === password || '两次输入的密码不一致'
              })}
            />

            <PixelButton
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </PixelButton>
          </form>
        </PixelCard>

        {/* 登录链接 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            已有账户？
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 ml-1 font-pixel"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
