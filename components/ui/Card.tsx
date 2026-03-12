import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantStyles = {
  default:  'bg-bg-default border border-border-default',
  elevated: 'bg-bg-default shadow-raised',
  outlined: 'bg-transparent border border-border-default',
}

const paddingStyles = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export function Card({ children, className, variant = 'default', padding = 'md' }: CardProps) {
  return (
    <div className={cn('rounded-2xl', variantStyles[variant], paddingStyles[padding], className)}>
      {children}
    </div>
  )
}
