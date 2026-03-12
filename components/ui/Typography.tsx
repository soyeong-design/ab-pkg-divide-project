import { type ElementType, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type TypographyVariant =
  | 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'display-xs'
  | 'heading-lg' | 'heading-md' | 'heading-sm' | 'heading-xs'
  | 'body-bold-xl' | 'body-bold-lg' | 'body-bold-md' | 'body-bold-sm'
  | 'body-regular-xl' | 'body-regular-lg' | 'body-regular-md' | 'body-regular-sm'
  | 'label-xl' | 'label-lg' | 'label-md' | 'label-sm'
  | 'label-bold-lg' | 'label-bold-md' | 'label-bold-sm'

export interface TypographyProps {
  variant?: TypographyVariant
  as?: ElementType
  children?: ReactNode
  className?: string
  id?: string
}

const defaultTagMap: Record<TypographyVariant, ElementType> = {
  'display-xl':       'h1',
  'display-lg':       'h2',
  'display-md':       'h2',
  'display-sm':       'h3',
  'display-xs':       'h3',
  'heading-lg':       'h4',
  'heading-md':       'h5',
  'heading-sm':       'h6',
  'heading-xs':       'h6',
  'body-bold-xl':     'p',
  'body-bold-lg':     'p',
  'body-bold-md':     'p',
  'body-bold-sm':     'p',
  'body-regular-xl':  'p',
  'body-regular-lg':  'p',
  'body-regular-md':  'p',
  'body-regular-sm':  'p',
  'label-xl':         'span',
  'label-lg':         'span',
  'label-md':         'span',
  'label-sm':         'span',
  'label-bold-lg':    'span',
  'label-bold-md':    'span',
  'label-bold-sm':    'span',
}

export function Typography({ variant = 'body-regular-md', as, children, className, id }: TypographyProps) {
  const Tag = as ?? defaultTagMap[variant]
  return (
    <Tag id={id} className={cn(`text-${variant}`, className)}>
      {children}
    </Tag>
  )
}
