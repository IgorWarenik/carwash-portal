import * as React from 'react'
import { cn } from '../lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-[#e94560] text-white hover:bg-[#c73650]': variant === 'primary',
          'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50': variant === 'secondary',
          'text-gray-700 hover:bg-gray-100': variant === 'ghost',
        },
        {
          'h-8 px-3 text-sm rounded-md': size === 'sm',
          'h-10 px-4 text-base rounded-lg': size === 'md',
          'h-12 px-6 text-lg rounded-lg': size === 'lg',
        },
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="mr-2 animate-spin">⟳</span> : null}
      {children}
    </button>
  )
}
