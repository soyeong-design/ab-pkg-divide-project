'use client'

import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

interface RemainingQtyNotificationDialogProps {
  onCancel: () => void
  onConfirm: () => void
}

export function RemainingQtyNotificationDialog({ onCancel, onConfirm }: RemainingQtyNotificationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-[400px] bg-white rounded-[20px]',
          'shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-6 border-b border-[#dee2e6]">
          <h2 className="text-[18px] font-bold text-[#212529] tracking-[-0.3px]">
            잔여 수량이 남아있습니다.
          </h2>
          <button
            onClick={onCancel}
            className="ml-auto flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="#868e96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[15px] leading-6 text-[#495057] tracking-[-0.3px]">
            수량이 남은 경우 주문이 <strong className="text-[#008fff]">분할되어 처리</strong>됩니다.<br/>
            패키징 완료를 진행하시겠습니까?
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-6 pb-6 pt-2">
          <Button
            variant="outline"
            className="flex-1 h-12 text-[15px] font-semibold tracking-[-0.3px] border-[#adb5bd] text-[#495057]"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            className="flex-1 h-12 bg-black hover:bg-black/90 text-[15px] font-semibold tracking-[-0.3px] text-white"
            onClick={onConfirm}
          >
            패키징 완료
          </Button>
        </div>
      </div>
    </div>
  )
}
