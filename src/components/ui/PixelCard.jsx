import { clsx } from 'clsx'

const PixelCard = ({ 
  children, 
  hover = false, 
  padding = 'md',
  className,
  onClick,
  ...props 
}) => {
  const baseClasses = `
    relative bg-white
    border-2 border-gray-800
    shadow-pixel-md
    transition-all duration-75
  `

  const hoverClasses = hover ? `
    cursor-pointer
    hover:-translate-y-1
    hover:shadow-pixel-lg
  ` : ''

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={clsx(
        baseClasses,
        hoverClasses,
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* 像素角装饰 */}
      <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-white border-2 border-gray-800" />
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white border-2 border-gray-800" />
      {children}
    </div>
  )
}

export default PixelCard
