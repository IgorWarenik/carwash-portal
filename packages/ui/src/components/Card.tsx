import * as React from 'react'
import { cn } from '../lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white',
        {
          'shadow-sm': variant === 'default',
          'border border-gray-200': variant === 'bordered',
          'shadow-lg': variant === 'elevated',
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
