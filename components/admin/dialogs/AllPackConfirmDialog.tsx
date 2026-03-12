'use client'

interface Props {
  isMultiPackage: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function AllPackConfirmDialog({ isMultiPackage, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.16)] w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="pt-5 px-5">
          <p className="text-[24px] font-bold text-[#212529] leading-10 tracking-[-0.3px]">
            전체 상품을 포장하셨나요?
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-[16px] text-[#212529] leading-6 tracking-[-0.3px]">
            {isMultiPackage ? (
              <>
                <span className="font-semibold">패키지 #1</span>
                {'에 모든 상품이 할당되고, 추가된 패키지는 삭제됩니다. 삭제된 정보는 되돌릴 수 없습니다.'}
                <br />
                {'전체 상품을 포장을 진행할까요?'}
              </>
            ) : (
              <>{'모든 상품을 패키지 #1에 포장하시겠습니까?'}</>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="p-5">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 h-14 rounded-lg border border-[#dee2e6] text-[18px] font-bold text-black leading-7 tracking-[-0.3px] hover:bg-[#f8f9fa] transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-14 rounded-lg bg-[#ff558f] text-[18px] font-bold text-white leading-7 tracking-[-0.3px] hover:bg-[#e0497d] transition-colors"
            >
              전체 상품 포장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
