import { clsx } from 'clsx'
import { forwardRef } from 'react'

const PixelInput = forwardRef(({ 
  label,
  error,
  icon,
  className,
  ...props 
}, ref) => {
  const inputClasses = `
    w-full font-pixel text-sm
    border-2 border-gray-800
    bg-white px-3 py-2
    shadow-inner
    transition-all duration-75
    focus:outline-none focus:border-blue-500 focus:bg-blue-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 bg-red-50' : ''}
    ${icon ? 'pl-10' : ''}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-pixel font-bold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(inputClasses, className)}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-pixel text-red-600">{error}</p>
      )}
    </div>
  )
})

PixelInput.displayName = 'PixelInput'
export default PixelInput
