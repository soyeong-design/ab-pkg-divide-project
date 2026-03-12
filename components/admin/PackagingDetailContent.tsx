'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { PackageSelectDialog } from '@/components/admin/dialogs/PackageSelectDialog'
import { IncompleteItemsDialog } from '@/components/admin/dialogs/IncompleteItemsDialog'
import type { PackagingItem } from '@/lib/mockData'

interface Props {
  item: PackagingItem
}

export function PackagingDetailContent({ item }: Props) {
  const router = useRouter()
  const [showPackageSelect, setShowPackageSelect] = useState(false)
  const [showIncomplete, setShowIncomplete] = useState(false)
  const [adminMemo, setAdminMemo] = useState(item.adminMemo)
  const [userMessage, setUserMessage] = useState('')
  const [assignedPackages, setAssignedPackages] = useState<number[]>([])
  const [extraPackageCount, setExtraPackageCount] = useState(0)

  const unassignedCount = item.productList.filter(p => !p.isPob).length

  function handleCompleteClick() {
    if (unassignedCount > 0 && assignedPackages.length === 0) {
      setShowIncomplete(true)
    } else {
      router.push('/packaging?tab=completed')
    }
  }

  function handleAddPackage() {
    setExtraPackageCount(prev => prev + 1)
  }

  function handlePackageSelect(ids: number[]) {
    setAssignedPackages(ids)
    setShowPackageSelect(false)
  }

  const workPackageOptions = [
    { id: 1, label: '📦 기본 패키지 #1' },
    ...Array.from({ length: extraPackageCount }, (_, i) => ({
      id: i + 2,
      label: `📦 추가 패키지 #${i + 2}`,
    })),
  ]

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border-default bg-bg-default px-6 py-4">
        <div className="flex items-center gap-2 text-label-sm text-fg-subtle mb-1">
          <Link href="/packaging?tab=started" className="hover:text-fg-default transition-colors">패키징 내역</Link>
          <span>›</span>
          <Link href="/packaging?tab=started" className="hover:text-fg-default transition-colors">패키징 처리</Link>
          <span>›</span>
          <span className="text-fg-default font-medium">패키징 시작</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/packaging?tab=started"
              className="flex items-center gap-1 text-label-md text-fg-subtle hover:text-fg-default transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              목록으로 돌아가기
            </Link>
            <h1 className="text-heading-lg text-fg-default">{item.requestId}</h1>
            <Badge color="brand1" size="md">{item.packagingOption}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Left: 기본 정보 입력 */}
          <div className="space-y-4">
            <div className="bg-bg-default rounded-xl border border-border-default overflow-hidden">
              <div className="px-5 py-4 border-b border-border-default">
                <h2 className="text-heading-md text-fg-default">패키징 기본 정보 입력</h2>
                <p className="text-label-md text-fg-subtle mt-0.5">{item.packageCode} ({item.packageAlias})</p>
              </div>

              <div className="p-5 space-y-5">
                {/* 패키지 ID */}
                <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                  <span className="text-label-md text-fg-subtle pt-2">패키지 번호</span>
                  <div className="space-y-1">
                    <p className="text-body-regular-md text-fg-default font-mono">{item.packageCode}</p>
                    <p className="text-label-sm text-fg-subtle">{item.packageAlias}</p>
                  </div>
                </div>

                {/* 상품 유형 */}
                <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
                  <span className="text-label-md text-fg-subtle">상품유형</span>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border-default bg-bg-subtle">
                    <span className="text-body-regular-md text-fg-default">일반상품</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-fg-subtle ml-auto" aria-hidden="true">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {/* 패키징 옵션 */}
                <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                  <span className="text-label-md text-fg-subtle pt-2">패키징 옵션</span>
                  <div className="space-y-1.5">
                    {item.packageList.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge size="sm" color="gray">{opt}</Badge>
                      </div>
                    ))}
                    {item.productList.filter(p => p.isPob).length > 0 && (
                      <p className="text-label-sm text-fg-subtle mt-1">
                        * 유저 요청사항: the signed album plus all the pobs and the signed polaroid
                      </p>
                    )}
                  </div>
                </div>

                {/* 보관 장소 */}
                <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
                  <span className="text-label-md text-fg-subtle">보관 장소</span>
                  <span className="text-body-regular-md text-fg-default font-mono">{item.storageLocation}</span>
                </div>

                {/* 유저 안내 메시지 */}
                <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                  <span className="text-label-md text-fg-subtle pt-2">유저 안내 메세지</span>
                  <textarea
                    value={userMessage}
                    onChange={e => setUserMessage(e.target.value)}
                    rows={3}
                    placeholder="유저에게 전달할 안내 메세지를 입력하세요"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-default text-body-regular-md text-fg-default placeholder:text-fg-subtlest focus:outline-none focus:border-border-inverse-subtle resize-none"
                  />
                </div>

                {/* 관리자 기록용 메모 */}
                <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                  <span className="text-label-md text-fg-subtle pt-2">관리자 기록용 메모</span>
                  <textarea
                    value={adminMemo}
                    onChange={e => setAdminMemo(e.target.value)}
                    rows={3}
                    placeholder="관리자 메모를 입력하세요"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-default text-body-regular-md text-fg-default placeholder:text-fg-subtlest focus:outline-none focus:border-border-inverse-subtle resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: 작업 정보 입력 */}
          <div className="space-y-4">
            <div className="bg-bg-default rounded-xl border border-border-default overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
                <h2 className="text-heading-md text-fg-default">작업 정보 입력</h2>
                <Button size="sm" color="brand2" onClick={handleAddPackage}>
                  + 패키지 추가하기
                </Button>
              </div>

              <div className="p-5 space-y-4">
                {/* Infobox */}
                {unassignedCount > 0 && assignedPackages.length === 0 && (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-bg-accent-yellow-subtlest border border-border-accent-yellow-subtlest">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-fg-accent-yellow-default shrink-0 mt-0.5" aria-hidden="true">
                      <path d="M8 2.5L14.5 13.5H1.5L8 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="11" r=".75" fill="currentColor"/>
                    </svg>
                    <p className="text-body-regular-md text-fg-accent-yellow-default">
                      패키지에 할당되지 않은 상품이 있습니다. 패키지를 추가하거나 완료 처리 시 확인 단계를 거칩니다.
                    </p>
                  </div>
                )}

                {/* 패키지 내 상품 목록 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-body-bold-md text-fg-default">패키지 내 상품 목록</span>
                    <span className="text-label-md text-fg-subtle">총 {item.productList.length}종</span>
                  </div>

                  <div className="space-y-2">
                    {item.productList.map((prod, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-lg border',
                          prod.isPob
                            ? 'bg-bg-accent-brand1-subtlest border-border-accent-brand1-subtlest'
                            : 'bg-bg-subtle border-border-default',
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {prod.isPob && <Badge size="sm" color="brand1">POB</Badge>}
                          <span className="text-body-regular-md text-fg-default truncate">{prod.name}</span>
                        </div>
                        <span className="text-body-bold-md text-fg-default shrink-0 ml-3">{prod.qty}개</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 추가된 패키지 */}
                {assignedPackages.length > 0 && (
                  <div>
                    <span className="text-body-bold-md text-fg-default mb-3 block">할당된 패키지</span>
                    <div className="space-y-2">
                      {assignedPackages.map((pkgId, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg bg-bg-accent-brand2-subtlest border border-border-accent-brand2-subtlest">
                          <span className="text-body-regular-md text-fg-default">📦 추가 패키지 #{i + 2}</span>
                          <button
                            onClick={() => setAssignedPackages(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-fg-subtle hover:text-fg-danger-default transition-colors text-label-sm"
                          >
                            제거
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 관리자 기록 */}
                {item.adminRecord && (
                  <div className="px-4 py-3 rounded-lg bg-bg-subtle border border-border-default">
                    <p className="text-label-md text-fg-subtle mb-1">관리자 기록</p>
                    <p className="text-body-regular-md text-fg-default">{item.adminRecord}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-bg-default border-t border-border-default px-6 py-4">
        <div className="flex justify-end gap-3">
          <Link href="/packaging?tab=started">
            <Button size="xl" variant="outline" color="default">취소</Button>
          </Link>
          <Button size="xl" color="brand1" onClick={handleCompleteClick}>
            패키징 완료 처리
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      {showPackageSelect && (
        <PackageSelectDialog
          workPackages={workPackageOptions}
          currentSelection={assignedPackages}
          onCancel={() => setShowPackageSelect(false)}
          onConfirm={handlePackageSelect}
        />
      )}
      {showIncomplete && (
        <IncompleteItemsDialog
          onCancel={() => setShowIncomplete(false)}
          onConfirm={() => {
            setShowIncomplete(false)
            router.push('/packaging?tab=completed')
          }}
        />
      )}
    </>
  )
}
