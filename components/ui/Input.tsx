'use client'

import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useState,
  useRef,
  useCallback,
  useId,
} from 'react'
import { cn } from '@/lib/cn'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputStatus = 'default' | 'error' | 'success' | 'warning'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  status?: InputStatus
  label?: string
  isRequired?: boolean
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  showCount?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isClearable?: boolean
  onClear?: () => void
}

const sizeClass: Record<InputSize, string> = {
  lg: 'h-12 px-4 gap-2 text-body-regular-lg',
  md: 'h-10 px-3 gap-1.5 text-body-regular-lg',
  sm: 'h-8 px-2 gap-1 text-body-regular-md',
}

const statusBorder: Record<InputStatus, string> = {
  default: 'border-border-default hover:bg-overlay-008',
  error:   'border-[1.5px] border-border-danger',
  success: 'border-border-default hover:bg-overlay-008',
  warning: 'border-border-default hover:bg-overlay-008',
}

const helperColor: Record<InputStatus, string> = {
  default: 'text-fg-subtle',
  error:   'text-fg-danger-default',
  success: 'text-fg-success-default',
  warning: 'text-fg-warning-default',
}

const ClearIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

function getFocusBorderClass(opts: {
  isDisabled: boolean; isReadOnly: boolean; status: InputStatus; isFocusRing: boolean; isTyping: boolean
}): string | false {
  const { isDisabled, isReadOnly, status, isFocusRing, isTyping } = opts
  if (isDisabled || isReadOnly) return false
  const isError = status === 'error'
  const borderColor = isError ? 'border-border-danger' : 'border-border-inverse-subtle'
  if (isFocusRing) return `border-[1.5px] ${borderColor} shadow-input-focus-ring`
  if (isTyping)    return `border-[1.5px] ${borderColor}`
  return false
}

const iconSize: Record<InputSize, string> = {
  lg: 'size-6',
  md: 'size-6',
  sm: 'size-5',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'lg',
      status = 'default',
      label,
      isRequired = false,
      helperText,
      leftIcon,
      rightIcon,
      showCount = false,
      isDisabled = false,
      isReadOnly = false,
      isClearable = true,
      onClear,
      id: idProp,
      className = '',
      value: valueProp,
      defaultValue,
      onChange,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      maxLength,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const autoId = useId()
    const inputId = idProp ?? autoId
    const helperId = `${inputId}-helper`

    const [internalValue, setInternalValue] = useState((defaultValue ?? '') as string)
    const isControlled = valueProp !== undefined
    const currentValue = isControlled ? (valueProp as string) : internalValue

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value)
        onChange?.(e)
      },
      [isControlled, onChange],
    )

    const internalRef = useRef<HTMLInputElement | null>(null)
    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        internalRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = el
      },
      [ref],
    )

    const handleClear = useCallback(() => {
      if (!isControlled) setInternalValue('')
      onClear?.()
      internalRef.current?.focus()
    }, [isControlled, onClear])

    const [isFocused, setIsFocused] = useState(false)
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => { setIsFocused(true); onFocusProp?.(e) },
      [onFocusProp],
    )
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => { setIsFocused(false); onBlurProp?.(e) },
      [onBlurProp],
    )

    const showClearBtn = isClearable && !isDisabled && !isReadOnly && currentValue.length > 0
    const hasError = status === 'error'
    const isTyping = isFocused && currentValue.length > 0
    const isFocusRing = isFocused && currentValue.length === 0

    const focusBorderOverride = getFocusBorderClass({ isDisabled, isReadOnly, status, isFocusRing, isTyping })

    const fieldClasses = cn(
      'flex items-center border rounded-lg bg-bg-default transition',
      sizeClass[size],
      statusBorder[status],
      isDisabled && 'border-border-disabled bg-bg-disabled cursor-not-allowed',
      isReadOnly && 'border-border-default bg-bg-disabled',
      focusBorderOverride,
      className,
    )

    const inputClasses = cn(
      'flex-1 min-w-0 bg-transparent outline-none',
      'text-fg-default placeholder:text-fg-subtlest',
      isDisabled && 'cursor-not-allowed text-fg-disabled',
      isReadOnly && 'cursor-default',
    )

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-bold-lg text-fg-default inline-flex items-center gap-1">
            {label}
            {isRequired && (
              <span className="inline-block w-[5px] h-[5px] rounded-full bg-fg-accent-brand1-default" aria-hidden="true" />
            )}
          </label>
        )}

        <div className={fieldClasses}>
          {leftIcon && (
            <span className={cn('flex-shrink-0', iconSize[size], isDisabled ? 'text-fg-disabled' : 'text-fg-subtle')} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            {...props}
            ref={setRefs}
            id={inputId}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            readOnly={isReadOnly}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-invalid={hasError || undefined}
            aria-describedby={helperText ? helperId : undefined}
            aria-required={isRequired || undefined}
            className={inputClasses}
          />

          {showCount && maxLength != null && (
            <span className={cn('flex-shrink-0 text-body-regular-sm tabular-nums', isDisabled ? 'text-fg-disabled' : 'text-fg-subtle')}>
              {currentValue.length}/{maxLength}
            </span>
          )}

          {showClearBtn && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 text-fg-subtlest hover:text-fg-subtle transition-colors cursor-pointer focus-visible:outline-none rounded-sm"
              aria-label="입력 지우기"
              tabIndex={-1}
            >
              {ClearIcon}
            </button>
          )}

          {rightIcon && (
            <span className={cn('flex-shrink-0', iconSize[size], isDisabled ? 'text-fg-disabled' : 'text-fg-subtle')} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {helperText && (
          <div id={helperId} className={cn('flex items-center gap-1 text-body-regular-md', helperColor[status])} role={hasError ? 'alert' : undefined}>
            <span>{helperText}</span>
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
