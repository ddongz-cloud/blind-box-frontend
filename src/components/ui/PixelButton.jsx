import { clsx } from 'clsx'

const PixelButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  className,
  type = 'button',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-pixel font-bold
    border-2 border-gray-800
    transition-all duration-75
    cursor-pointer select-none
    shadow-pixel-sm
    hover:shadow-pixel-md
    active:translate-x-1 active:translate-y-1 active:shadow-none
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-gray-900 hover:bg-yellow-600',
    outline: 'bg-transparent text-gray-800 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1 text-xs min-h-7',
    md: 'px-4 py-2 text-sm min-h-9',
    lg: 'px-6 py-3 text-base min-h-11',
    xl: 'px-8 py-4 text-lg min-h-13',
  }

  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="animate-pulse">⠋</span>
      ) : (
        children
      )}
    </button>
  )
}

export default PixelButton
