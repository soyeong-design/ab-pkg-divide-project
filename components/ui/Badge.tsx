import { type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type BadgeType = 'sq' | 'round'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeColor =
  | 'default' | 'inverse' | 'blue' | 'green' | 'yellow'
  | 'red' | 'brand1' | 'brand2' | 'orange' | 'lime' | 'indigo' | 'gray'

export interface BadgeProps {
  type?: BadgeType
  size?: BadgeSize
  color?: BadgeColor
  isDisabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
  className?: string
}

const sqSizeMap: Record<BadgeSize, string> = {
  sm: 'h-5 px-1.5 gap-0.5 text-label-bold-sm rounded-md',
  md: 'h-6 px-2 gap-1 text-label-bold-sm rounded-md',
  lg: 'h-7 px-2 gap-1 text-label-bold-md rounded-lg',
}

const roundSizeMap: Record<BadgeSize, string> = {
  sm: 'h-5 px-1.5 gap-0.5 text-label-bold-sm rounded-full',
  md: 'h-6 px-2 gap-1 text-label-bold-sm rounded-full',
  lg: 'h-7 px-2.5 gap-1 text-label-bold-md rounded-full',
}

const colorStyles: Record<BadgeColor, string> = {
  default: 'bg-bg-subtle border border-border-default text-fg-default',
  inverse: 'bg-bg-inverse-default border border-border-inverse-default text-fg-inverse-default',
  blue:    'bg-bg-accent-blue-subtlest border border-border-accent-blue-subtlest text-fg-accent-blue-default',
  green:   'bg-bg-accent-green-subtlest border border-border-accent-green-subtlest text-fg-accent-green-default',
  yellow:  'bg-bg-accent-yellow-subtlest border border-border-accent-yellow-subtlest text-fg-accent-yellow-default',
  red:     'bg-bg-accent-red-subtlest border border-border-accent-red-subtlest text-fg-accent-red-default',
  brand1:  'bg-bg-accent-brand1-subtlest border border-border-accent-brand1-subtlest text-fg-accent-brand1-default',
  brand2:  'bg-bg-accent-brand2-subtlest border border-border-accent-brand2-subtlest text-fg-accent-brand2-default',
  orange:  'bg-bg-accent-orange-subtlest border border-border-accent-orange-subtlest text-fg-accent-orange-default',
  lime:    'bg-bg-accent-lime-subtlest border border-border-accent-lime-subtlest text-fg-accent-lime-default',
  indigo:  'bg-bg-accent-indigo-subtlest border border-border-accent-indigo-subtlest text-fg-accent-indigo-default',
  gray:    'bg-bg-accent-gray-subtlest border border-border-accent-gray-subtlest text-fg-accent-gray-default',
}

const disabledStyles = 'bg-bg-disabled border border-border-disabled text-fg-disabled'

const iconWrapperCls = 'size-3 shrink-0 [&>svg]:size-full'

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ type = 'sq', size = 'md', color = 'default', isDisabled = false, leftIcon, rightIcon, children, className }, ref) => {
    const sizeClass = type === 'round' ? roundSizeMap[size] : sqSizeMap[size]
    const colorClass = isDisabled ? disabledStyles : colorStyles[color]

    return (
      <span
        ref={ref}
        aria-disabled={isDisabled || undefined}
        className={cn('inline-flex items-center justify-center', sizeClass, colorClass, className)}
      >
        {leftIcon && <span className={iconWrapperCls} aria-hidden="true">{leftIcon}</span>}
        {children != null && <span className="truncate">{children}</span>}
        {rightIcon && <span className={iconWrapperCls} aria-hidden="true">{rightIcon}</span>}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
