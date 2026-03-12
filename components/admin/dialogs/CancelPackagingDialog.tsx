'use client'

import { Button } from '@/components/ui/Button'

interface Props {
  packageCode: string
  onCancel: () => void
  onConfirm: () => void
}

export function CancelPackagingDialog({ packageCode, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim — #000000 40% */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-bg-default rounded-2xl shadow-overlay w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <span className="text-heading-md text-fg-default font-bold">패키징 요청 취소</span>
          <button
            onClick={onCancel}
            className="text-fg-subtle hover:text-fg-default transition-colors p-1 rounded-lg hover:bg-bg-subtle"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-body-regular-lg text-fg-default">
            <strong className="font-semibold">{`{${packageCode}}`}</strong>가 요청 취소됩니다.
          </p>
          <p className="text-body-regular-lg text-fg-default mt-1">
            패키징 요청을 취소하시겠어요?
          </p>
        </div>

        {/* Footer — full-width equal buttons */}
        <div className="flex border-t border-border-default">
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-body-bold-md text-fg-default border-r border-border-default hover:bg-bg-subtle transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-body-bold-md text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            패키징 요청 취소
          </button>
        </div>
      </div>
    </div>
  )
}
