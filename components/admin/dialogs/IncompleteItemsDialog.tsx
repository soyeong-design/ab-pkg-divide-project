'use client'

import { Button } from '@/components/ui/Button'

interface Props {
  onCancel: () => void
  onConfirm: () => void
}

export function IncompleteItemsDialog({ onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-blanket" onClick={onCancel} />

      <div className="relative bg-bg-default rounded-2xl shadow-overlay w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <span className="text-heading-md text-fg-default">남아있는 상품이 있습니다.</span>
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
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-accent-yellow-subtlest border border-border-accent-yellow-subtlest mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-fg-accent-yellow-default shrink-0 mt-0.5" aria-hidden="true">
              <path d="M10 3L18 17H2L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="14" r=".75" fill="currentColor"/>
            </svg>
            <p className="text-body-regular-md text-fg-accent-yellow-default">
              패키지에 할당되지 않은 상품이 있습니다.
            </p>
          </div>
          <p className="text-body-regular-lg text-fg-default">
            패키징 완료 처리를 할까요?
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border-default">
          <Button size="lg" variant="outline" color="default" onClick={onCancel}>취소</Button>
          <Button size="lg" color="brand1" onClick={onConfirm}>패키징 완료 처리</Button>
        </div>
      </div>
    </div>
  )
}
