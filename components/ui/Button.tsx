'use client'

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'solid' | 'outline'
export type ButtonColor = 'default' | 'brand1' | 'brand2' | 'red' | 'orange' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  isSelected?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

const sizeStyles: Record<ButtonSize, string> = {
  sm:  'h-6 px-1.5 text-label-bold-sm gap-0.5 rounded-md',
  md:  'h-8 px-2 text-label-bold-md gap-1 rounded-lg',
  lg:  'h-10 px-2.5 text-label-bold-lg gap-1.5 rounded-lg',
  xl:  'h-12 px-3 text-label-bold-lg gap-2 rounded-lg',
  xxl: 'h-14 px-4 text-label-xl gap-2 rounded-lg',
}

const iconSizeStyles: Record<ButtonSize, string> = {
  sm:  'size-3.5',
  md:  'size-[18px]',
  lg:  'size-5',
  xl:  'size-6',
  xxl: 'size-6',
}

const outlineBorderWidth: Record<ButtonSize, string> = {
  sm:  'border',
  md:  'border',
  lg:  'border-[1.5px]',
  xl:  'border-[1.5px]',
  xxl: 'border-[1.5px]',
}

const solidStyles: Record<ButtonColor, string> = {
  default: 'bg-bg-accent-gray-default text-fg-default hover:bg-bg-accent-gray-hovered active:bg-bg-accent-gray-pressed',
  brand1:  'bg-bg-accent-brand1-default text-fg-inverse-default hover:bg-bg-accent-brand1-hovered active:bg-bg-accent-brand1-pressed',
  brand2:  'bg-bg-accent-brand2-default text-fg-inverse-default hover:bg-bg-accent-brand2-hovered active:bg-bg-accent-brand2-pressed',
  red:     'bg-bg-accent-red-default text-fg-inverse-default hover:bg-bg-accent-red-hovered active:bg-bg-accent-red-pressed',
  orange:  'bg-bg-accent-orange-default text-fg-inverse-default hover:bg-bg-accent-orange-hovered active:bg-bg-accent-orange-pressed',
  inverse: 'bg-bg-inverse-default text-fg-inverse-default hover:brightness-110 active:brightness-125',
}

const solidDisabled: Record<ButtonColor, string> = {
  default: 'bg-bg-accent-gray-disabled text-fg-disabled',
  brand1:  'bg-bg-accent-brand1-disabled text-fg-inverse-default opacity-50',
  brand2:  'bg-bg-accent-brand2-disabled text-fg-inverse-default opacity-50',
  red:     'bg-bg-accent-red-disabled text-fg-inverse-default opacity-50',
  orange:  'bg-bg-accent-orange-disabled text-fg-inverse-default opacity-50',
  inverse: 'bg-bg-inverse-disabled text-fg-disabled',
}

const outlineStyles: Record<ButtonColor, string> = {
  default: 'border-border-accent-gray-subtle text-fg-default bg-transparent hover:bg-overlay-008 active:bg-overlay-020',
  brand1:  'border-border-accent-brand1-default text-fg-accent-brand1-default bg-transparent hover:bg-overlay-008 active:bg-overlay-020',
  brand2:  'border-border-accent-brand2-default text-fg-accent-brand2-default bg-transparent hover:bg-overlay-008 active:bg-overlay-020',
  red:     'border-border-accent-red-default text-fg-accent-red-default bg-transparent hover:bg-overlay-008 active:bg-overlay-020',
  orange:  'border-border-accent-orange-default text-fg-accent-orange-default bg-transparent hover:bg-overlay-008 active:bg-overlay-020',
  inverse: 'border-border-inverse-default text-fg-default bg-transparent hover:bg-overlay-008 active:bg-overlay-020',
}

const outlineDisabled: Record<ButtonColor, string> = {
  default: 'border-border-accent-gray-disabled text-fg-disabled bg-transparent',
  brand1:  'border-border-accent-brand1-disabled text-fg-accent-brand1-subtlest bg-transparent',
  brand2:  'border-border-accent-brand2-disabled text-fg-accent-brand2-disabled bg-transparent',
  red:     'border-border-accent-red-disabled text-fg-accent-red-disabled bg-transparent',
  orange:  'border-border-accent-orange-disabled text-fg-accent-orange-disabled bg-transparent',
  inverse: 'border-border-inverse-disabled text-fg-disabled bg-transparent',
}

const spinnerSize: Record<ButtonSize, number> = { sm: 12, md: 14, lg: 16, xl: 16, xxl: 16 }

function Spinner({ size }: { size: ButtonSize }) {
  const px = spinnerSize[size]
  return (
    <svg width={px} height={px} viewBox="0 0 16 16" fill="none" className="animate-spin" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'brand1',
      size = 'md',
      isSelected = false,
      isDisabled = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const disabled = isDisabled || isLoading
    const isOutline = variant === 'outline'
    const colorClasses = disabled
      ? (isOutline ? outlineDisabled[color] : solidDisabled[color])
      : (isOutline ? outlineStyles[color] : solidStyles[color])

    const classes = cn(
      'inline-flex items-center justify-center select-none transition-all',
      'focus-visible:outline-none',
      isSelected
        ? 'ring-[4px] ring-offset-2 ring-border-selected'
        : 'focus-visible:ring-[4px] focus-visible:ring-offset-2 focus-visible:ring-border-focused',
      sizeStyles[size],
      isOutline ? outlineBorderWidth[size] : '',
      colorClasses,
      disabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer',
      className,
    )

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        disabled={disabled}
        className={classes}
        aria-disabled={disabled || undefined}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && <Spinner size={size} />}
        {!isLoading && leftIcon && (
          <span className={cn('shrink-0 [&>svg]:size-full', iconSizeStyles[size])}>{leftIcon}</span>
        )}
        {children != null && <span className="truncate">{children}</span>}
        {!isLoading && rightIcon && (
          <span className={cn('shrink-0 [&>svg]:size-full', iconSizeStyles[size])}>{rightIcon}</span>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
