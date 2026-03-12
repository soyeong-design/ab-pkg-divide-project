'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PackageSelectDialog } from '@/components/admin/dialogs/PackageSelectDialog'
import { AllPackConfirmDialog } from '@/components/admin/dialogs/AllPackConfirmDialog'
import type { PackagingRequest, SubPackage } from '@/lib/mockData'

// ─── Option color ─────────────────────────────────────────────────────────────
function optionColor(opt: string) {
  if (opt === '합포장')  return { bg: 'bg-[#ebfbee]', text: 'text-[#2da44e]' }
  if (opt === 'POB만')   return { bg: 'bg-[#fff8dc]', text: 'text-[#d97706]' }
  return { bg: 'bg-[#f6f2ff]', text: 'text-[#8840ff]' }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkPackage {
  id: number
  storageLocation: string
  weight: string
  isRepackaging: boolean
  width: string
  height: string
  length: string
}

interface Props { request: PackagingRequest }

// ─── Main component ───────────────────────────────────────────────────────────
export function PackagingCompleteContent({ request }: Props) {
  const router = useRouter()

  // Basic info state
  const [albumQty,    setAlbumQty]    = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [adminMemo,   setAdminMemo]   = useState('')

  // Work packages
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([{
    id: 1,
    storageLocation: request.packages[0]?.storageLocation ?? '',
    weight: '', isRepackaging: false, width: '', height: '', length: '',
  }])

  // Sub-package → assigned work package IDs
  const [subPkgAssignments, setSubPkgAssignments] = useState<Record<string, number[]>>({})

  // Per-WP qty: wpId → itemKey (`${si}-${pi}`) → qty string
  // WP#1 initialised with original qty; others start empty (filled when assigned)
  const [wpItemQtys, setWpItemQtys] = useState<Record<number, Record<string, string>>>(() => {
    const init: Record<string, string> = {}
    request.packages.forEach((pkg, si) =>
      pkg.productList.forEach((p, pi) => { init[`${si}-${pi}`] = String(p.qty) })
    )
    return { 1: init }
  })

  // Which sub-package's "+" was clicked
  const [activeSubPkgCode, setActiveSubPkgCode] = useState<string | null>(null)

  // Confirmation dialog for "전체 상품 포장"
  const [showAllPackConfirm, setShowAllPackConfirm] = useState(false)

  const isMultiPackage = workPackages.length > 1

  // ── Qty helpers ────────────────────────────────────────────────────────────
  function getItemQty(si: number, pi: number, wpId: number): number {
    return parseInt(wpItemQtys[wpId]?.[`${si}-${pi}`] ?? '0', 10)
  }

  function getTotalAllocated(si: number, pi: number, wpIds: number[]): number {
    return wpIds.reduce((sum, id) => sum + getItemQty(si, pi, id), 0)
  }

  function isSplitItem(si: number, pi: number, wpIds: number[]): boolean {
    return wpIds.filter(id => getItemQty(si, pi, id) > 0).length > 1
  }

  // ── Work package CRUD ──────────────────────────────────────────────────────
  function addWorkPackage() {
    const newId = workPackages.length + 1
    setWorkPackages(prev => [...prev, {
      id: newId,
      storageLocation: '', weight: '', isRepackaging: false,
      width: '', height: '', length: '',
    }])
    // Initialise empty qty dict for the new WP
    setWpItemQtys(prev => ({ ...prev, [newId]: {} }))
  }

  function removeWorkPackage(id: number) {
    setWorkPackages(prev => prev.filter(p => p.id !== id).map((p, i) => ({ ...p, id: i + 1 })))
    setSubPkgAssignments(prev => {
      const next: Record<string, number[]> = {}
      Object.entries(prev).forEach(([code, ids]) => {
        const updated = ids.filter(wId => wId !== id).map(wId => wId > id ? wId - 1 : wId)
        next[code] = updated
      })
      return next
    })
    setWpItemQtys(prev => {
      const next: Record<number, Record<string, string>> = {}
      Object.entries(prev).forEach(([wId, qtys]) => {
        const numId = parseInt(wId, 10)
        if (numId !== id) next[numId > id ? numId - 1 : numId] = qtys
      })
      return next
    })
  }

  function updateWP(id: number, field: keyof WorkPackage, val: string | boolean) {
    setWorkPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p))
  }

  // ── Sub-package assignment ─────────────────────────────────────────────────
  function isSubPkgAssigned(packageCode: string) {
    return (subPkgAssignments[packageCode]?.length ?? 0) > 0
  }

  function handleSubPkgConfirm(packageCode: string, selectedIds: number[]) {
    const si = request.packages.findIndex(p => p.packageCode === packageCode)
    setSubPkgAssignments(prev => ({ ...prev, [packageCode]: selectedIds }))
    // Initialise qty for newly added WPs (items that aren't tracked yet get 0)
    setWpItemQtys(prev => {
      const next = { ...prev }
      selectedIds.forEach(wpId => {
        if (!next[wpId]) next[wpId] = {}
        request.packages[si]?.productList.forEach((p, pi) => {
          const key = `${si}-${pi}`
          if (!(key in next[wpId])) {
            next[wpId] = { ...next[wpId], [key]: wpId === 1 ? String(p.qty) : '0' }
          }
        })
      })
      return next
    })
    setActiveSubPkgCode(null)
  }

  // ── 전체 상품 포장 ─────────────────────────────────────────────────────────
  function handleAllPackedClick() {
    setShowAllPackConfirm(true)
  }

  function applyAllPacked() {
    const assignments: Record<string, number[]> = {}
    const newWPQtys: Record<number, Record<string, string>> = { 1: {} }
    request.packages.forEach((pkg, si) => {
      assignments[pkg.packageCode] = [1]
      pkg.productList.forEach((p, pi) => {
        newWPQtys[1][`${si}-${pi}`] = String(p.qty)
      })
    })
    setSubPkgAssignments(assignments)
    setWpItemQtys(newWPQtys)
    // If multi-package, remove extra WPs
    if (isMultiPackage) {
      setWorkPackages(prev => [prev[0]])
    }
    setShowAllPackConfirm(false)
  }

  // ── Products for a given work package ──────────────────────────────────────
  function getProductsForWP(wpId: number) {
    const result: { si: number; pi: number; subPkg: SubPackage }[] = []
    request.packages.forEach((subPkg, si) => {
      if ((subPkgAssignments[subPkg.packageCode] ?? []).includes(wpId)) {
        subPkg.productList.forEach((_, pi) => result.push({ si, pi, subPkg }))
      }
    })
    return result
  }

  // ── Group for right panel ──────────────────────────────────────────────────
  const optionGroupsMap = new Map<string, { subPkg: SubPackage; si: number }[]>()
  request.packages.forEach((subPkg, si) => {
    if (!optionGroupsMap.has(subPkg.packagingOption))
      optionGroupsMap.set(subPkg.packagingOption, [])
    optionGroupsMap.get(subPkg.packagingOption)!.push({ subPkg, si })
  })
  const optionGroups = Array.from(optionGroupsMap.entries())

  const notablePkgs = request.packages.filter(p => p.userNote)
  const hasSpecialOption = request.packages.some(p => p.packagingOption !== '합포장')

  const workPackageOptions = workPackages.map(wp => ({
    id: wp.id,
    label: `📦 ${wp.id === 1 ? '기본 패키지 #1' : `추가 패키지 #${wp.id}`}`,
  }))

  return (
    <div className="flex flex-col bg-[#f8f9fa]" style={{ minHeight: '100vh' }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#dee2e6] px-6 py-3 shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[14px] text-[#868e96] hover:text-[#212529] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          목록으로 돌아가기
        </button>
      </div>

      {/* ── 2-col layout ─────────────────────────────────────────────────── */}
      <div className="flex gap-5 px-6 py-5 items-start">

        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 pb-6">

          {/* ── 패키징 기본 정보 입력 ──────────────────────────────── */}
          <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.24)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dee2e6]">
              <h2 className="text-[18px] font-bold text-[#212529] leading-7 tracking-[-0.3px]">패키징 기본 정보 입력</h2>
            </div>
            <div className="px-4 py-2 bg-[#f8f9fa] border-b border-[#dee2e6]">
              <p className="text-[14px] font-bold text-[#ff558f] leading-5 tracking-[-0.3px]">
                {request.packageNumber} ({request.packageNumberAlias})
              </p>
            </div>

            <div className="flex border-b border-[#dee2e6]">
              <div className="flex-1 border-r border-[#dee2e6]">
                <div className="px-4 py-3 bg-[#f8f9fa] border-b border-[#e9ecef]">
                  <span className="text-[14px] font-semibold text-[#212529] leading-5">이미지 업로드</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 min-h-[120px] bg-white">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#dee2e6] shrink-0 hover:bg-[#f8f9fa] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#212529" strokeWidth="1.67" strokeLinecap="round"/></svg>
                  </button>
                  <p className="text-[14px] text-[#adb5bd] leading-5">여기로 파일을 <strong className="font-bold text-[#adb5bd]">드래그</strong>하거나 <strong className="font-bold text-[#adb5bd]">업로드</strong>하세요.</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f8f9fa] border-b border-[#e9ecef]">
                  <span className="text-[14px] font-semibold text-[#212529] leading-5">비디오 업로드</span>
                  <span className="text-[#ff3434] text-[8px]">●</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 min-h-[120px] bg-white">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#dee2e6] shrink-0 hover:bg-[#f8f9fa] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#212529" strokeWidth="1.67" strokeLinecap="round"/></svg>
                  </button>
                  <p className="text-[14px] text-[#adb5bd] leading-5">여기로 파일을 <strong className="font-bold text-[#adb5bd]">드래그</strong>하거나 <strong className="font-bold text-[#adb5bd]">업로드</strong>하세요.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center border-b border-[#dee2e6]">
              <div className="w-[100px] shrink-0 self-stretch flex items-center px-4 py-3 bg-[#f8f9fa] border-r border-[#e9ecef]">
                <span className="text-[14px] font-semibold text-[#212529] leading-5 break-keep">매입 앨범 수량</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <input value={albumQty} onChange={e => setAlbumQty(e.target.value)} className={INPUT_CLS} placeholder="매입될 앨범 수량을 입력해주세요" />
              </div>
            </div>

            <div className="flex items-center border-b border-[#dee2e6]">
              <div className="w-[100px] shrink-0 self-stretch flex items-center px-4 py-3 bg-[#f8f9fa] border-r border-[#e9ecef]">
                <span className="text-[14px] font-semibold text-[#212529] leading-5 break-keep">유저 안내 메세지</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <input value={userMessage} onChange={e => setUserMessage(e.target.value)} className={INPUT_CLS} placeholder="해당 내용은 유저에게 안내되므로 영어로 작성해주세요" />
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-[100px] shrink-0 flex items-start px-4 py-4 bg-[#f8f9fa] border-r border-[#e9ecef] self-stretch">
                <span className="text-[14px] font-semibold text-[#212529] leading-5 break-keep">관리자 기록용 메모</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <textarea value={adminMemo} onChange={e => setAdminMemo(e.target.value)} className={TEXTAREA_CLS} style={{ minHeight: 120 }} placeholder="해당 내용은 관리자용으로만 기록됩니다" />
              </div>
            </div>
          </div>

          {/* ── 작업 정보 입력 ────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.24)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#dee2e6]">
                <h2 className="text-[18px] font-bold text-[#212529] leading-7 tracking-[-0.3px]">작업 정보 입력</h2>
                <button
                  onClick={addWorkPackage}
                  className="flex items-center gap-1.5 h-8 px-3 border border-[#dee2e6] rounded-lg text-[14px] font-bold text-[#212529] hover:bg-[#f8f9fa] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  패키지 추가하기
                </button>
              </div>

              {(hasSpecialOption || notablePkgs.length > 0) && (
                <div className="px-4 py-3 bg-[#fff4f8]">
                  <div className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                      <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="#ff558f" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M8 6v3.5M8 11h.01" stroke="#ff558f" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div>
                      <p className="text-[14px] font-bold text-[#ff558f] leading-5 tracking-[-0.3px]">구성품만 옵션이 포함된 패키지입니다</p>
                      {notablePkgs.map((p, i) => (
                        <p key={i} className="text-[12px] font-semibold text-[#868e96] leading-4 mt-0.5 tracking-[-0.3px]">
                          {p.packageList.join(' / ')}{p.userNote && <> 추가 요청 사항 / {p.userNote}</>}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {workPackages.map(wp => (
              <WorkPackageCard
                key={wp.id}
                wp={wp}
                request={request}
                isDefault={wp.id === 1}
                onUpdate={(f, v) => updateWP(wp.id, f, v)}
                onRemove={() => removeWorkPackage(wp.id)}
                assignedProducts={getProductsForWP(wp.id)}
                wpQtys={wpItemQtys[wp.id] ?? {}}
                setWpQty={(key, val) => setWpItemQtys(prev => ({
                  ...prev,
                  [wp.id]: { ...prev[wp.id], [key]: val },
                }))}
              />
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button size="lg" variant="outline" color="default" onClick={() => router.back()}>취소</Button>
            <Button size="lg" color="brand1">패키징 완료 처리</Button>
          </div>
        </div>

        {/* ── Right: sticky 패키지 내 상품 ─────────────────────────── */}
        <div
          className="w-[480px] shrink-0 sticky top-4 flex flex-col rounded-xl border border-[rgba(0,0,0,0.24)] bg-white overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dee2e6] shrink-0">
            <h3 className="text-[18px] font-bold text-[#212529] leading-7 tracking-[-0.3px]">패키지 내 상품</h3>
            <Button size="sm" color="brand1" onClick={handleAllPackedClick}>전체 상품 포장</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
            {optionGroups.map(([option, entries]) => {
              const col = optionColor(option)
              return (
                <div key={option} className="flex flex-col gap-2">
                  <div className={cn('px-4 py-2 rounded-lg text-[14px] font-bold text-center tracking-[-0.3px]', col.bg, col.text)}>
                    {option}
                  </div>

                  {entries.map(({ subPkg, si }) => {
                    const assigned = isSubPkgAssigned(subPkg.packageCode)
                    const assignedWpIds = subPkgAssignments[subPkg.packageCode] ?? []
                    const mainItems = subPkg.productList.map((prod, pi) => ({ prod, pi })).filter(({ prod }) => !prod.isPob)
                    const pobItems = subPkg.productList.map((prod, pi) => ({ prod, pi })).filter(({ prod }) => prod.isPob)

                    return (
                      <div key={subPkg.packageCode} className="border border-[#dee2e6] rounded-lg overflow-hidden">
                        {/* Package header */}
                        <div className="flex items-center justify-between px-3 py-2 bg-[#f8f9fa] border-b border-[#dee2e6]">
                          <span className={cn(
                            'text-[14px] font-semibold leading-5 tracking-[-0.3px] truncate mr-2',
                            assigned ? 'text-[#adb5bd]' : 'text-[#212529]',
                          )}>
                            📦 {subPkg.packageCode} ({subPkg.packageAlias})
                          </span>
                          {/* + icon button */}
                          <button
                            disabled={!isMultiPackage}
                            onClick={() => isMultiPackage && setActiveSubPkgCode(subPkg.packageCode)}
                            className={cn(
                              'w-6 h-6 flex items-center justify-center rounded-lg border shrink-0 bg-white transition-colors',
                              isMultiPackage
                                ? 'border-[#ff558f] hover:bg-[#fff4f8] cursor-pointer'
                                : 'border-[#ffa1c4] cursor-not-allowed',
                            )}
                            aria-label="패키지 할당"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M7 2v10M2 7h10" stroke={isMultiPackage ? '#ff558f' : '#ffa1c4'} strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>

                        {/* Items body */}
                        <div className="px-3 py-2 flex flex-col gap-2">
                          {mainItems.map(({ prod, pi }) => {
                            const totalAllocated = assigned ? getTotalAllocated(si, pi, assignedWpIds) : 0
                            const remaining = prod.qty - totalAllocated
                            const isSplit = assigned && isSplitItem(si, pi, assignedWpIds)
                            const isPartial = assigned && totalAllocated > 0 && totalAllocated < prod.qty
                            const isOver = assigned && totalAllocated > prod.qty
                            const showSplitBadge = isSplit || isPartial

                            // Color logic (Figma 209:26928):
                            // emoji: disabled when assigned
                            // name: always primary
                            // "/ qty개": if allocated>0 → strikethrough disabled; if 0 → "/" strikethrough + "0개" disabled
                            const emojiColor = assigned ? 'text-[#adb5bd]' : 'text-[#212529]'

                            return (
                              <div key={pi} className="flex flex-col gap-0.5">
                                <div className="flex items-start gap-1 text-[14px] tracking-[-0.3px]">
                                  <span className={cn('font-semibold shrink-0 leading-5', emojiColor)}>🛍</span>
                                  <span className="flex-1 min-w-0 font-semibold leading-5 text-[#212529] break-words">
                                    {prod.name}
                                  </span>
                                  {assigned ? (
                                    <span className="shrink-0 font-semibold leading-5 text-[#adb5bd] whitespace-nowrap">
                                      {totalAllocated > 0 ? (
                                        <span className="line-through">/ {totalAllocated}개</span>
                                      ) : (
                                        <><span className="line-through">/ </span>0개</>
                                      )}
                                    </span>
                                  ) : (
                                    <span className="shrink-0 font-semibold leading-5 text-[#ff558f] whitespace-nowrap">
                                      / {prod.qty}개
                                    </span>
                                  )}
                                </div>

                                {/* 분할 포장됨 badge + 남은 수량 */}
                                {showSplitBadge && (
                                  <div className="flex items-center gap-1.5 pl-4">
                                    <Badge size="sm" color="brand1">분할 포장됨</Badge>
                                    {remaining > 0 && (
                                      <span className="text-[12px] text-[#868e96] leading-4">
                                        남은 수량 {remaining}개
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* 요청반영 badge for extra quantity */}
                                {isOver && (
                                  <div className="flex items-center gap-1.5 pl-4">
                                    <Badge size="sm" color="brand1">요청반영 (+{totalAllocated - prod.qty}개)</Badge>
                                  </div>
                                )}
                              </div>
                            )
                          })}

                          {/* POB sub-items */}
                          {pobItems.length > 0 && (
                            <div className="flex flex-col gap-0.5">
                              {pobItems.map(({ prod, pi }) => {
                                const totalAllocated = assigned ? getTotalAllocated(si, pi, assignedWpIds) : 0
                                // "할당되지않은 component" keeps original color: allocated=0 → original
                                const isAllocated = assigned && totalAllocated > 0

                                return (
                                  <div key={pi} className="flex items-start gap-0.5 text-[12px] tracking-[-0.3px] pl-1">
                                    <span className={cn(
                                      'font-semibold leading-4 shrink-0',
                                      isAllocated ? 'text-[#adb5bd]' : 'text-[#868e96]',
                                    )}>
                                      - {prod.name}
                                    </span>
                                    <span className={cn(
                                      'font-normal leading-4 shrink-0',
                                      isAllocated ? 'text-[#adb5bd]' : 'text-[#ff558f]',
                                    )}>/</span>
                                    <span className={cn(
                                      'font-semibold leading-4 shrink-0',
                                      isAllocated ? 'text-[#adb5bd] line-through' : 'text-[#ff558f]',
                                    )}>
                                      {isAllocated ? totalAllocated : prod.qty}개
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}
      {activeSubPkgCode && (
        <PackageSelectDialog
          workPackages={workPackageOptions}
          currentSelection={subPkgAssignments[activeSubPkgCode] ?? []}
          onCancel={() => setActiveSubPkgCode(null)}
          onConfirm={(ids) => handleSubPkgConfirm(activeSubPkgCode, ids)}
        />
      )}
      {showAllPackConfirm && (
        <AllPackConfirmDialog
          isMultiPackage={isMultiPackage}
          onCancel={() => setShowAllPackConfirm(false)}
          onConfirm={applyAllPacked}
        />
      )}
    </div>
  )
}

// ─── WorkPackageCard ──────────────────────────────────────────────────────────
interface AssignedItem { si: number; pi: number; subPkg: SubPackage }

function WorkPackageCard({
  wp, request, isDefault, onUpdate, onRemove, assignedProducts, wpQtys, setWpQty,
}: {
  wp: WorkPackage
  request: PackagingRequest
  isDefault: boolean
  onUpdate: (field: keyof WorkPackage, val: string | boolean) => void
  onRemove: () => void
  assignedProducts: AssignedItem[]
  wpQtys: Record<string, string>
  setWpQty: (key: string, val: string) => void
}) {
  const byOption = new Map<string, Map<string, AssignedItem[]>>()
  assignedProducts.forEach(item => {
    const opt = item.subPkg.packagingOption
    if (!byOption.has(opt)) byOption.set(opt, new Map())
    const byCode = byOption.get(opt)!
    if (!byCode.has(item.subPkg.packageCode)) byCode.set(item.subPkg.packageCode, [])
    byCode.get(item.subPkg.packageCode)!.push(item)
  })

  return (
    <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.24)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f8f9fa] border-b border-[#dee2e6]">
        <span className="text-[16px] font-semibold text-[#212529] leading-6 tracking-[-0.3px]">
          📦 {isDefault ? '기본 패키지 #1' : `추가 패키지 #${wp.id}`}
        </span>
        <button
          onClick={isDefault ? undefined : onRemove}
          disabled={isDefault}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-lg border transition-colors',
            isDefault ? 'border-[#ffc5c5] text-[#ffc5c5] cursor-default' : 'border-[#ff3434] text-[#ff3434] hover:bg-[#fff4f4]',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </div>

      <div className="flex border-b border-[#dee2e6]">
        <FieldCell label="보관장소" required>
          <input value={wp.storageLocation} onChange={e => onUpdate('storageLocation', e.target.value)} className={INPUT_CLS} placeholder="보관장소" />
        </FieldCell>
        <FieldCell label="무게(g)" required>
          <input value={wp.weight} onChange={e => onUpdate('weight', e.target.value)} className={INPUT_CLS} placeholder="g" />
        </FieldCell>
        <FieldCell label="리패키징 여부" noBorderRight>
          <label className="flex items-center gap-2 cursor-pointer px-4">
            <div className={cn('w-6 h-6 rounded border flex items-center justify-center shrink-0', wp.isRepackaging ? 'bg-[#ff4d88] border-[#ff4d88]' : 'bg-white border-[#dee2e6]')}>
              {wp.isRepackaging && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <input type="checkbox" checked={wp.isRepackaging} onChange={e => onUpdate('isRepackaging', e.target.checked)} className="hidden" />
            <span className="text-[14px] text-[#212529] leading-5">리패키징 필요</span>
          </label>
        </FieldCell>
      </div>

      <div className="flex border-b border-[#dee2e6]">
        <FieldCell label="가로(cm)" required>
          <input value={wp.width} onChange={e => onUpdate('width', e.target.value)} className={INPUT_CLS} placeholder="w" />
        </FieldCell>
        <FieldCell label="세로(cm)" required>
          <input value={wp.height} onChange={e => onUpdate('height', e.target.value)} className={INPUT_CLS} placeholder="h" />
        </FieldCell>
        <FieldCell label="길이(cm)" required noBorderRight>
          <input value={wp.length} onChange={e => onUpdate('length', e.target.value)} className={INPUT_CLS} placeholder="l" />
        </FieldCell>
      </div>

      <div className="px-4 py-3 bg-[#f8f9fa] border-b border-[#dee2e6]">
        <span className="text-[14px] font-semibold text-[#212529] leading-5 tracking-[-0.3px]">패키지 내 상품 정보</span>
      </div>

      <div className="p-4">
        {assignedProducts.length === 0 ? (
          <div className="flex items-start gap-2 px-4 py-3 bg-white border border-[#008fff] rounded-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="6.5" stroke="#008fff" strokeWidth="1.5"/>
              <path d="M8 7v4M8 5.5h.01" stroke="#008fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-[14px] font-bold text-[#008fff] leading-5 tracking-[-0.3px]">
              포장되지 않은 상품은 수량을 0으로 표기 후, 패키지를 추가해 포장된 수량을 기입해주세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from(byOption.entries()).map(([opt, byCode]) => {
              const col = optionColor(opt)
              return (
                <div key={opt}>
                  <div className={cn('px-3 py-1.5 rounded-lg mb-2 text-[13px] font-bold text-center', col.bg, col.text)}>{opt}</div>
                  {Array.from(byCode.entries()).map(([pkgCode, items]) => {
                    const subPkg = items[0].subPkg
                    return (
                      <div key={pkgCode} className="border border-[#dee2e6] rounded-lg overflow-hidden mb-2 last:mb-0">
                        <div className="px-3 py-2 bg-[#f8f9fa] border-b border-[#dee2e6] text-[13px] font-semibold text-[#212529]">
                          📦 {subPkg.packageCode} ({subPkg.packageAlias})
                        </div>
                        <div className="px-3 py-1 flex flex-col divide-y divide-[#f1f3f5]">
                          {items.map(({ si, pi }) => {
                            const prod = request.packages[si].productList[pi]
                            const key = `${si}-${pi}`
                            return (
                              <div key={key} className="flex items-center justify-between gap-2 py-2">
                                <span className={cn('flex-1 min-w-0 text-[13px] leading-5 break-words', prod.isPob ? 'text-[#adb5bd]' : 'text-[#212529]')}>
                                  {prod.isPob ? '🎁' : '🛍'} {prod.name}
                                </span>
                                {/* qty input: allow 0 (모든 item 할당 가능, 수량 0 포함) */}
                                <input
                                  type="number"
                                  min={0}
                                  value={wpQtys[key] ?? String(prod.qty)}
                                  onChange={e => setWpQty(key, e.target.value)}
                                  className="w-16 h-8 px-2 text-center bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-[13px] shrink-0"
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const INPUT_CLS = 'w-full h-10 px-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-[16px] text-[#212529] placeholder:text-[#868e96] focus:outline-none focus:border-[#adb5bd] tracking-[-0.3px]'
const TEXTAREA_CLS = 'w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-[16px] text-[#212529] placeholder:text-[#868e96] focus:outline-none focus:border-[#adb5bd] resize-none tracking-[-0.3px]'

function FieldCell({ label, required, noBorderRight, children }: { label: string; required?: boolean; noBorderRight?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-[1_0_0] items-center min-w-0 min-h-[72px]', !noBorderRight && 'border-r border-[#dee2e6]')}>
      <div className="w-[100px] shrink-0 self-stretch flex items-center gap-1 px-4 py-3 bg-[#f8f9fa] border-r border-[#e9ecef]">
        <span className="text-[14px] font-semibold text-[#212529] leading-5 break-keep tracking-[-0.3px]">{label}</span>
        {required && <div className="w-1.5 h-1.5 rounded-full bg-[#ff3434] shrink-0" />}
      </div>
      <div className="flex-1 min-w-0 px-4 py-3">{children}</div>
    </div>
  )
}
