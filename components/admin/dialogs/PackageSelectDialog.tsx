'use client'

import { useState } from 'react'

interface WorkPackageOption {
  id: number
  label: string
}

interface Props {
  workPackages: WorkPackageOption[]
  currentSelection: number[]
  onCancel: () => void
  onConfirm: (selectedIds: number[]) => void
}

export function PackageSelectDialog({ workPackages, currentSelection, onCancel, onConfirm }: Props) {
  const [selected, setSelected] = useState<number[]>(currentSelection)

  function toggle(id: number) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.16)] w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center pt-5 px-5">
          <span className="flex-1 text-[24px] font-bold text-[#212529] leading-10 tracking-[-0.3px] truncate">
            할당 패키지 선택
          </span>
          <button
            onClick={onCancel}
            className="w-6 h-6 flex items-center justify-center shrink-0"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="#212529" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5">
          <p className="text-[16px] text-[#212529] leading-6 tracking-[-0.3px]">
            상품을 포장한 패키지를 선택해주세요
          </p>

          <div className="flex flex-col">
            {workPackages.map(pkg => {
              const checked = selected.includes(pkg.id)
              return (
                <button
                  key={pkg.id}
                  onClick={() => toggle(pkg.id)}
                  className="flex items-center justify-between h-11 px-2 rounded-lg bg-white hover:bg-[#f8f9fa] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {/* Checkbox */}
                    <div className="relative w-6 h-6 shrink-0">
                      <div
                        className="absolute inset-[5%] rounded-[4px]"
                        style={{
                          background: checked ? '#ff558f' : 'white',
                          border: `1px solid ${checked ? '#ff558f' : '#dee2e6'}`,
                        }}
                      />
                      {checked && (
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 12l4 4 8-8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[16px] text-[#212529] leading-6 tracking-[-0.3px] whitespace-nowrap">
                      {pkg.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
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
              onClick={() => onConfirm(selected)}
              className="flex-1 h-14 rounded-lg bg-[#ff558f] text-[18px] font-bold text-white leading-7 tracking-[-0.3px] hover:bg-[#e0497d] transition-colors"
            >
              선택하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
